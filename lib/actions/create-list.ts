"use server"
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { ServerActionResponse } from "../definitions";


export async function createList(name: string): Promise<ServerActionResponse> {
    let newListId
    try {
        const supabase = await createClient()
        let session

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        session = sessionData.session

        if (session === null) {
            const { data, error } = await supabase.auth.signInAnonymously()
            if (error) throw error
            session = data.session
        }

        // create list
        const { error: newListError, data: newListData } = await supabase.from("lists").insert({ name }).select("id").single()
        if (newListError) throw newListError

        // set list ownership
        const { error: ownershipError, data: ownershipData } = await supabase.from("list_members")
            .insert({ list_id: newListData.id, user_id: sessionData.session?.user.id, role: "owner" })
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