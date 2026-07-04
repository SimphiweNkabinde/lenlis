import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { LibraryBigIcon, ListIcon, SquarePenIcon } from "lucide-react"
import Link from "next/link"
import { ReactNode } from "react"
import { Separator } from "./ui/separator"
import { AuthDialog } from "./auth-dialog"

export function Sidebar({ children }: { children: ReactNode }) {
    return (
        <Sheet>
            <SheetTrigger render={<>{children}</>} />
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle className="font-semibold text-2xl">
                        lenlis
                    </SheetTitle>
                </SheetHeader>
                <div className="px-6 flex flex-col gap-5 text-lg">
                    <Link href="/lists/library" className="flex items-center gap-3 font-medium">
                        <LibraryBigIcon className="size-4" /><span>Library</span>
                    </Link>
                    <Link href="/" className="flex items-center gap-3 font-medium">
                        <SquarePenIcon className="size-4" /><span>New List</span>
                    </Link>
                    <Link href="/lists" className="flex items-center gap-3 font-medium">
                        <ListIcon className="size-4" /><span>My Lists</span>
                    </Link>
                </div>
                <SheetFooter className="px-0">
                    <Separator />
                    <div className="flex flex-col gap-4 p-6">
                        <div className="font-semibold">Get the most out of your lists</div>
                        <div className="text-current/50 font-medium">
                            Log in to access your lists on any device and collaborate with others.
                        </div>
                        <AuthDialog>
                            <Button variant="outline" className="text-base h-10">Login</Button>
                        </AuthDialog>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
