import { EllipsisVerticalIcon, TextAlignStartIcon } from "lucide-react";
import { Button } from "./ui/button";
import { AuthDialog } from "./auth-dialog";
import { Sidebar } from "./sidebar";

export default function Header({ title }: { title?: string }) {
    return (
        <div className="pb-2 justify-between w-full flex items-center py-4 px-4">
            <Sidebar>
                <Button variant="secondary" className="rounded-full size-11"><TextAlignStartIcon strokeWidth={2} /></Button>
            </Sidebar>
            <div className="font-semibold text-xl">{title}</div>
            <div className="flex items-center gap-3">
                <AuthDialog>
                    <Button size="lg" className="text-base h-11 rounded-full">Login</Button>
                </AuthDialog>
                <Button variant="secondary" className="rounded-full size-11"><EllipsisVerticalIcon className="size-5" /></Button>
            </div>
        </div>
    )
}
