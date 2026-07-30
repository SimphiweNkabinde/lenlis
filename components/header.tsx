"use client";
import { ArrowLeftIcon } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/auth-provider";
import { useParams, usePathname } from "next/navigation";
import { ReadOnlyListPageDropdownMenu } from "./page-dropdown-menus/read-only-list-page-dropdown-menu";
import { EditListPageDropdownMenu } from "@/app/lists/[id]/edit/_components/edit-list-page-dropdown-menu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

export default function Header({ backToHomeBtn = false }: { backToHomeBtn?: boolean }) {
    const pathname = usePathname()
    const params = useParams()

    const { user, loading } = useAuth()
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
            {backToHomeBtn ?
                <Link href="/" className={twMerge(buttonVariants({ variant: "secondary" }), "rounded-full size-11")}>
                    <ArrowLeftIcon strokeWidth={2} />
                </Link> : <div />}
            <div className="flex items-center justify-center gap-2">
                <div className="flex justify-center">
                    <Image className="dark:hidden" src="/lenlis-logo.png" height={25} width={25} alt="lenlis logo" />
                    <Image className="hidden dark:block" src="/lenlis-logo-white.png" height={25} width={25} alt="lenlis logo" />
                </div>
                <div className="font-semibold text-xl">lenlis</div>
            </div>
            <div className="flex items-center gap-3">
                {/* login button */}
                {((!user || user.is_anonymous) && !loading) &&
                    <Link href="/auth/login" className={twMerge(buttonVariants({ variant: "default" }), "text-base h-11 rounded-full")}>Login</Link>
                }

                {/* user icon*/}
                {(user && !user.is_anonymous) &&
                    <Link href="/settings">
                        <Avatar className="size-11">
                            <AvatarImage src={user?.avatarUrl} alt="@shadcn" />
                            <AvatarFallback className="text-xl">{user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Link>}

                {/* dropdown option menu */}
                {DropDownMenu}
            </div>
        </div>
    )
}
