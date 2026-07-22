import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Toaster } from "sonner"
import ListWrapper from "./_components/list-wrapper"
import { isListMemberWithRoles } from "@/lib/actions/is-list-member-with-roles"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const supabase = await createClient()

    const { data: hasRole } = await isListMemberWithRoles(id, ["owner", "editor"])
    if (!hasRole) return notFound()

    const { data, error } = await supabase.from('lists')
        .select("id, name, hasChecks:has_checks, hasAmounts:has_amounts, visibility, listItems:list_items (id, text, checked:is_checked, amount, position), list_members(user_id, role) , createdAt:created_at")
        .order("position", { referencedTable: "list_items" })
        .eq("id", id)
        .single()

    const members = data?.list_members || []
    const { data: membersProfileData } = await supabase.from("profiles").select("id, username, avatarUrl:avatar_url").in("id", members.map(i => i.user_id))
    const memberProfiles = members.map(member => ({
        role: member.role,
        username: membersProfileData?.find(item => item.id == member.user_id)?.username,
        avatarUrl: membersProfileData?.find(item => item.id == member.user_id)?.avatarUrl
    }))

    if (!data) {
        notFound()
    }

    return (
        <>
            <ListWrapper listData={{ ...data }} defaultListItems={data.listItems} members={memberProfiles} />
            <Toaster position="bottom-center" />
        </>
    )
}
