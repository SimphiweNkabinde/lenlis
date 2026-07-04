import { TextAlignStartIcon } from "lucide-react";
import { Button } from "./ui/button";
import { AuthDialog } from "./auth-dialog";
import { Sidebar } from "./sidebar";

export default function Header({ title }: { title?: string }) {
    return (
        <div className="pb-2 justify-between w-full flex items-center py-4 px-4">
            <Sidebar>
                <Button variant="secondary" className="rounded-full size-11"><TextAlignStartIcon /></Button>
            </Sidebar>
            <div className="font-semibold text-xl">{title}</div>
            <AuthDialog>
                <Button size="lg" className="text-base">Login</Button>
            </AuthDialog>
        </div>
    )
}
