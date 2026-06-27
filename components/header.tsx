import { TextAlignStartIcon } from "lucide-react";
import { Button } from "./ui/button";
import { AuthDialog } from "./auth-dialog";

export default function Header() {
    return (
        <div className="pb-2 justify-between w-full flex items-center py-4 px-4">
            <Button variant="secondary" className="rounded-full size-10"><TextAlignStartIcon /></Button>
            <div className="font-semibold text-lg">lenlis</div>
            <AuthDialog>
                <Button className="text-base">Login</Button>
            </AuthDialog>
        </div>
    )
}
