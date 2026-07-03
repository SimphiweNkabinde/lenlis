import Header from "@/components/header"
import ListContainerReadonly from "@/components/list-containers/list-container-readonly"
import ListHeaderReadonly from "@/components/list-header-readonly"
import { createClient } from "@/lib/supabase/server"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data, error } = await supabase.from('lists')
        .select("id, name, list_items (id, text, checked:is_checked), created_at")
        .eq("id", id).single()

    return (
        <div className="flex h-dvh relative flex flex-col overflow-hidden">
            <Header />
            <ListHeaderReadonly
                name={data?.name}
                totalItems={data?.list_items.length}
                lastUpdated={data?.created_at}
                user={{ name: "Anonymous User", fallbackText: "A" }}
            />
            <ListContainerReadonly list={data?.list_items || []} />
        </div>
    )
}
