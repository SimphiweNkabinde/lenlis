import Header from "@/components/header"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import ListName from "./_components/list-name"
import { Toaster } from "sonner"
import ListWrapper from "./_components/list-wrapper"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('lists')
        .select("id, name, list_items (id, text, is_checked, amount), list_members!inner(user_id, role) , created_at")
        .eq("id", id)
        .eq("list_members.user_id", userData?.user?.id) // current user is a member
        .in("list_members.role", ["owner", "editor"]) // current user is an owner or editor
        .single()

    if (!data) {
        notFound()
    }

    return (
        <div className="flex h-dvh relative flex flex-col overflow-hidden">
            <Header />
            <div className="border-b-1 py-4 px-5">
                <ListName defaultName={data.name} listId={id} />
            </div>
            <ListWrapper defaultList={data.list_items} listId={id} />
            <Toaster position="bottom-center" />
        </div>
    )
}
