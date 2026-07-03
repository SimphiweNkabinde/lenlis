"use client"
import { ListIcon, XIcon } from "lucide-react"
import { ListItemState, useListStore } from "../_stores/use-list-store"
import clsx from "clsx"
import { Input } from "@/components/ui/input"
import { updateListItem } from "@/lib/actions/update-list-item"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ListItems() {

    const list = useListStore(state => state.listItems)

    if (!list.length) return <EmptyList />

    return (
        <ul className="h-full pl-4 pr-4 flex flex-col gap-3 overflow-y-scroll pt-5 pb-10">
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

    const { removeItem, updateItem } = useListStore(state => state)

    const handleDebouncedUpdate = useDebouncedCallback(async (ItemProps: { text?: string, amount?: number }) => {
        updateItem(item.id, ItemProps)
    }, 1000)

    return (
        <div className="flex items-center gap-2">
            <Checkbox
                onCheckedChange={(checked) => updateItem(item.id, { checked })}
                checked={item.checked}
                className="rounded-full size-5 border-black/50 dark:border-white/50 bg-transparent" />
            <Textarea
                onChange={(e) => handleDebouncedUpdate({ text: e.target.value })}
                defaultValue={item.text}
                className={clsx(
                    "!text-[16px] !min-h-6 border-0 rounded-none bg-transparent focus-visible:ring-0 p-0 m-0",
                    { "animate-pulse": item.isPending },
                    { "line-through decoration-1 text-current/60": item.checked }
                )} />
            <Input
                onChange={(e) => handleDebouncedUpdate({ amount: Number.parseFloat(e.target.value) })}
                type="number"
                className="w-40 text-right bg-transparent"
                defaultValue={item.amount || 0} />
            <Button onClick={() => removeItem(item.id)} variant="ghost"><XIcon /></Button>
        </div>)
}
