"use server"

import z from "zod"
import { ServerActionResponse } from "../definitions";
import { isListMemberWithRoles } from "./is-list-member-with-roles";
import { createClient } from "../supabase/server";

export async function deleteListItem(listId: string, id: string): Promise<ServerActionResponse> {
    // validate fields
    const validatedFields = z
        .object({ listId: z.uuid(), id: z.uuid() })
        .safeParse({ listId, id })

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Validation Error',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // validate list membership
    const { data: hasPermission, success, message, errors } = await isListMemberWithRoles(validatedFields.data.listId, ["owner", "editor"])
    if (!success) {
        return { success, message, errors }
    }
    if (!hasPermission) {
        return {
            success: false,
            message: 'Permission Denied'
        }
    }

    // delete list item
    try {
        const supabase = await createClient()
        const { error } = await supabase.from("list_items").delete().eq("id", validatedFields.data.id)
        if (error) throw error

        return {
            success: true,
            message: 'list item deleted'
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Database Error: Failed to update list item.',
        };
    }
}
