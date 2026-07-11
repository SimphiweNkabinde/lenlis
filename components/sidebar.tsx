"use client";
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { LibraryBigIcon, ListIcon, SquarePenIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Separator } from "./ui/separator"
import { AuthDialog } from "./auth-dialog"
import { usePathname } from "next/navigation";

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {

    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState<boolean>(false)
    const pathname = usePathname();

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle className="font-semibold text-2xl">
                        lenlis
                    </SheetTitle>
                </SheetHeader>
                <div className="px-6 pt-10 flex flex-col gap-7 text-lg">
                    <Link href="/lists/library" onClick={() => pathname === "/lists/library" && setIsOpen(false)} className="flex items-center gap-3 font-medium">
                        <LibraryBigIcon className="size-4" /><span>Library</span>
                    </Link>
                    <Link href="/" onClick={() => pathname === "/" && setIsOpen(false)} className="flex items-center gap-3 font-medium">
                        <SquarePenIcon className="size-4" /><span>New List</span>
                    </Link>
                    <div>
                        <Link href="/lists" onClick={() => pathname === "/lists" && setIsOpen(false)} className="flex items-center gap-3 font-medium mb-3">
                            <ListIcon className="size-4" /><span>Lists</span>
                        </Link>
                        <div className="text-base pl-7 flex flex-col gap-2">
                            <Link href="/lists?tab=owned" onClick={() => pathname === "/lists" && setIsOpen(false)} className="flex items-center gap-3">
                                My lists
                            </Link>
                            <Link href="/lists?tab=saved" onClick={() => pathname === "/lists" && setIsOpen(false)} className="flex items-center gap-4">
                                Saved
                            </Link>
                            <Link href="/lists?tab=shared" onClick={() => pathname === "/lists" && setIsOpen(false)} className="flex items-center gap-3">
                                Shared with me
                            </Link>
                        </div>
                    </div>
                </div>
                <SheetFooter className="px-0">
                    <Separator />
                    <div className="flex flex-col gap-4 p-6">
                        <div className="font-semibold">Get the most out of your lists</div>
                        <div className="text-current/50 font-medium">
                            Log in to access your lists on any device and collaborate with others.
                        </div>
                        <Button onClick={() => setIsAuthDialogOpen(true)} variant="outline" className="text-base h-10">Login</Button>
                        <AuthDialog isOpen={isAuthDialogOpen} setIsOpen={(isOpen) => setIsAuthDialogOpen(isOpen)} />
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
