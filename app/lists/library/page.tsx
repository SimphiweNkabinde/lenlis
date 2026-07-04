import ListPageHeader from "@/components/list-page-header";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ListIcon } from "lucide-react";
import moment from "moment";

export default async function Page() {

    const supabase = await createClient()
    const { data, error } = await supabase.from("lists")
        .select("id, name, createdAt:created_at")

    return (
        <div className="flex h-dvh relative flex flex-col overflow-hidden">
            <ListPageHeader />
            <ul className="flex flex-col gap-4 overflow-y-scroll py-4">
                {data?.map(list => (
                    <li key={list.id} className="px-4 py-1 hover:bg-muted/50">
                        <div className="flex items-center justify-between gap-3">
                            <Link href={`/lists/${list.id}`} className="flex items-center gap-3">
                                <div className="bg-muted rounded-lg size-10 flex justify-center items-center">
                                    <ListIcon className="size-4" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-base"> {list.name}</div>
                                    <div className="flex items-center text-current/60 text-xs">
                                        {moment(list.createdAt).format("MMM D")}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
