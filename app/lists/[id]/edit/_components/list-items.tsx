"use client"
import { ListIcon } from "lucide-react"
import { ListItemState, useListStore } from "../_stores/use-list-store"
import clsx from "clsx"
import { Input } from "@/components/ui/input"
import { updateListItem } from "@/lib/actions/update-list-item"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { toast } from "sonner"

export default function ListItems() {

    const list = useListStore(state => state.list)

    if (!list.length) return <EmptyList />

    return (
        <div className="ml-6 h-full pl-4 pr-4 flex flex-col gap-3 overflow-y-scroll pt-5 pb-10">
            {list.map(item => (
                <ListItem key={item.id} item={item} />
            ))}
        </div>
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

    const handleUpdate = useDebouncedCallback(async (text: string) => {
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

    return (
        <>
            <Input
                onChange={(e) => handleUpdate(e.target.value)}
                defaultValue={item.text}
                className={clsx("!text-[16px] border-0 rounded-none bg-transparent focus-visible:ring-0 p-0 m-0", { "animate-pulse": item.isPending || isPending })} />
        </>)
}
