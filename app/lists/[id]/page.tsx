import Header from "@/components/header"
import ListContainerReadonly from "@/components/list-containers/list-container-readonly"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/server"
import { DotIcon, HistoryIcon } from "lucide-react"
import moment from "moment"
import { notFound } from "next/navigation"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data, error } = await supabase.from('lists')
        .select("id, name, listItems:list_items (id, text, checked:is_checked, amount), hasChecks:has_checks, hasAmounts:has_amounts, createdAt:created_at")
        .eq("id", id).single()

    if (!data) {
        notFound()
    }

    const { name, listItems, hasAmounts, hasChecks, createdAt } = data

    const totalSum = listItems.map(i => i.amount || 0).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const checkedSum = listItems.filter(i => i.checked).map(i => i.amount || 0).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return (
        <div className="flex h-dvh relative flex flex-col overflow-hidden">
            <Header />
            <div className="border-b-1 pt-4 pb-2 px-5 flex flex-col gap-3">
                <div>
                    <h1 className="text-2xl rounded-none border-0 bg-transparent focus-visible:ring-0 px-0">{name}</h1>
                </div>
                <div className="flex items-center">
                    <div className="text-current/50 text-sm flex items-center gap-1">
                        <Avatar size="sm">
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback></AvatarFallback>
                        </Avatar>
                        <span className="font-medium">User</span>
                    </div>
                    <DotIcon className="text-current/50" />
                    <div className="text-current/50 text-xs flex items-center gap-1">
                        {/* <HistoryIcon className="w-4" /> */}
                        <span>updated {moment(createdAt).fromNow()}</span>
                    </div>
                </div>
                <div className='text-sm flex justify-between text-current/50'>
                    <div>{hasChecks ? `${listItems.filter(i => i.checked).length}/` : ""}{listItems.length} items</div>
                    {hasAmounts && <div>{hasChecks ? `${checkedSum} / ` : ""}{totalSum} total</div>}
                </div>
            </div>
            <ListContainerReadonly list={listItems || []} showAmounts={hasAmounts} showChecks={hasChecks} />
        </div>
    )
}
