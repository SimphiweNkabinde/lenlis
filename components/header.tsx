"use client";
import { TextAlignStartIcon } from "lucide-react";
import { Button } from "./ui/button";
import { AuthDialog } from "./auth-dialog";
import { Sidebar } from "./sidebar";
import { ReactNode, useState } from "react";

export default function Header({ title, rightDropdownMenu }: { title?: string, rightDropdownMenu?: ReactNode }) {

    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState<boolean>(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

    return (
        <div className="pb-2 justify-between w-full flex items-center py-4 px-4">
            <Button onClick={() => setIsSidebarOpen(true)} variant="secondary" className="rounded-full size-11"><TextAlignStartIcon strokeWidth={2} /></Button>
            <Sidebar isOpen={isSidebarOpen} setIsOpen={(isOpen) => setIsSidebarOpen(isOpen)} />
            <div className="font-semibold text-xl">{title}</div>
            <div className="flex items-center gap-3">
                <>
                    <Button onClick={() => setIsAuthDialogOpen(true)} size="lg" className="text-base h-11 rounded-full">Login</Button>
                    <AuthDialog isOpen={isAuthDialogOpen} setIsOpen={(isOpen) => setIsAuthDialogOpen(isOpen)} />
                </>
                {rightDropdownMenu}
            </div>
        </div>
    )
}
