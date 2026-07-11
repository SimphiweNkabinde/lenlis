"use client";
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { BookmarkIcon, LibraryBigIcon, ListIcon, SquarePenIcon, UserRoundIcon, UsersRoundIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Separator } from "./ui/separator"
import { AuthDialog } from "./auth-dialog"

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {

    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState<boolean>(false)

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle className="font-semibold text-2xl">
                        lenlis
                    </SheetTitle>
                </SheetHeader>
                <div className="px-6 pt-10 flex flex-col gap-7 text-lg">
                    <Link href="/lists/library" className="flex items-center gap-3 font-medium">
                        <LibraryBigIcon className="size-4" /><span>Library</span>
                    </Link>
                    <Link href="/" className="flex items-center gap-3 font-medium">
                        <SquarePenIcon className="size-4" /><span>New List</span>
                    </Link>
                    <div>
                        <Link href="/lists" className="flex items-center gap-3 font-medium mb-3">
                            <ListIcon className="size-4" /><span>Lists</span>
                        </Link>
                        <div className="pl-4 text-base flex flex-col gap-2">
                            <Link href="/lists?tab=saved" className="flex items-center gap-4 font-medium">
                                <BookmarkIcon className="size-4" /><span>Saved Lists</span>
                            </Link>
                            <Link href="/lists?tab=owned" className="flex items-center gap-3 font-medium">
                                <UserRoundIcon className="size-4" /><span>Owned Lists</span>
                            </Link>
                            <Link href="/lists?tab=shared" className="flex items-center gap-3 font-medium">
                                <UsersRoundIcon className="size-4" /><span>Shared Lists</span>
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
