"use server"

import z from "zod"
import { createClient } from "../supabase/server";
import { ServerActionResponse } from "../definitions";
import { isListMemberWithRoles } from "./is-list-member-with-roles";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function deleteList(id: string, options?: { revalidatePath?: string, redirect?: string },): Promise<ServerActionResponse> {

    // validate fields
    const validateId = z.uuid().safeParse(id)
    if (!validateId.success) {
        return {
            success: false,
            message: 'Validation Error',
            errors: { [validateId.error.name]: [validateId.error.message] },
        };
    }

    // validate list membership
    const { data: hasPermission, success, message, errors } = await isListMemberWithRoles(validateId.data, ["owner"])
    if (!success) return ({ success, message, errors })
    if (!hasPermission) return ({
        success: false,
        message: 'Permission Denied'
    })

    // delete list
    try {
        const supabase = await createClient()
        const { error: deleteError } = await supabase.from("lists").delete().eq("id", validateId.data)
        if (deleteError) throw deleteError;

        if (options?.revalidatePath) revalidatePath(options.revalidatePath)
        if (!options?.redirect) {
            return {
                success: true,
                message: 'list deleted',
            };
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'A database error occurred. Please try again.',
        };
    }

    redirect(options.redirect)
}