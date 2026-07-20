"use client"
import { PlusIcon, UserRoundIcon } from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage
} from "@/components/ui/avatar"
import { useState } from "react"
import { AuthDialog } from "@/components/auth-dialog"
import { useListStore } from "../_stores/use-list-store"

export function CollaboratorAvatars() {
    const { members } = useListStore(state => state)
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState<boolean>(false)

    return (
        <>
            <AvatarGroup className="" onClick={() => setIsAuthDialogOpen(true)}>
                {members.map(member => (
                    <Avatar size="default">
                        <AvatarImage src={member.avatarUrl} alt={`@${member.username}`} />
                        <AvatarFallback className="text-lg">{member.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                ))}

                <AvatarGroupCount>
                    <PlusIcon />
                </AvatarGroupCount>
            </AvatarGroup>
            <AuthDialog isOpen={isAuthDialogOpen} setIsOpen={(isOpen) => setIsAuthDialogOpen(isOpen)} />
        </>
    )
}
