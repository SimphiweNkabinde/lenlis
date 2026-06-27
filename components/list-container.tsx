import { ListIcon } from "lucide-react";

export default function ListContainer() {
    return (
        <div className="flex items-center justify-center flex-1 px-4">
            <div className="text-current/75 flex gap-2 items-center">
                <ListIcon className="w-4" /><span>Start a new list</span>
            </div>
        </div>
    )
}
