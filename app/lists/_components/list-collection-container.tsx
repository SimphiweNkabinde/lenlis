import { DotIcon, ListIcon, Trash2Icon } from "lucide-react"
import moment from "moment"
import Link from "next/link"
import { DeleteListAlertDialog } from "./delete-list-alert-dialog"
import { Button } from "@/components/ui/button"

type ListCollectionType = {
    id: string,
    name: string,
    createdAt: string,
    members: number
}

export default function ListCollectionContainer({ listCollection, emptyTitle = "", emptySubtitle = "" }: { listCollection?: ListCollectionType[], emptyTitle?: string, emptySubtitle?: string }) {

    if (!listCollection || !listCollection.length) return <EmptyCollection emptySubtitle={emptySubtitle} emptyTitle={emptyTitle} />

    return (
        <ul className="flex flex-col gap-4">
            {listCollection.map(list => (
                <li key={list.id} className="px-4 py-1 hover:bg-muted/50">
                    <div className="flex items-center justify-between gap-3">
                        <Link href={`/lists/${list.id}/edit`} className="flex items-center gap-3">
                            <div className="bg-muted rounded-lg size-10 flex justify-center items-center">
                                <ListIcon className="size-4" />
                            </div>
                            <div className="flex flex-col">
                                <div className="text-base"> {list.name}</div>
                                <div className="flex items-center text-current/60 text-xs">
                                    <span>{moment(list.createdAt).format("MMM D")}</span>
                                    <DotIcon />
                                    <span>{list.members} collaborator{list.members > 1 ? "s" : ""}</span>
                                </div>
                            </div>
                        </Link>
                        <DeleteListAlertDialog listId={list.id} />
                    </div>
                </li>
            ))}
        </ul>
    )
}


function EmptyCollection({ emptySubtitle, emptyTitle }: { emptyTitle: string, emptySubtitle: string }) {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <ListIcon className="bg-muted rounded-xl p-2 size-8" />
                <div className="font-semibold text-xl">{emptyTitle}</div>
                <div className="text-current/50 text-lg text-center">{emptySubtitle}</div>
            </div>
        </div>
    )
}
