import { ListTabs } from "@/app/lists/_components/list-tabs";
import { createClient } from "@/lib/supabase/server";
import { Toaster } from "sonner";
import Header from "@/components/header";

export default async function Page() {

    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    const { data: ownedLists, error: ownedListsError } = await supabase.from("lists")
        .select("id, name, list_members!inner (user_id, role), updatedAt:updated_at")
        .eq("list_members.user_id", userData?.user?.id)
        .eq("list_members.role", "owner")
    const { data: memberLists, error: memberListsError } = await supabase.from("lists")
        .select("id, name, updatedAt:updated_at")
        .eq("list_members.user_id", userData?.user?.id)
        .neq("list_members.role", "owner")
    const { data: _savedLists } = await supabase.from("saved_lists")
        .select("lists (id, name, updatedAt:updated_at)")
        .eq("user_id", userData?.user?.id)

    const savedLists = _savedLists as unknown as { lists: { id: string, name: string, updatedAt: string } }[]

    return (
        <div className="flex h-dvh relative flex flex-col overflow-hidden">
            <Header />
            <ListTabs owned={ownedLists || []} saved={savedLists?.map(i => i.lists) || []} member={memberLists || []} />
            <Toaster />
        </div>
    )
}
