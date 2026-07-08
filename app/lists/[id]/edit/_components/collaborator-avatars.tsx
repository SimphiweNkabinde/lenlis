"use client"
import { PlusIcon, UserRoundIcon } from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount
} from "@/components/ui/avatar"
import { useState } from "react"
import { AuthDialog } from "@/components/auth-dialog"

export function CollaboratorAvatars() {
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState<boolean>(false)

    return (
        <>
            <AvatarGroup className="" onClick={() => setIsAuthDialogOpen(true)}>
                <Avatar size="default">
                    <AvatarFallback><UserRoundIcon className="size-5" /></AvatarFallback>
                </Avatar>
                <AvatarGroupCount>
                    <PlusIcon />
                </AvatarGroupCount>
            </AvatarGroup>
            <AuthDialog isOpen={isAuthDialogOpen} setIsOpen={(isOpen) => setIsAuthDialogOpen(isOpen)} />
        </>
    )
}
