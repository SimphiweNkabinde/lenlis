"use client";
import { Button, buttonVariants } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ListIcon, SquarePenIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Separator } from "./ui/separator"
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-provider";
import { twMerge } from "tailwind-merge";

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {

    const { user, loading } = useAuth()
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
                    <Link href="/new" onClick={() => pathname === "/" && setIsOpen(false)} className="flex items-center gap-3 font-medium">
                        <SquarePenIcon className="size-4" /><span>New List</span>
                    </Link>
                </div>
                <SheetFooter className="px-0">
                    <Separator />
                    {!user && <div className="flex flex-col gap-4 p-6">
                        <div className="font-semibold">Get the most out of your lists</div>
                        <div className="text-current/50 font-medium">
                            Log in to access your lists on any device and collaborate with others.
                        </div>
                        <Link href="/auth/login" className={twMerge(buttonVariants({ variant: "outline" }), "text-base h-10")}>Login</Link>
                    </div>}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
