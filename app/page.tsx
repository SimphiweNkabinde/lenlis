import Header from "@/components/header"
import { createClient } from "@/lib/supabase/server";
import { ListIcon, SquarePenIcon } from "lucide-react";
import Link from "next/link";
import moment from "moment";
import { twMerge } from "tailwind-merge";
import { buttonVariants } from "@/components/ui/button";

export default async function Page() {

  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  const { data: lists, error: listsError } = await supabase.from("lists")
    .select("id, name, list_members!inner (user_id, role), updatedAt:updated_at")
    .eq("list_members.user_id", userData?.user?.id)

  if (!lists || !lists.length) return (
    <div className="flex h-dvh relative flex flex-col overflow-hidden">
      <Header />
      <div className="h-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <ListIcon className="bg-muted rounded-xl p-2 size-8" />
          <div className="font-semibold text-xl">No lists yet</div>
          <div className="text-current/50 text-lg text-center">All your lists will appear here</div>
        </div>
      </div>
      <Link href="/new" className={twMerge(buttonVariants({ variant: "default" }), "rounded-full mx-auto sticky p-5 left-4/6 bottom-10 text-lg")}><SquarePenIcon className="size-5" /> New</Link>
    </div>
  )
  return (
    <div className="flex h-dvh relative flex flex-col overflow-hidden">
      <Header />
      <ul className="flex flex-col gap-3 overflow-y-scroll mt-10 pt-5 pb-10">
        {lists.map(list => (
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
      <Link href="/new" className={twMerge(buttonVariants({ variant: "default" }), "rounded-full mx-auto sticky p-5 left-4/6 bottom-10 text-lg")}><SquarePenIcon className="size-5" /> New</Link>
    </div>
  )
}