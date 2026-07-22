"use server"
import z from "zod"
import { createClient } from "../supabase/server"
import { ListMemberRole, ServerActionResponse } from "../definitions"

const Schema = z.object({
    listId: z.uuid(),
    roles: z.array(z.enum(["owner", "editor", "viewer"]))
})

type ResponseType = ServerActionResponse & { data?: boolean }
export async function isListMemberWithRoles(listId: string, roles: ListMemberRole[]): Promise<ResponseType> {

    // validate fields
    const validatedFields = Schema.safeParse({ listId, roles })
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
        if (!userData?.user) {
            return {
                success: true,
                data: false,
                message: 'success',
            }
        }


        const { count, error } = await supabase
            .from("list_members")
            .select("*", { count: "exact", head: true })
            .eq("list_id", validatedFields.data.listId) // current list
            .eq("user_id", userData?.user?.id) // current user is a member
            .in("role", validatedFields.data.roles) // current user has role
            .limit(1)

        if (error) throw error

        if (!count) {
            // user is NOT member with roles
            return {
                success: true,
                data: false,
                message: 'success',
            }
        } else {
            // user IS member with roles
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