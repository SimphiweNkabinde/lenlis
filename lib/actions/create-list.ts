"use server"
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";


export async function createList({ name, item }: { name?: string | null, item: string }) {
    let newListId
    try {
        const supabase = await createClient()

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionData.session === null && sessionError === null) {
            const { data, error } = await supabase.auth.signInAnonymously()
        }

        // create list
        const { error: newListError, data: newListData } = await supabase.from("lists").insert({ name }).select("id").single()
        if (newListError) throw newListError

        // set list ownership
        const { error: ownershipError, data: ownershipData } = await supabase.from("list_members")
            .insert({ list_id: newListData.id, user_id: sessionData.session?.user.id, role: "owner" })
        if (ownershipError) throw ownershipError

        // create first list item
        const { error: listItemError } = await supabase.from("list_items").insert({ list_id: newListData?.id, text: item })
        newListId = newListData?.id
        if (listItemError) throw listItemError

    } catch (error) {
        console.log(error)
        return {
            message: 'Database Error: Failed to Create list.',
        };
    }

    redirect(`/lists/${newListId}/edit`)
}