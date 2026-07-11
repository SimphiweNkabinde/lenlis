"use client"
import {
  BookmarkOffIcon,
  BookmarkPlusIcon,
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
import { unsaveList } from "@/lib/actions/unsave-list"
import { saveList } from "@/lib/actions/save-list"

export function PageDropdownMenu({ listId, isSaved }: { listId: string, isSaved: boolean }) {

  async function handleCopy() {
    toast.info("Copying list...")
    const response = await cloneList(listId)
    if (!response.success) toast.error("Couldn't copy list", { description: response.message })
    else toast.success(response.message, { description: "Go to My Lists to see your copied list" })
  }

  async function handleShare() {
    nativeShare({ title: "lenslis - Shared lists, simplified", url: `${window.location.origin}/lists/${listId}` })
      .then(res => {
        if (!res.success) {
          copyToClipboard(`${window.location.origin}/lists/${listId}`)
            .then(() => toast("copied to clipboard"))
        }
      })
  }

  async function handleSave() {
    const revalidatePath = `/lists/${listId}`

    if (isSaved) {
      // unsave
      const response = await unsaveList(listId, { revalidatePath })
      if (!response.success) toast.error("Couldn't unsave list", { description: response.message })
      else toast.success("Removed from Saved Lists")
    } else {
      // save
      const response = await saveList(listId, { revalidatePath })
      if (!response.success) toast.error("Couldn't save list", { description: response.message })
      else toast.success("Saved to Saved Lists")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="secondary" className="rounded-full size-11"><EllipsisVerticalIcon className="size-5" /></Button>} />
      <DropdownMenuContent className="min-w-45">
        <DropdownMenuItem onClick={() => handleSave()} className="text-lg">
          {isSaved ? <BookmarkOffIcon /> : <BookmarkPlusIcon />}
          {isSaved ? "Unsave" : "Save"} list
        </DropdownMenuItem>
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
