import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Toaster } from "sonner"
import ListWrapper from "./_components/list-wrapper"
import { isListMemberWithRoles } from "@/lib/actions/is-list-member-with-roles"
import { hasPendingListInvite } from "@/lib/actions/has-pending-list-invite"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const supabase = await createClient()

    // does list exist
    const { count: exists, error: existsError } = await supabase
        .from("lists")
        .select("id", { count: "exact", head: true })
        .eq("id", id).limit(1)
    if (!exists) {
        notFound()
    }

    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userData?.user?.is_anonymous || !userData.user?.email) {
        redirect(`/auth/login?next=/lists/${id}/edit`)
    }

    const { data: isMember } = await isListMemberWithRoles(id, ["owner", "editor"])

    if (!isMember) {
        // check if invited
        const { data: hasInvite } = await hasPendingListInvite(id)
        if (!hasInvite) redirect("/?message=You don't have access to this list. Make sure you're logged in to the right account.")

        const { data: rpcData, error: rpcError } = await supabase.rpc("accept_list_invite", { input_list_id: id })
        if (rpcError || !rpcData.success) {
            console.error({ rpcError, rpcData });
            redirect("/?message=Something went wrong. We couldn't verify your access to this list")
        }
    }

    const { data, error } = await supabase.from('lists')
        .select("id, name, hasChecks:has_checks, hasAmounts:has_amounts, listItems:list_items (id, text, checked:is_checked, amount, position), list_members(user_id, role) , createdAt:created_at")
        .order("position", { referencedTable: "list_items" })
        .eq("id", id)
        .single()

    const { data: pendingInvites, error: invitesError } = await supabase.from("invites").select("email:invitee_email, role:invitee_role")
        .eq("list_id", id)
        .eq("status", "pending")

    const members = data?.list_members || []
    const { data: membersProfileData } = await supabase.from("profiles").select("id, name, avatarUrl:avatar_url").in("id", members.map(i => i.user_id))
    const memberProfiles = members.map(member => ({
        role: member.role,
        name: membersProfileData?.find(item => item.id == member.user_id)?.name,
        avatarUrl: membersProfileData?.find(item => item.id == member.user_id)?.avatarUrl
    }))

    return (
        <>
            <ListWrapper userRole={data?.list_members.find(i => i.user_id == userData.user.id)?.role} listData={{ ...data! }} defaultListItems={data?.listItems || []} members={memberProfiles} pendingInvites={pendingInvites || []} />
        </>
    )
}