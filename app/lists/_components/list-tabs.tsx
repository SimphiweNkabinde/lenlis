import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import ListCollectionContainer from "./list-collection-container"
import { ListMemberRole } from "@/lib/definitions"

export function ListTabs({ lists }: { lists: { id: string, name: string, createdAt: string, role: ListMemberRole, members: number }[] }) {
    return (
        <Tabs defaultValue="all" className="py-4 h-full">
            <TabsList className="bg-transparent justify-between w-full px-4 overflow-x-scroll scrollbar-none mb-5 rounded-none">
                <TabsTrigger className="flex-0 text-current/75 data-active:bg-muted rounded-full p-4" value="all">All</TabsTrigger>
                <TabsTrigger className="flex-0 text-current/75 data-active:bg-muted rounded-full p-4" value="saved">Saved</TabsTrigger>
                <TabsTrigger className="flex-0 text-current/75 data-active:bg-muted rounded-full p-4" value="owned-by-you">Owned by you</TabsTrigger>
                <TabsTrigger className="flex-0 text-current/75 data-active:bg-muted rounded-full p-4" value="shared-with-you">Shared with you</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
                <ListCollectionContainer
                    listCollection={lists}
                    emptyTitle="No lists yet"
                    emptySubtitle="All your lists will appear here" />
            </TabsContent>
            <TabsContent value="saved">
                <ListCollectionContainer
                    emptyTitle="No saved lists yet"
                    emptySubtitle="All your saved lists will appear here" />
            </TabsContent>
            <TabsContent value="owned-by-you">
                <ListCollectionContainer
                    listCollection={lists?.filter(i => i.role == "owner")}
                    emptyTitle="No owned lists yet"
                    emptySubtitle="Lists Owned by you will appear here." />
            </TabsContent>
            <TabsContent value="shared-with-you">
                <ListCollectionContainer
                    emptyTitle="No shared lists yet"
                    emptySubtitle="Lists shared with you will appear here." />
            </TabsContent>
        </Tabs>
    )
}
