import ListContainerReadonly from "@/app/lists/[id]/_components/list-container-readonly"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/server"
import { DotIcon, LockIcon, SquarePenIcon, UserRoundIcon } from "lucide-react"
import moment from "moment"
import { notFound } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { Toaster } from "sonner"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('lists')
        .select("id, name, listItems:list_items (id, text, checked:is_checked, amount, position, updated_at), hasChecks:has_checks, hasAmounts:has_amounts, visibility, listMembers:list_members(user_id, role), updated_at")
        .order("position", { referencedTable: "list_items" })
        .eq("id", id).single()
    const ownerId = data?.listMembers.filter((i) => i.role == "owner").map(i => i.user_id) || []
    const { data: ownerProfile } = ownerId.length ? await supabase.from("profiles").select("username").eq("id", ownerId[0]).single() : {}

    const updateDates = [...data?.listItems.map((i: { updated_at: string }) => i.updated_at)!, data?.updated_at]
    const latestUpdateTimestamp = Math.max(...updateDates.map(date => Date.parse(date)));
    if (!data) {
        notFound()
    }

    if (data?.visibility === "private") {
        const memberIds = data.listMembers.map((i: { user_id: string }) => i.user_id)
        if (!userData?.user?.id || !memberIds.includes(userData?.user.id)) {
            return (
                <>
                    <div className="h-full grid grid-rows-3 grid-cols-1 items-center justify-center gap-5 text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-5">
                            <LockIcon className="size-15" />
                            <div className="font-semibold">This is a private List</div>
                            <p className="text-center">Only logged in list members can view it</p>
                        </div>
                        <div className="text-center">
                            <Link href="/" className={buttonVariants({ variant: "default" })}><SquarePenIcon /> Create your own list</Link>
                        </div>

                    </div>
                </>)
        }
    }

    const { name, listItems, hasAmounts, hasChecks } = data
    const typedListItem = listItems as { amount: number, checked: boolean }[]
    const totalSum = typedListItem.map(i => i.amount || 0).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const checkedSum = typedListItem.filter(i => i.checked).map(i => i.amount || 0).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return (
        <>
            <div className="border-b-1 pt-4 pb-2 px-5 flex flex-col gap-3 h-32">
                <div>
                    <h1 className="text-2xl rounded-none border-0 bg-transparent focus-visible:ring-0 px-0">{name}</h1>
                </div>
                <div className="flex items-center gap-1">
                    <div className="text-current/50 text-sm flex items-center gap-1">
                        <Avatar size="sm">
                            <AvatarFallback><UserRoundIcon className="size-4" /></AvatarFallback>
                        </Avatar>
                    </div>
                    {ownerProfile && <div>{ownerProfile.username}</div>}
                    <DotIcon className="text-current/50" />
                    <div className="text-current/50 text-xs flex items-center gap-1">
                        {/* <HistoryIcon className="w-4" /> */}
                        <span>updated {moment(latestUpdateTimestamp).fromNow()}</span>
                    </div>
                </div>
                <div className='text-sm flex justify-between text-current/50'>
                    <div>{hasChecks ? `${typedListItem.filter(i => i.checked).length}/` : ""}{listItems.length} items</div>
                    {hasAmounts && <div>{hasChecks ? `${checkedSum} / ` : ""}{totalSum} total</div>}
                </div>
            </div>
            <ListContainerReadonly list={listItems || []} showAmounts={hasAmounts} showChecks={hasChecks} />
            <Toaster />
        </>
    )
}
