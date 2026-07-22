"use client"

import {
    CircleCheckIcon,
    EllipsisVerticalIcon,
    EyeIcon,
    Share2Icon,
    Trash2Icon,
    UserRoundPlusIcon,
    UsersRoundIcon,
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
import { AuthDialog } from "@/components/auth-dialog"
import { VisibilitySettingsDialog } from "./visibility-settings-dialog"
import { copyToClipboard, nativeShare } from "@/lib/utils"
import { useAuth } from "@/context/auth-provider"
import { MemberSettingsDiaolog } from "./members-settings-dialog"

export function EditListPageDropdownMenu() {

    // dialog open states
    const [isMembersDialogOpen, setIsMembersDialogOpen] = useState<boolean>(false)
    const [isVisibilityDialogOpen, setIsVisibilityDialogOpen] = useState<boolean>(false)
    const [deleteDialgOpen, setDeleteDialgOpen] = useState(false)
    const { user } = useAuth()

    const { id: listId, name: listName, hasChecks, hasAmounts, updateListAttributes } = useListStore(state => state)

    async function handleDelete() {
        setDeleteDialgOpen(false)
        const response = await deleteList(listId, { redirect: "/lists" })
        if (!response.success) toast("Could'nt delete list", { description: "Something went wrong" })
        toast("list deleted")
    }

    async function handleShare() {
        nativeShare({ title: listName, url: `${window.location.origin}/lists/${listId}` })
            .then(res => {
                if (!res.success) copyToClipboard(`${window.location.origin}/lists/${listId}`)
            })
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="secondary" className="rounded-full size-11"><EllipsisVerticalIcon className="size-5" /></Button>} />
                <DropdownMenuContent className="min-w-55">
                    <DropdownMenuItem onClick={() => setIsMembersDialogOpen(true)} className="text-lg">
                        <UsersRoundIcon className="size-5" />
                        Add members
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare()} className="text-lg">
                        <Share2Icon className="size-5" />
                        Share
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setIsVisibilityDialogOpen(true)}
                        className="text-lg">
                        <EyeIcon className="size-5" />
                        Set visibility
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => updateListAttributes({ hasChecks: !hasChecks })}
                        className="text-lg">
                        <CircleCheckIcon className="size-5" />
                        {hasChecks ? "Hide" : "Show"} Checkboxes
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => updateListAttributes({ hasAmounts: !hasAmounts })}
                        className="text-lg">
                        <div className="text-[8px] border-[1.5px] border-black dark:border-white flex font-bold items-center justify-center text-black dark:text-white rounded h-4 px-0.5">1.23</div>
                        {hasAmounts ? "Hide" : "Show"} Amounts
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

            {user?.is_anonymous ?
                <AuthDialog isOpen={isMembersDialogOpen} setIsOpen={(isOpen) => setIsMembersDialogOpen(isOpen)} /> :
                <MemberSettingsDiaolog isOpen={isMembersDialogOpen} setIsOpen={(isOpen) => setIsMembersDialogOpen(isOpen)} />
            }
            <VisibilitySettingsDialog isOpen={isVisibilityDialogOpen} setIsOpen={(isOpen) => setIsVisibilityDialogOpen(isOpen)} />
        </>
    )
}

