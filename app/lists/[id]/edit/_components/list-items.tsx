"use client"
import { GripVerticalIcon, ListIcon, XIcon } from "lucide-react"
import { ListItemState, useListStore } from "../_stores/use-list-store"
import clsx from "clsx"
import { Input } from "@/components/ui/input"
import { useDebouncedCallback } from "use-debounce"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { move } from "@dnd-kit/helpers"
import { DragDropProvider } from "@dnd-kit/react"
import { useRef, useState } from "react"
import { useSortable } from "@dnd-kit/react/sortable"

export default function ListItems() {

    const { listItems: list, setListItems } = useListStore(state => state)

    if (!list.length) return <EmptyList />

    return (
        <DragDropProvider
            onDragEnd={(event) => {
                setListItems((items) => ({ newList: move(items, event), movedItemId: String(event.operation.source?.id) }))
            }}
        >
            <ul className="h-full pl-4 pr-4 flex flex-col gap-3 overflow-y-scroll pt-5 pb-10">
                {list.map((item, index) => (
                    <ListItem key={item.id} item={item} index={index} />
                ))}
            </ul>
        </DragDropProvider>
    )
}

function EmptyList() {
    return (
        <div className="flex items-center justify-center h-full px-4">
            <div className="text-current/75 flex gap-2 items-center">
                <ListIcon className="w-4" /><span>Empty list</span>
            </div>
        </div>
    )
}

function ListItem({ item, index }: { item: ListItemState, index: number }) {

    const { removeItem, updateItem, hasAmounts, hasChecks } = useListStore(state => state)
    const [element, setElement] = useState<Element | null>(null)
    const handleRef = useRef<HTMLButtonElement | null>(null)
    const { isDragging } = useSortable({ id: item.id, index, element, handle: handleRef })

    const handleDebouncedUpdate = useDebouncedCallback(async (ItemProps: { text?: string, amount?: number }) => {
        updateItem(item.id, ItemProps)
    }, 1000)

    return (
        <li ref={setElement} data-shadow={isDragging || undefined} className="flex items-center gap-2 min-h-8" >
            {hasChecks &&
                <Checkbox
                    onCheckedChange={(checked) => updateItem(item.id, { checked })}
                    checked={item.checked}
                    className="rounded-full size-5 border-black/50 dark:border-white/50 bg-transparent" />
            }
            <Textarea
                id={`${item.id}-textarea`}
                name={`${item.id}-textarea`}
                onChange={(e) => handleDebouncedUpdate({ text: e.target.value })}
                defaultValue={item.text}
                className={clsx(
                    "!text-[16px] !min-h-6 border-0 rounded-none bg-transparent focus-visible:ring-0 p-0 m-0",
                    { "animate-pulse": item.isPending },
                    { "line-through decoration-1 text-current/60": item.checked && hasChecks }
                )} />
            {hasAmounts &&
                <Input
                    onChange={(e) => handleDebouncedUpdate({ amount: Number.parseFloat(e.target.value) })}
                    type="number"
                    className={clsx("w-40 text-right bg-transparent", { "line-through decoration-1 text-current/60": item.checked && hasChecks })}
                    defaultValue={item.amount || 0} />
            }
            <Button onClick={() => removeItem(item.id)} variant="ghost" className="text-current/50"><XIcon /></Button>
            <Button ref={handleRef} className="rounded-r-lg h-full w-7 bg-muted/50 rounded-l-none px-0 text-muted-foreground border border-muted border" variant="ghost">
                <GripVerticalIcon />
            </Button>
        </li>)
}
