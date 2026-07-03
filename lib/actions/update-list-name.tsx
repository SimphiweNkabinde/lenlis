"use server"

import z from "zod"
import { createClient } from "../supabase/server";
import { ServerActionResponse } from "../definitions";
import { isListMemberWithRoles } from "./is-list-member-with-roles";

const Schema = z.object({
    id: z.uuid(),
    name: z.string().min(1).optional(),
    hasChecks: z.boolean().optional(),
    hasAmounts: z.boolean().optional()
})

export async function updateList(id: string, listProps: { name?: string, hasChecks?: boolean, hasAmounts?: boolean }): Promise<ServerActionResponse> {

    // validate fields
    const validatedFields = Schema.safeParse({ id, ...listProps })
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

    // update list item
    const { hasChecks: has_checks, hasAmounts: has_amounts, name } = validatedFields.data
    const payload = { name, has_checks, has_amounts }

    try {
        const supabase = await createClient()
        const { error } = await supabase.from("lists").update(payload).eq("id", validatedFields.data.id)
        if (error) throw error

        return {
            success: true,
            message: 'list updated'
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Database Error: Failed to update list.',
        };
    }
}