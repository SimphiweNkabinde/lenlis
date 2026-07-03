import ListPageHeader from "@/components/list-page-header";
import { ListTabs } from "@/app/lists/_components/list-tabs";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {

    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    const { data, error } = await supabase.from("lists")
        .select("id, name, list_members!inner (user_id, role), createdAt:created_at")
        .eq("list_members.user_id", userData?.user?.id)

    return (
        <div className="flex h-dvh relative flex flex-col overflow-hidden">
            <ListPageHeader />
            <ListTabs
                lists={data?.map(({ id, name, list_members, createdAt }) => ({ id, name, role: list_members.find(i => i.user_id == userData?.user?.id)?.role, members: list_members.length, createdAt }))!} />
        </div>
    )
}
