"use client"

import { Button } from "@/components/ui/button"
import { cloneList } from "@/lib/actions/clone-list"
import { copyToClipboard } from "@/lib/utils"
import { CopyIcon, Share2Icon, Trash2Icon, UsersRoundIcon } from "lucide-react"
import { toast } from "sonner"
import { useListStore } from "../edit/_stores/use-list-store"
import { useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { deleteList } from "@/lib/actions/delete-list"
import { useRouter } from "next/navigation"
import { LoginDialog } from "@/components/login-dialog"
import { MemberSettingsDiaolog } from "../edit/_components/members-settings-dialog"
import { useAuth } from "@/context/auth-provider"

export function ListActionButtonsReadOnly({ listId }: { listId: string }) {
    async function handleShare() {
        copyToClipboard(`${process.env.NEXT_PUBLIC_ORIGIN}/list/${listId}`).then(res => {
            toast("Public link copied to your clipboard", { description: "Anyone with this link can see this list", position: "top-center" })
        })
    }
    async function handleCopy() {
        toast.info("Copying list...")
        const response = await cloneList(listId)
        if (!response.success) toast.error("Couldn't copy list", { description: response.message, position: "top-center" })
        else toast.success(response.message)
    }
    return (
        <div className="flex gap-1">
            <Button variant="ghost" onClick={() => handleShare()}><Share2Icon /> Share</Button>
            <Button variant="ghost" onClick={() => handleCopy()}><CopyIcon /> Copy list</Button>
        </div>
    )
}

export function ListActionButtonsEdit() {
    const { id, userRole } = useListStore(state => state)
    const { user } = useAuth()
    const [deleteDialgOpen, setDeleteDialgOpen] = useState(false)
    const [isMembersDialogOpen, setIsMembersDialogOpen] = useState<boolean>(false)
    const router = useRouter()

    async function handleShare() {
        copyToClipboard(`${process.env.NEXT_PUBLIC_ORIGIN}/list/${id}`).then(res => {
            toast("Public link copied to your clipboard", { description: "Anyone with this link can see this list", position: "top-center" })
        })
    }
    async function handleCopy() {
        toast.info("Copying list...")
        const response = await cloneList(id)
        if (!response.success) toast.error("Couldn't copy list", { description: response.message, position: "top-center" })
        else toast.success(response.message)
    }
    async function handleDelete() {
        setDeleteDialgOpen(false)
        const response = await deleteList(id, { redirect: "/" })
        if (!response.success) toast("Could'nt delete list", { description: "Something went wrong" })
        toast("list deleted")
        router.push("/")

    }
    return (
        <>
            <div className="flex gap-1">
                <Button variant="ghost" onClick={() => setIsMembersDialogOpen(true)}><UsersRoundIcon /> Members</Button>
                <Button variant="ghost" onClick={() => handleShare()}><Share2Icon /> Share</Button>
                <Button variant="ghost" onClick={() => handleCopy()}><CopyIcon /> Copy list</Button>
                {userRole == "owner" && <Button variant="destructive" onClick={() => setDeleteDialgOpen(true)}><Trash2Icon /> Delete List</Button>}
            </div>

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
                <LoginDialog isOpen={isMembersDialogOpen} setIsOpen={(isOpen) => setIsMembersDialogOpen(isOpen)} /> :
                <MemberSettingsDiaolog isOpen={isMembersDialogOpen} setIsOpen={(isOpen) => setIsMembersDialogOpen(isOpen)} />
            }
        </>
    )
}
