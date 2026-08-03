"use client"
import {
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
import { cloneList } from "@/lib/actions/clone-list"
import { toast } from "sonner"
import { copyToClipboard, nativeShare } from "@/lib/utils"

export function ReadOnlyListPageDropdownMenu({ listId }: { listId: string }) {

  async function handleCopy() {
    toast.info("Copying list...")
    const response = await cloneList(listId)
    if (!response.success) toast.error("Couldn't copy list", { description: response.message })
    else toast.success(response.message)
  }

  async function handleShare() {
    nativeShare({ title: "lenlis - Shared lists, simplified", url: `${process.env.NEXT_PUBLIC_ORIGIN}/lists/${listId}` })
      .then(res => {
        if (!res.success) {
          copyToClipboard(`${process.env.NEXT_PUBLIC_ORIGIN}/lists/${listId}`)
            .then(() => toast("copied to clipboard"))
        }
      })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="secondary" className="rounded-full size-11"><EllipsisVerticalIcon className="size-5" /></Button>} />
      <DropdownMenuContent className="min-w-45">
        <DropdownMenuItem onClick={() => handleShare()} className="text-lg">
          <Share2Icon />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCopy()} className="text-lg">
          <CopyIcon />
          Copy list
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
