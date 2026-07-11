"use client"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { DeleteListAlertDialog } from "./delete-list-alert-dialog"
import Link from "next/link"
import { BookmarkIcon, ListIcon, UsersRoundIcon } from "lucide-react"
import moment from "moment"
import { useSearchParams } from "next/navigation"

type ListType = { id: string, name: string, updatedAt: string }
export function ListTabs({ saved, owned, member }: { saved: ListType[], owned: ListType[], member: ListType[] }) {

    const searchParams = useSearchParams();

    return (
        <Tabs defaultValue={searchParams.get("tab") || "saved"} className="py-4 h-full">
            <TabsList className="bg-transparent justify-between w-full px-4 overflow-x-scroll scrollbar-none mb-5 rounded-none">
                <TabsTrigger className="flex-0 text-current/75 data-active:bg-muted rounded-full p-4" value="saved">Saved</TabsTrigger>
                <TabsTrigger className="flex-0 text-current/75 data-active:bg-muted rounded-full p-4" value="owned">Owned by you</TabsTrigger>
                <TabsTrigger className="flex-0 text-current/75 data-active:bg-muted rounded-full p-4" value="shared">Shared with you</TabsTrigger>
            </TabsList>
            <TabsContent value="saved">
                <ListCollectionContainer
                    listCollection={saved.map(i => ({ ...i, ownership: "saved" }))}
                    emptyTitle="No saved lists yet"
                    emptySubtitle="All your saved lists will appear here" />
            </TabsContent>
            <TabsContent value="owned">
                <ListCollectionContainer
                    showDelete={true}
                    listCollection={owned}
                    emptyTitle="No owned lists yet"
                    emptySubtitle="Lists Owned by you will appear here." />
            </TabsContent>
            <TabsContent value="shared">
                <ListCollectionContainer
                    listCollection={member.map(i => ({ ...i, townershipag: "shared" }))}
                    emptyTitle="No shared lists yet"
                    emptySubtitle="Lists shared with you will appear here." />
            </TabsContent>
        </Tabs>
    )
}


type ColectionListType = {
    id: string,
    name: string,
    updatedAt: string,
    ownership?: "saved" | "shared"
}
function ListCollectionContainer({ listCollection, emptyTitle = "", emptySubtitle = "", showDelete }: { listCollection?: ColectionListType[], emptyTitle?: string, emptySubtitle?: string, showDelete?: boolean }) {

    if (!listCollection || !listCollection.length) return <EmptyCollection emptySubtitle={emptySubtitle} emptyTitle={emptyTitle} />

    return (
        <ul className="flex flex-col gap-4">
            {listCollection.map(list => (
                <li key={list.id} className="px-4 py-1 hover:bg-muted/50">
                    <div className="flex items-center justify-between gap-3">
                        <Link href={`/lists/${list.id}/${list.ownership == "saved" ? "" : "/edit"}`} className="flex items-center gap-3">
                            <div className="bg-muted rounded-lg size-10 flex justify-center items-center">
                                <ListIcon className="size-4" />
                            </div>
                            <div className="flex flex-col">
                                <div className="text-base"> {list.name}</div>
                                <div className="flex items-center gap-1 text-current/60 text-xs">
                                    {list.ownership === "saved" && <BookmarkIcon strokeWidth={0} fill="currentColor" className="size-4" />}
                                    {list.ownership === "shared" && <UsersRoundIcon />}
                                    <span>{moment(list.updatedAt).format("MMM D")}</span>
                                </div>
                            </div>
                        </Link>
                        {showDelete && <DeleteListAlertDialog listId={list.id} />}
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