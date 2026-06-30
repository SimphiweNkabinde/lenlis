import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import ListCollectionContainer from "./list-collection-container"

export function ListTabs() {
    return (
        <Tabs defaultValue="all" className="p-4 h-full">
            <TabsList className="bg-transparent justify-between w-full px-0 overflow-x-scroll scrollbar-none">
                <TabsTrigger className="flex-0 text-current/75 data-active:bg-muted rounded-full p-4" value="all">All</TabsTrigger>
                <TabsTrigger className="flex-0 text-current/75 data-active:bg-muted rounded-full p-4" value="pinned">Pinned</TabsTrigger>
                <TabsTrigger className="flex-0 text-current/75 data-active:bg-muted rounded-full p-4" value="owned-by-you">Owned by you</TabsTrigger>
                <TabsTrigger className="flex-0 text-current/75 data-active:bg-muted rounded-full p-4" value="shared-with-you">Shared with you</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
                <ListCollectionContainer
                    emptyTitle="No lists yet"
                    emptySubtitle="All your lists will appear here" />
            </TabsContent>
            <TabsContent value="pinned">
                <ListCollectionContainer
                    emptyTitle="No pinned lists yet"
                    emptySubtitle="All your pinned lists will appear here" />
            </TabsContent>
            <TabsContent value="owned-by-you">
                <ListCollectionContainer
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
