"use client"

import {
  BookmarkIcon,
  CopyIcon,
  EllipsisVerticalIcon,
  Share2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ReactNode } from "react"

const menuItems: { label: string, icon: ReactNode }[] = [
  { label: "Bookmark", icon: <BookmarkIcon /> },
  { label: "Share", icon: <Share2Icon /> },
  { label: "Copy list", icon: <CopyIcon /> }
]

export function ViewOnlyListDropdownMenu() {
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
