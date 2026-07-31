import { createClient } from "@/lib/supabase/server"
import { ListIcon, SquarePenIcon } from "lucide-react"
import Link from "next/link"
import { twMerge } from "tailwind-merge"
import { buttonVariants } from "./ui/button"
import moment from "moment"

export default async function Sidebar() {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()

    const { data: lists, error: listsError } = await supabase.from("lists")
        .select("id, name, list_members!inner (user_id, role), updatedAt:updated_at")
        .eq("list_members.user_id", userData?.user?.id)
    return (
        <aside className="flex h-full relative flex flex-col overflow-hidden">
            <ul className="flex flex-col gap-3 overflow-y-scroll mt-10 pt-5 pb-10 flex-1">
                {lists?.map(list => (
                    <li key={list.id} className="px-4 py-1 hover:bg-muted/50">
                        <Link href={`/lists/${list.id}/edit`} className="flex items-center gap-3">
                            <div className="bg-muted rounded-lg size-10 flex justify-center items-center">
                                <ListIcon className="size-4" />
                            </div>
                            <div className="flex flex-col">
                                <div className="text-base"> {list.name}</div>
                                <div className="flex items-center gap-1 text-current/60 text-xs">
                                    <span>created {moment(list.updatedAt).format("MMM D")}</span>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            <Link href="/new" className={twMerge(buttonVariants({ variant: "default" }), "rounded-full mx-auto sticky p-5 bottom-10 left-3/5 text-lg shadow-lg")}><SquarePenIcon className="size-5" /> New</Link>
        </aside>
    )
}
