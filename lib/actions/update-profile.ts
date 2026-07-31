"use server"

import z from "zod"
import { ServerActionResponse } from "../definitions";
import { createClient } from "../supabase/server";

const Schema = z.object(
    {
        name: z.string().min(1, "must be atleast 5 characters long")
            .max(25, "Too long. Must not exceed 25 characters")
    })

export async function updateProfile(profile: { name: string }): Promise<ServerActionResponse> {
    // validate fields
    const validatedFields = Schema.safeParse(profile)

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Validation Error',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // update profile
    const payload = { name: validatedFields.data.name }

    try {
        const supabase = await createClient()
        const { data: { user }, error: userDataError } = await supabase.auth.getUser()
        if (userDataError) throw userDataError

        if (!user || user.is_anonymous) {
            return {
                success: false,
                message: "No profile found"
            }
        }
        const { error } = await supabase.from("profiles").update(payload).eq("id", user.id)
        if (error) throw error

        return {
            success: true,
            message: 'profile updated'
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Database Error: Failed to update profile.',
        };
    }
}
