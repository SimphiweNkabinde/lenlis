import ListContainerReadonly from "@/app/list/[id]/_components/list-container-readonly"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/server"
import { DotIcon, UserRoundIcon } from "lucide-react"
import moment from "moment"
import { notFound } from "next/navigation"
import { ListActionButtonsReadOnly } from "./_components/list-action-buttons"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data, error } = await supabase.from('lists')
        .select("id, name, listItems:list_items (id, text, checked:is_checked, amount, position, updated_at), hasChecks:has_checks, hasAmounts:has_amounts, listMembers:list_members(user_id, role), updated_at")
        .order("position", { referencedTable: "list_items" })
        .eq("id", id).single()

    if (!data || error) {
        console.log(error)
        notFound()
    }
    const ownerId = data?.listMembers.filter((i) => i.role == "owner").map(i => i.user_id) || []
    const { data: ownerProfile } = ownerId.length ? await supabase.from("profiles").select("name, avatarUrl:avatar_url").eq("id", ownerId[0]).maybeSingle() : {}

    const updateDates = [...data?.listItems.map((i: { updated_at: string }) => i.updated_at)!, data?.updated_at]
    const latestUpdateTimestamp = Math.max(...updateDates.map(date => Date.parse(date)));


    const { name, listItems, hasAmounts, hasChecks } = data
    const typedListItem = listItems as { amount: number, checked: boolean }[]
    const totalSum = typedListItem.map(i => i.amount || 0).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const checkedSum = typedListItem.filter(i => i.checked).map(i => i.amount || 0).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return (
        <>
            <div className="border-b-1 pt-4 pb-2 px-5 flex flex-col gap-3 h-32 lg:px-[10%] lg:px-[15%]">
                <div className="lg:flex justify-between">
                    <h1 className="text-2xl rounded-none border-0 bg-transparent focus-visible:ring-0 px-0">{name}</h1>
                    <div className="hidden lg:block"><ListActionButtonsReadOnly listId={id} /></div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="text-current/50 text-sm flex items-center gap-1">
                        <Avatar size="sm">
                            <AvatarImage src={ownerProfile?.avatarUrl} alt={`@${ownerProfile?.name}`} />
                            <AvatarFallback>
                                {ownerProfile ? ownerProfile?.name?.charAt(0) : <UserRoundIcon className="size-4" />}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    {ownerProfile && <div>{ownerProfile.name}</div>}
                    <DotIcon className="text-current/50" />
                    <div className="text-current/50 text-xs flex items-center gap-1">
                        <span>updated {moment(latestUpdateTimestamp).fromNow()}</span>
                    </div>
                </div>
                <div className='text-sm flex justify-between text-current/50'>
                    <div>{hasChecks ? `${typedListItem.filter(i => i.checked).length}/` : ""}{listItems.length} items</div>
                    {hasAmounts && <div>{hasChecks ? `${checkedSum} / ` : ""}{totalSum.toLocaleString()} total</div>}
                </div>
            </div>
            <ListContainerReadonly list={listItems || []} showAmounts={hasAmounts} showChecks={hasChecks} />
        </>
    )
}
