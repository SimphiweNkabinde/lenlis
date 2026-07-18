"use server"
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { ServerActionResponse } from "../definitions";


export async function createList(name: string): Promise<ServerActionResponse> {
    let newListId
    try {
        const supabase = await createClient()
        let userId

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        userId = sessionData.session?.user.id

        if (!userId) {
            const { data: anonSignInData, error: anonSignInError } = await supabase.auth.signInAnonymously()
            if (anonSignInError) throw anonSignInError
            userId = anonSignInData.user?.id
        }

        // create list
        const { error: newListError, data: newListData } = await supabase.from("lists").insert({ name }).select("id").single()
        if (newListError) throw newListError

        // set list ownership
        const { error: ownershipError, data: ownershipData } = await supabase.from("list_members")
            .insert({ list_id: newListData.id, user_id: userId, role: "owner" })
        if (ownershipError) throw ownershipError

        newListId = newListData?.id

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Database Error: Failed to Create list.',
        };
    }

    redirect(`/lists/${newListId}/edit`)
}