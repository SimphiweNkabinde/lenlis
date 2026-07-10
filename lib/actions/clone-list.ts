"use server"
import z from "zod"
import { ServerActionResponse } from "../definitions"
import { createClient } from "../supabase/server"


export async function cloneList(id: string): Promise<ServerActionResponse> {
    // validate fields
    const validateId = z.uuid().safeParse(id)

    if (!validateId.success) {
        return {
            success: false,
            message: 'Validation Error',
            errors: { [validateId.error.name]: [validateId.error.message] },
        };
    }

    // check that the list is public
    try {
        const supabase = await createClient()
        const { error, data } = await supabase.from("lists").select("visibility").eq("id", id).single()
        if (error) throw error
        if (data === null) {
            return {
                success: false,
                message: 'List not found',
            };
        }
        if (data?.visibility !== 'public') {
            return {
                success: false,
                message: 'This list is not public. It cannot be copied',
            };
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Database Error: Failed to Copy list.',
        }
    }

    // clone list 
    try {
        const supabase = await createClient()

        // set session
        let session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        session = sessionData.session

        if (session === null) {
            const { data, error } = await supabase.auth.signInAnonymously()
            if (error) throw error
            session = data.session
        }

        // get original list
        const { data: originalList, error: fetchError } = await supabase.from("lists")
            .select("name, has_amounts, has_checks, list_items (text, is_checked, amount)")
            .order("position", { referencedTable: "list_items" })
            .eq("id", id)
            .single()
        if (fetchError) throw fetchError

        // insert copy list data
        const { data: listCopyData, error: listCopyError } = await supabase.from("lists").insert({
            name: originalList?.name,
            has_amounts: originalList?.has_amounts,
            has_checks: originalList?.has_checks,
        }).select("id").single()
        if (listCopyError) throw listCopyError

        // set list ownership
        const { error: ownershipError, data: ownershipData } = await supabase.from("list_members")
            .insert({ list_id: listCopyData.id, user_id: sessionData.session?.user.id, role: "owner" })
        if (ownershipError) throw ownershipError

        // insert copy list items
        const { error: copyItemsError } = await supabase.from("list_items")
            .insert(originalList!?.list_items.map((item, index) => ({
                list_id: listCopyData.id,
                text: item.text,
                amount: item.amount,
                is_checked: item.is_checked,
                position: (index + 1) * 1000
            })))
        if (copyItemsError) throw copyItemsError

        return {
            success: true,
            message: 'list copied',
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Database Error: Failed to Copy list.',
        };
    }
}