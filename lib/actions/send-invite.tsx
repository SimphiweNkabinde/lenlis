"use server"
import z from "zod"
import { ServerActionResponse } from "../definitions"
import { createClient } from "../supabase/server"
import { isListMemberWithRoles } from "./is-list-member-with-roles"
import { Resend } from "resend"
import { InviteEmailTemplate } from "../email-templates"

const Schema = z.object({
    listId: z.uuid(),
    inviteeEmail: z.email()
})

export async function sendInvite(listId: string, inviteeEmail: string): Promise<ServerActionResponse & { data?: { id: string } }> {
    // validate fields
    const validatedFields = Schema.safeParse({
        listId,
        inviteeEmail,
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
    const { data: hasPermission, success, message, errors } = await isListMemberWithRoles(validatedData.listId, ["owner"])
    if (!success) {
        return { success, message, errors }
    }
    if (!hasPermission) {
        return {
            success: false,
            message: 'Permission Denied'
        }
    }

    try {
        const supabase = await createClient()
        const { data: userData } = await supabase.auth.getUser()

        // CREATE INVITE
        const { error, data: invteData } = await supabase.from("invites")
            .insert({
                list_id: validatedData.listId,
                sender_id: userData.user?.id,
                invitee_role: "editor",
                invitee_email: validatedData.inviteeEmail,
            })
        if (error) throw error

        // PROCESS EMAIL
        const resend = new Resend(process.env.RESEND_API_KEY)
        const origin = process.env.NODE_ENV == "production" ? "https://lenlis.online" : "http://localhost:3000"
        // get list
        const { data: listName, error: listError } = await supabase.from("lists").select("name").eq("id", validatedData.listId).single()
        if (listError) throw listError
        // get user profile
        const { data: profileData, error: profileError } = await supabase.from("profiles").select("name").eq("id", userData.user?.id).single()
        if (profileError) throw profileError

        const emailContent = InviteEmailTemplate({
            inviteUrl: `${origin}/lists/${validatedData.listId}/edit`,
            listName: listName?.name,
            senderName: profileData?.name
        })

        const { data: emailData, error: emailError } = await resend.emails.send({
            from: 'Lenlis <notifications@lenlis.online>',
            to: [validatedData.inviteeEmail],
            subject: "List Shared with you: " + listName.name,
            react: emailContent
        })
        if (emailError) {
            console.error(emailError)
        }
        return {
            success: true,
            message: 'Invite sent to recepient',
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Server Error: Failed to create invite.',
        };
    }
}