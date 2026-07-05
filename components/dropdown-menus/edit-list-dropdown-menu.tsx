"use client"

import {
    EllipsisVerticalIcon,
    EyeIcon,
    Share2Icon,
    Trash2Icon,
    UserRoundPlusIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ReactNode } from "react"

const menuItems: { label: string, icon: ReactNode }[] = [
    { label: "Add members", icon: <UserRoundPlusIcon className="size-5" /> },
    { label: "Share", icon: <Share2Icon className="size-5" /> },
    { label: "Set visibility", icon: <EyeIcon className="size-5" /> }
]

export function EditListDropdownMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="secondary" className="rounded-full size-11"><EllipsisVerticalIcon className="size-5" /></Button>} />
            <DropdownMenuContent className="min-w-45">
                {menuItems.map(item => (
                    <DropdownMenuItem className="text-lg">
                        {item.icon}
                        {item.label}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-lg" variant="destructive">
                    <Trash2Icon />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
