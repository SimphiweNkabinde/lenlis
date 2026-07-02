"use client"
import { ListIcon } from "lucide-react"
import { useListStore } from "../_stores/use-list-store"
import clsx from "clsx"

export default function ListItems() {

    const list = useListStore(state => state.list)

    if (!list.length) return <EmptyList />

    return (
        <ul className="list-outside ml-6 h-full pl-4 pr-4 flex flex-col gap-3 overflow-y-scroll pt-5 pb-10">
            {list.map(item => (
                <li key={item.id} className={clsx("text-[16px]", { "animate-pulse": item.isPending })}>
                    {item.text}
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
