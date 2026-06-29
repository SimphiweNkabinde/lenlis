import { Input } from "./ui/input"


export default function ListHeader() {
    return (
        <div className="border-b-1 py-4 px-5">
            <Input
                autoFocus
                className="text-2xl rounded-none border-0 bg-transparent focus-visible:ring-0 px-0"
                placeholder="New list" />
        </div>
    )
}
