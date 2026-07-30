"use server"
import z from "zod"
import { ServerActionResponse } from "../definitions"
import { createClient } from "../supabase/server"
import { isListMemberWithRoles } from "./is-list-member-with-roles"
import { revalidatePath } from "next/cache"

const Schema = z.object({
    listId: z.uuid(),
    email: z.email()
})

export async function removeInvite(listId: string, email: string): Promise<ServerActionResponse & { data?: { id: string } }> {
    // validate id
    const validatedFields = Schema.safeParse({ listId, email })

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Validation Error',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }


    // validate list membership
    try {
        const { data: hasPermission, success, message, errors } = await isListMemberWithRoles(validatedFields.data.listId, ["owner"])
        if (!success) throw { success, message, errors }
        if (!hasPermission) {
            return {
                success: false,
                message: 'Permission Denied'
            }
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Server Error: Couldn't verify permissions.",
        };
    }

    try {
        const supabase = await createClient()

        // DELETE INVITE
        const { error: deleteError, } = await supabase.from("invites")
            .delete().eq("list_id", validatedFields.data.listId).eq("invitee_email", email)
        if (deleteError) throw deleteError

        return {
            success: true,
            message: 'Invite deleted',
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Server Error: Failed to delete invite.',
        };
    }
}