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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { useListStore } from "@/app/lists/[id]/edit/_stores/use-list-store"
import { deleteList } from "@/lib/actions/delete-list"
import { toast } from "sonner"

export function PageDropdownMenu() {

    const { id: listId, name: listName } = useListStore(state => state)
    const [deleteDialgOpen, setDeleteDialgOpen] = useState(false)

    async function handleDelete() {
        setDeleteDialgOpen(false)
        const response = await deleteList(listId, { redirect: "/lists" })
        if (!response.success) toast("Could'nt delete list", { description: "Something went wrong" })
        toast("list deleted")
    }

    async function handleShare() {
        const shareData = {
            title: listName,
            text: 'Lenlis - Shared Lists, Simplified',
            url: `${window.location.origin}/lists/${listId}`
        };

        if (navigator.share)
            // native share menu
            navigator.share(shareData).catch(err => { });
        else {
            navigator.clipboard.writeText(shareData.url)
                .then(() => toast.info("Link copied to clipboard"))
                .catch(() => { })
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="secondary" className="rounded-full size-11"><EllipsisVerticalIcon className="size-5" /></Button>} />
                <DropdownMenuContent className="min-w-45">
                    <DropdownMenuItem className="text-lg">
                        <UserRoundPlusIcon className="size-5" />
                        Add members
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare()} className="text-lg">
                        <Share2Icon className="size-5" />
                        Share
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-lg">
                        <EyeIcon className="size-5" />
                        Set visibility
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setDeleteDialgOpen(true)}
                        className="text-lg"
                        variant="destructive">
                        <Trash2Icon /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete List Alert Dialog */}
            <AlertDialog open={deleteDialgOpen} onOpenChange={(open) => setDeleteDialgOpen(open)}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 size-10 p-2 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            <Trash2Icon />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Delete list?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this list for you and your collaborators.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete()} variant="destructive">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

