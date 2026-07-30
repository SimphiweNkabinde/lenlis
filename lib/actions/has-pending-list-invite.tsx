"use server"
import z from "zod"
import { createClient } from "../supabase/server"
import { ServerActionResponse } from "../definitions"

type ResponseType = Omit<ServerActionResponse, "data"> & { data?: boolean }
export async function hasPendingListInvite(listId: string): Promise<ResponseType> {

    const validateId = z.uuid().safeParse(listId)
    // validate id
    if (!validateId.success) {
        return {
            success: false,
            message: 'Validation Error',
            errors: { [validateId.error.name]: [validateId.error.message] },
        };
    }

    // validate user role
    try {
        const supabase = await createClient()
        const { data: userData } = await supabase.auth.getUser()
        if (!userData?.user?.email) {
            return {
                success: true,
                data: false,
                message: 'success',
            }
        }

        const { count, error } = await supabase
            .from("invites")
            .select("*", { count: "exact", head: true })
            .eq("list_id", validateId.data) // current list
            .eq("invitee_email", userData?.user?.email)
            .eq("status", "pending")
            .limit(1)

        if (error) throw error

        if (!count) {
            // user has no pending invite
            return {
                success: true,
                data: false,
                message: 'success',
            }
        } else {
            // user has pending invite
            return {
                success: true,
                data: true,
                message: 'success',
            }
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'A database error occurred. Please try again.',
        };
    }
}