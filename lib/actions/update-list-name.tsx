"use server"

import z from "zod"
import { createClient } from "../supabase/server";
import { ServerActionResponse } from "../definitions";
import { isListMemberWithRoles } from "./is-list-member-with-roles";

const Schema = z.object({
    id: z.uuid(),
    name: z.string().min(1)
})

export async function updateListName(id: string, name: string): Promise<ServerActionResponse> {

    // validate fields
    const validatedFields = Schema.safeParse({ id, name })
    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Validation Error',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // validate list membership
    const { data: hasPermission, success, message, errors } = await isListMemberWithRoles(validatedFields.data.id, ["owner", "editor"])
    if (!success) return ({ success, message, errors })
    if (!hasPermission) return ({
        success: false,
        message: 'Permission Denied'
    })

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