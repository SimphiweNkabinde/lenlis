"use server"
import z from "zod"
import { ServerActionResponse } from "../definitions"
import { createClient } from "../supabase/server"
import { revalidatePath } from "next/cache"


export async function saveList(id: string, options?: { revalidatePath: string }): Promise<ServerActionResponse> {
    // validate fields
    const validateId = z.uuid().safeParse(id)

    if (!validateId.success) {
        return {
            success: false,
            message: 'Validation Error',
            errors: { [validateId.error.name]: [validateId.error.message] },
        };
    }

    // check that the list is public
    try {
        const supabase = await createClient()
        const { error, data } = await supabase.from("lists").select("visibility").eq("id", id).single()
        if (error) throw error
        if (data === null) {
            return {
                success: false,
                message: 'List not found',
            };
        }
        if (data?.visibility !== 'public') {
            return {
                success: false,
                message: 'This list is not public. It cannot be copied',
            };
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Database Error: Failed to save list.',
        }
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

        // save list 
        const { error: saveError } = await supabase.from("saved_lists")
            .insert({ list_id: validateId.data, user_id: sessionData.session?.user.id })
        if (saveError) throw saveError

        if (options?.revalidatePath) revalidatePath(options.revalidatePath)
        return {
            success: true,
            message: 'list saved',
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Database Error: Failed to save list.',
        };
    }
}