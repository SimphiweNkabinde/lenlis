"use server"
import z from "zod"
import { ServerActionResponse } from "../definitions"
import { createClient } from "../supabase/server"
import { isListMemberWithRoles } from "./is-list-member-with-roles"

const Schema = z.object({
    listId: z.uuid(),
    text: z.string().min(1),
    checked: z.boolean().optional(),
    amount: z.number().optional(),
    position: z.number()
})

type listItemProps = { text: string, checked?: boolean, amount?: number, position?: number }

export async function addListItem(listId: string, listItem: listItemProps): Promise<ServerActionResponse & { data?: { id: string } }> {
    // validate fields
    const validatedFields = Schema.safeParse({
        listId,
        text: listItem.text,
        checked: listItem.checked,
        amount: listItem.amount,
        position: listItem.position
    })

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Validation Error',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { data: validatedData } = validatedFields

    // validate list membership
    const { data: hasPermission, success, message, errors } = await isListMemberWithRoles(validatedData.listId, ["owner", "editor"])
    if (!success) {
        return { success, message, errors }
    }
    if (!hasPermission) {
        return {
            success: false,
            message: 'Permission Denied'
        }
    }

    // add list item
    try {
        const supabase = await createClient()
        const { error, data } = await supabase.from("list_items")
            .insert({
                list_id: validatedData.listId,
                text: validatedData.text,
                is_checked: validatedData.checked,
                amount: validatedData.amount,
                position: validatedData.position
            }).select("id").single()
        if (error) throw error

        return {
            success: true,
            message: 'list item added',
            data
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Database Error: Failed to Create list.',
        };
    }
}