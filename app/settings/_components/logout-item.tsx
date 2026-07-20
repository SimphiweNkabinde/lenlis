"use client"
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item'
import { LogOutIcon } from 'lucide-react'

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
import { createClient } from "@/lib/supabase/client"
import { useState } from 'react'

export default function LogoutItem() {

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    return (
        <Item onClick={() => setIsDialogOpen(true)} variant="muted" size="default" className="hover:bg-muted mt-5">
            <ItemMedia>
                <LogOutIcon className="size-5 text-destructive" />
            </ItemMedia>
            <ItemContent>
                <ItemTitle className="text-destructive cursor-default">Log out</ItemTitle>
            </ItemContent>
            <LogoutAlertDialog isOpen={isDialogOpen} setIsOpen={(open) => setIsDialogOpen(open)} />
        </Item>
    )
}


export function LogoutAlertDialog({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {

    async function handleLogout() {
        const supabase = await createClient()
        const { error } = await supabase.auth.signOut()
        if (!error) window.location.href = "/"
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 size-10 p-2 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <LogOutIcon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to log out?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleLogout()} variant="destructive">Log out</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
