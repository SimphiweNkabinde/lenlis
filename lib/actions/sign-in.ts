"use server"
import z from "zod";
import { createClient } from "../supabase/server";
import { ServerActionResponse } from "../definitions";

export async function signInWithEmail(email: string): Promise<ServerActionResponse & { data?: { email: string, convertAnonToEmail?: boolean } }> {
    const validatedEmail = z.email().safeParse(email)

    if (!validatedEmail.success) {
        return {
            success: false,
            message: 'Validation Error',
            errors: { email: validatedEmail.error.flatten().formErrors },
            data: { email }
        };
    }

    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser();

        // RULE 1: If no session exists, or the session is already authenticated
        if (!user || !user?.is_anonymous) {
            // sign in existing user
            const { error: signInError } = await supabase.auth.signInWithOtp({
                email: validatedEmail.data,
                options: { shouldCreateUser: true }
            });
            if (signInError) throw signInError;
            return {
                success: true,
                message: "verification code sent to " + email,
                data: { email }
            }
        }

        // RULE 2: An anonymous session exists
        if (user && user?.is_anonymous) {
            const { data: emailExists, error: rpcError } = await supabase.rpc('check_if_email_exists', { email_to_check: validatedEmail.data });

            if (rpcError) throw rpcError;

            if (!emailExists) {
                //  Convert the anonymous user to an authenticated user.
                // This keeps the same UUID, keeping their stored lists intact!
                const { error: linkUserError } = await supabase.auth.updateUser({ email: validatedEmail.data });
                if (linkUserError) throw linkUserError;
                return {
                    success: true,
                    message: "verification code sent to " + email,
                    data: { email, convertAnonToEmail: true },
                }
            } else {
                // Sign into existing email account and discard the anonymous one.
                // (The browser session will overwrite the anonymous token with the existing account's token)
                const { error: signInError } = await supabase.auth.signInWithOtp({
                    email: validatedEmail.data,
                    options: { shouldCreateUser: false } // Safety check: shouldn't create anyway since it exists
                });
                if (signInError) throw signInError;
                return {
                    success: true,
                    message: "verification code sent to " + email,
                    data: { email }
                }
            }

        }
        return {
            success: false,
            message: 'already signed in'
        };

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Database Error: Failed to sign in.'
        }
    }
}