"use server"

import z from "zod"
import { createClient } from "../supabase/server";

const Schema = z.object({
    id: z.uuid(),
    name: z.string().min(1)
})

export type ResponseType = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
}
export async function updateListName(id: string, name: string): Promise<ResponseType> {

    // validate fields
    const validatedFields = Schema.safeParse({ id, name })
    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Validation Error',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // validate user role
    try {
        const supabase = await createClient()
        const { data: userData } = await supabase.auth.getUser()


        const { count, error } = await supabase
            .from("list_members")
            .select("*", { count: "exact", head: true })
            .eq("list_id", validatedFields.data.id) // current list
            .eq("user_id", userData?.user?.id) // current user is a member
            .in("role", ["owner", "editor"]) // current user is an owner or editor
            .limit(1)

        if (error) throw error

        if (!count) {
            return {
                success: false,
                message: 'Permission Denied',
            }
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'A database error occurred. Please try again.',
        };
    }

    // update list name
    try {
        const supabase = await createClient()
        const { error: updateError } = await supabase.from("lists").update({ name: validatedFields.data.name }).eq("id", validatedFields.data.id)
        if (updateError) throw updateError;

        return {
            success: true,
            message: 'list name updated',
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'A database error occurred. Please try again.',
        };
    }
}