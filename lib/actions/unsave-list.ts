"use server"
import z from "zod"
import { ServerActionResponse } from "../definitions"
import { createClient } from "../supabase/server"
import { revalidatePath } from "next/cache"


export async function unsaveList(id: string, options?: { revalidatePath: string }): Promise<ServerActionResponse> {
    // validate fields
    const validateId = z.uuid().safeParse(id)

    if (!validateId.success) {
        return {
            success: false,
            message: 'Validation Error',
            errors: { [validateId.error.name]: [validateId.error.message] },
        };
    }

    try {
        const supabase = await createClient()

        // set session
        let session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        session = sessionData.session

        if (session === null) {
            const { data, error } = await supabase.auth.signInAnonymously()
            if (error) throw error
            session = data.session
        }

        // unsave list 
        const { error: deleteError } = await supabase.from("saved_lists")
            .delete()
            .eq("list_id", validateId.data)
            .eq("user_id", sessionData.session?.user.id)
        if (deleteError) throw deleteError

        if (options?.revalidatePath) revalidatePath(options.revalidatePath)
        return {
            success: true,
            message: 'list unsaved',
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Database Error: Failed to unsave list.',
        };
    }
}