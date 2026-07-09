"use server"

import z from "zod"
import { ServerActionResponse } from "../definitions";
import { isListMemberWithRoles } from "./is-list-member-with-roles";
import { createClient } from "../supabase/server";

const Schema = z.object({
    listId: z.uuid(),
    id: z.uuid(),
    text: z.string().min(1).optional(),
    checked: z.boolean().optional(),
    amount: z.number().optional(),
    position: z.number().optional()
})

export async function updateListItem(listId: string, id: string, item: { text?: string, checked?: boolean, amount?: number, position?: number }): Promise<ServerActionResponse> {
    // validate fields
    const validatedFields = Schema.safeParse({ listId, id, ...item })

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

    // update list item
    const { checked: is_checked, text, amount, id: itemId, position } = validatedFields.data
    const payload = { is_checked, text, amount, position }

    try {
        const supabase = await createClient()
        const { error } = await supabase.from("list_items").update(payload).eq("id", itemId)
        if (error) throw error

        return {
            success: true,
            message: 'list item updated'
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Database Error: Failed to update list item.',
        };
    }
}
