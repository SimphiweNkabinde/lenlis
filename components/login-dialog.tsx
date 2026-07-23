"use client"

// import { useMediaQuery } from "@/hooks/use-media-query"
import { buttonVariants } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import Link from "next/link"
import { twMerge } from "tailwind-merge"

export function LoginDialog({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
    const isDesktop = false //useMediaQuery("(min-width: 768px)")

    const title = "Log in or Sign up"
    const description = "Access your lists instantly on any device. Collaborate with others in real-time"

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 px-5 pb-5">
                        <Link href="/auth/login" className={twMerge(buttonVariants({ variant: "default" }), "h-10 flex gap-2")}>
                            Continue
                        </Link>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>
                        {description}
                    </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 px-5 pb-3">
                    <Link href="/auth/login" className={twMerge(buttonVariants({ variant: "default" }), "h-10 flex gap-2")}>
                        Continue to login
                    </Link>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
