"use server"
import z from "zod"
import { ServerActionResponse } from "../definitions"
import { createClient } from "../supabase/server"
import { isListMemberWithRoles } from "./is-list-member-with-roles"
import { revalidatePath } from "next/cache"

export async function removeInvite(inviteId: string): Promise<ServerActionResponse & { data?: { id: string } }> {
    // validate id
    const validatedId = z.uuid().safeParse(inviteId)

    if (!validatedId.success) {
        return {
            success: false,
            message: 'Validation Error',
            errors: { [validatedId.error.name]: [validatedId.error.message] },
        };
    }


    // validate list membership
    let listId;
    try {
        const supabase = await createClient()
        const { data: listData, error: listError } = await supabase.from("invites").select("listId:list_id").eq("id", inviteId).single()
        if (listError) throw listError
        const { data: hasPermission, success, message, errors } = await isListMemberWithRoles(listData.listId, ["owner"])
        if (!success) throw { success, message, errors }
        if (!hasPermission) {
            return {
                success: false,
                message: 'Permission Denied'
            }
        }
        listId = listData.listId
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
            .delete().eq("id", validatedId.data)
        if (deleteError) throw deleteError

        revalidatePath(`/lists/${listId}/edit`)

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