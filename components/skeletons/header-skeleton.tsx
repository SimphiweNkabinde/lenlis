import { TextAlignStartIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function HeaderSkeleton({ title }: { title?: string }) {

    return (
        <div className="pb-2 justify-between w-full flex items-center py-4 px-4">
            <Button variant="secondary" className="rounded-full size-11"><TextAlignStartIcon strokeWidth={2} /></Button>
            <div className="font-semibold text-xl">{title}</div>
            <div className="flex items-center gap-3">
                <Button size="lg" variant="secondary" className="text-base h-11 animate-pulse rounded-full w-33"></Button>
            </div>
        </div>
    )
}
