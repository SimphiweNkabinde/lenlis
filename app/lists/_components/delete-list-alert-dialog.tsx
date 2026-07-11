"use client"
import { Trash2Icon } from "lucide-react"

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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteList } from "@/lib/actions/delete-list"
import { toast } from "sonner"
import { useState } from "react"

export function DeleteListAlertDialog({ listId }: { listId: string }) {

    const [dialgOpen, setDialogOpen] = useState(false)

    async function handleDelete() {
        setDialogOpen(false)
        const response = await deleteList(listId, { redirect: "/lists" })
        if (!response.success) {
            toast.error("Couldn't delete list", { description: "Something went wrong" })
        }
        toast("list deleted")
    }

    return (
        <AlertDialog open={dialgOpen} onOpenChange={(open) => setDialogOpen(open)}>
            <AlertDialogTrigger
                render={<Button variant="ghost" className="text-current/50"><Trash2Icon /></Button>}
            />
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
    )
}
