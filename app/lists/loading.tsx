import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

export default function LayoutPage() {
    return (
        <Tabs value="" className="py-4 h-full">
            <TabsList className="bg-transparent justify-between w-full px-4 overflow-x-scroll scrollbar-none !h-12 rounded-none animate-pulse">
                <TabsTrigger className="flex-0 text-current/75 rounded-full p-4" value="owned">My lists</TabsTrigger>
                <TabsTrigger className="flex-0 text-current/75 rounded-full p-4" value="saved">Saved</TabsTrigger>
                <TabsTrigger className="flex-0 text-current/75 rounded-full p-4" value="shared">Shared with me</TabsTrigger>
            </TabsList>
            <ul className="flex flex-col gap-4 animate-pulse">
                <li className="px-4 py-1 flex items-center gap-3">
                    <div className="bg-muted rounded-lg size-10"></div>
                    <div className="flex flex-col gap-1 flex-1">
                        <div className="h-4 w-1/2 bg-muted rounded"></div>
                        <div className="h-3 w-7 bg-muted rounded"></div>
                    </div>
                    <div className="size-5 bg-muted rounded ml-auto mr-3"></div>
                </li>
                <li className="px-4 py-1 flex items-center gap-3">
                    <div className="bg-muted rounded-lg size-10"></div>
                    <div className="flex flex-col gap-1 flex-1">
                        <div className="h-4 w-7/8 bg-muted rounded"></div>
                        <div className="h-3 w-7 bg-muted rounded"></div>
                    </div>
                    <div className="size-5 bg-muted rounded ml-auto mr-3"></div>
                </li>
                <li className="px-4 py-1 flex items-center gap-3">
                    <div className="bg-muted rounded-lg size-10"></div>
                    <div className="flex flex-col gap-1 flex-1">
                        <div className="h-4 w-4/6 bg-muted rounded"></div>
                        <div className="h-3 w-7 bg-muted rounded"></div>
                    </div>
                    <div className="size-5 bg-muted rounded ml-auto mr-3"></div>
                </li>
                <li className="px-4 py-1 flex items-center gap-3">
                    <div className="bg-muted rounded-lg size-10"></div>
                    <div className="flex flex-col gap-1 flex-1">
                        <div className="h-4 w-2/5 bg-muted rounded"></div>
                        <div className="h-3 w-7 bg-muted rounded"></div>
                    </div>
                    <div className="size-5 bg-muted rounded ml-auto mr-3"></div>
                </li>
                <li className="px-4 py-1 flex items-center gap-3">
                    <div className="bg-muted rounded-lg size-10"></div>
                    <div className="flex flex-col gap-1 flex-1">
                        <div className="h-4 w-2/8 bg-muted rounded"></div>
                        <div className="h-3 w-7 bg-muted rounded"></div>
                    </div>
                    <div className="size-5 bg-muted rounded ml-auto mr-3"></div>
                </li>
            </ul>
        </Tabs>
    )
}