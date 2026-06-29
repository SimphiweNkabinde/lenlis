import { DotIcon, HistoryIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import moment from "moment"

type Props = {
    name?: string,
    totalItems?: number,
    lastUpdated?: string,
    user?: { name: string, avatarUrl?: string, fallbackText?: string }
}

export default function ListHeaderReadonly({ name, totalItems, lastUpdated, user }: Props) {
    return (
        <div className="border-b-1 py-4 px-5 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <div>
                    <h1 className="text-2xl rounded-none border-0 bg-transparent focus-visible:ring-0 px-0">{name}</h1>
                </div>
                <div className="flex items-center">
                    {user && <>
                        <div className="text-current/50 text-sm flex items-center gap-1">
                            <Avatar size="sm">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>
                                    {user.fallbackText || user.name.substring(0, 1)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                        </div>
                        <DotIcon className="text-current/50" />
                    </>}
                    {lastUpdated && <div className="text-current/50 text-xs flex items-center gap-1">
                        <HistoryIcon className="w-4" />
                        <span> {moment(lastUpdated).fromNow()}</span>
                    </div>}
                </div>
            </div>
            {totalItems && <div>
                <div className="flex items-center text-sm gap-1 text-current/75">{totalItems} items</div>
            </div>}
        </div>
    )
}
