"use client";
import { TextAlignStartIcon } from "lucide-react";
import { Button } from "./ui/button";
import { AuthDialog } from "./auth-dialog";
import { Sidebar } from "./sidebar";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/auth-provider";
import { useParams, usePathname } from "next/navigation";
import { ReadOnlyListPageDropdownMenu } from "./page-dropdown-menus/read-only-list-page-dropdown-menu";
import { EditListPageDropdownMenu } from "@/app/lists/[id]/edit/_components/edit-list-page-dropdown-menu";

export default function Header() {
    const pathname = usePathname()
    const params = useParams()

    const { user, loading } = useAuth()
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState<boolean>(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
    const [DropDownMenu, setDropDownMenu] = useState<ReactNode | null>(null)

    useEffect(() => {
        if (pathname.includes("/lists/") && pathname.includes("/edit") && typeof params.id == "string") {
            setDropDownMenu(<EditListPageDropdownMenu />)
        } else if (pathname.includes("/lists/") && typeof params.id == "string") {
            setDropDownMenu(<ReadOnlyListPageDropdownMenu listId={params.id} />)
        }

    }, [pathname])


    return (
        <div className="pb-2 justify-between w-full flex items-center py-4 px-4">
            <Button onClick={() => setIsSidebarOpen(true)} variant="secondary" className="rounded-full size-11"><TextAlignStartIcon strokeWidth={2} /></Button>
            <Sidebar isOpen={isSidebarOpen} setIsOpen={(isOpen) => setIsSidebarOpen(isOpen)} />
            <div className="font-semibold text-xl">lenlis</div>
            <div className="flex items-center gap-3">
                {(!user && !loading) && <>
                    <Button onClick={() => setIsAuthDialogOpen(true)} size="lg" className="text-base h-11 rounded-full">Login</Button>
                    <AuthDialog isOpen={isAuthDialogOpen} setIsOpen={(isOpen) => setIsAuthDialogOpen(isOpen)} />
                </>}
                {user && <Button onClick={() => setIsSidebarOpen(true)} variant="secondary" className="rounded-full size-11">
                    {user.email?.charAt(0)}
                </Button>}
                {loading && <Button onClick={() => setIsSidebarOpen(true)} variant="secondary" className="rounded-full size-11 animate-pulse">
                </Button>}
                {DropDownMenu}
            </div>
        </div>
    )
}
