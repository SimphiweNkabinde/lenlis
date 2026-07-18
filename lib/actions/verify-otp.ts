"use server"

import { redirect } from "next/navigation";
import z from "zod";
import { ServerActionResponse } from "../definitions";
import { createClient } from "../supabase/server";

const Schema = z.object({
    otp: z.string().length(6),
    email: z.email(),
})
export async function verifyOtp(otp: string, email: string, isAnonymous = false): Promise<ServerActionResponse> {
    const validatedFields = Schema.safeParse({ otp, email })

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Validation Error',
            errors: validatedFields.error.flatten().fieldErrors
        };
    }

    try {
        const supabase = await createClient()
        const { data: { session }, error: OtpError } = await supabase.auth.verifyOtp({
            email: validatedFields.data.email,
            token: validatedFields.data.otp,
            type: isAnonymous === true ? "email_change" : "email",
        })

        if (OtpError) throw OtpError
    } catch (error) {
        console.error(error)
        const { code } = error! as { code: string }
        if (code == 'otp_expired') {
            return {
                success: false,
                message: 'verification code has expired or is invalid',
            };
        }
        return {
            success: false,
            message: 'Database Error: Failed to verify OTP.',
        };
    }

    redirect("/")
}