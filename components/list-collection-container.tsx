import { ListIcon } from "lucide-react"

type ListType = {
    name: string
}

export default function ListCollectionContainer({ list = [], emptyTitle = "", emptySubtitle = "" }: { list?: ListType[], emptyTitle?: string, emptySubtitle?: string }) {
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
