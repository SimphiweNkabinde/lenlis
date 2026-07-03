"use client"
import { ListIcon } from "lucide-react"
import { ListItemState, useListStore } from "../_stores/use-list-store"
import clsx from "clsx"
import { Input } from "@/components/ui/input"
import { updateListItem } from "@/lib/actions/update-list-item"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

export default function ListItems() {

    const list = useListStore(state => state.listItems)

    if (!list.length) return <EmptyList />

    return (
        <ul className="ml-6 h-full pl-4 pr-4 flex flex-col gap-3 overflow-y-scroll pt-5 pb-10">
            {list.map(item => (
                <li key={item.id}>
                    <ListItem item={item} />
                </li>
            ))}
        </ul>
    )
}

function EmptyList() {
    return (
        <div className="flex items-center justify-center h-full px-4">
            <div className="text-current/75 flex gap-2 items-center">
                <ListIcon className="w-4" /><span>List is empty</span>
            </div>
        </div>
    )
}

function ListItem({ item }: { item: ListItemState }) {

    const listId = useListStore(state => state.listId)
    const updateItem = updateListItem.bind(null, listId, item.id)

    const [isPending, setIsPending] = useState<boolean>(false)
    const [isChecked, setIsChecked] = useState<boolean>(item.is_checked || false)

    const handleTextUpdate = useDebouncedCallback(async (text: string) => {
        setIsPending(true)
        try {
            const response = await updateItem({ text })
            if (!response.success) {
                toast.error("Couldn't update item", { description: response.message })
            }
        } catch (error) {
            console.log(error)
            toast.error("Couldn't update item", { description: "Something went wrong" })
        } finally {
            setIsPending(false)
        }
    }, 1000)

    async function handleCheckedUpdate(checked: boolean) {
        setIsChecked(checked)
        try {
            const response = await updateListItem(listId, item.id, { checked })
            if (!response.success) {
                toast.error("Couldn't update item", { description: response.message })
            }
        } catch (error) {
            console.log(error)
            toast.error("Couldn't update item", { description: "Something went wrong" })
            // revert
            setIsChecked(!checked)
        }
    }

    async function handleAmountUpdate(amount: number) {
        try {
            const response = await updateListItem(listId, item.id, { amount })
            if (!response.success) {
                toast.error("Couldn't update item", { description: response.message })
            }
        } catch (error) {
            console.log(error)
            toast.error("Couldn't update item", { description: "Something went wrong" })
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Checkbox
                onCheckedChange={(checked) => handleCheckedUpdate(checked)}
                checked={isChecked}
                className="rounded-full size-5 border-black/50 dark:border-white/50 bg-transparent" />
            <Textarea
                onChange={(e) => handleTextUpdate(e.target.value)}
                defaultValue={item.text}
                className={clsx(
                    "!text-[16px] !min-h-6 border-0 rounded-none bg-transparent focus-visible:ring-0 p-0 m-0",
                    { "animate-pulse": item.isPending || isPending },
                    { "line-through decoration-1 text-current/60": isChecked }
                )} />
            <Input
                onChange={(e) => handleAmountUpdate(Number.parseFloat(e.target.value))}
                type="number"
                className="w-50 bg-transparent"
                defaultValue={item.amount || 0} />
        </div>)
}
