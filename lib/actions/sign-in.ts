"use server"
import z from "zod";
import { createClient } from "../supabase/server";
import { ServerActionResponse } from "../definitions";
import { redirect } from "next/navigation";

export async function signInWithEmail(email: string): Promise<ServerActionResponse> {
    const validatedEmail = z.email().safeParse(email)
    let isAnonymous;

    if (!validatedEmail.success) {
        return {
            success: false,
            message: 'Validation Error',
            errors: { email: validatedEmail.error.flatten().formErrors }
        };
    }

    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser();
        isAnonymous = user?.is_anonymous;
        // session exists & is already authenticated
        if (user && !isAnonymous) {
            return {
                success: false,
                message: 'already signed in'
            };
        }

        // RULE 1: If no session exists, or the session is already authenticated
        if (!user || !isAnonymous) {
            // sign in existing user
            const { error: signInError } = await supabase.auth.signInWithOtp({
                email: validatedEmail.data,
                options: { shouldCreateUser: true }
            });
            if (signInError) throw signInError;
        }

        // RULE 2: An anonymous session exists
        if (user && isAnonymous) {
            const { data: emailExists, error: rpcError } = await supabase.rpc('check_if_email_exists', { email_to_check: validatedEmail.data });

            if (rpcError) throw rpcError;

            if (!emailExists) {
                //  Convert the anonymous user to an authenticated user.
                // This keeps the same UUID, keeping their stored lists intact!
                const { error: linkUserError } = await supabase.auth.updateUser({ email: validatedEmail.data });
                if (linkUserError) throw linkUserError;
            } else {
                // Sign into existing email account and discard the anonymous one.
                // (The browser session will overwrite the anonymous token with the existing account's token)
                const { error: signInError } = await supabase.auth.signInWithOtp({
                    email: validatedEmail.data,
                    options: { shouldCreateUser: false } // Safety check: shouldn't create anyway since it exists
                });
                if (signInError) throw signInError;
            }
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Database Error: Failed to sign in.'
        }
    }
    const isAnonParam = isAnonymous === true ? "&isanon=true" : ""
    redirect(`/email-verification?email=${encodeURIComponent(validatedEmail.data)}${isAnonParam}`)

}