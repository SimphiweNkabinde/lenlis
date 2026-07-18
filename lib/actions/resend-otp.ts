"use server"
import { createClient } from "../supabase/server";
import { ServerActionResponse } from "../definitions";
import z from "zod";


export async function resendOtp(email: string, isAnonymous = false): Promise<ServerActionResponse> {
    const validatedEmail = z.email().safeParse(email)

    if (!validatedEmail.success) {
        return {
            success: false,
            message: 'Validation Error',
            errors: { email: validatedEmail.error.flatten().formErrors }
        };
    }
    try {
        const supabase = await createClient()

        if (isAnonymous === true) {
            const { error: resendError, data } = await supabase.auth.resend({
                type: "email_change",
                email: validatedEmail.data
            })
            if (resendError) throw resendError
        } else {
            const { error: signInErr } = await supabase.auth.signInWithOtp({
                email: email,
                options: { shouldCreateUser: false }
            })
            if (signInErr) throw signInErr
        }
        return {
            success: true,
            message: "verification email resent"
        }


    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Database Error: Failed to resend OTP.',
        };
    }

}