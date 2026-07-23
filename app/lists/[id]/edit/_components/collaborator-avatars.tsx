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
import { LoginDialog } from "@/components/login-dialog"
import { useListStore } from "../_stores/use-list-store"
import { MemberSettingsDiaolog } from "./members-settings-dialog"
import { useAuth } from "@/context/auth-provider"

export function CollaboratorAvatars() {
    const { members } = useListStore(state => state)
    const { session, user } = useAuth()
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

    return (
        <>
            <AvatarGroup className="" onClick={() => setIsDialogOpen(true)}>
                {user?.is_anonymous && <Avatar size="default">
                    <AvatarFallback className="text-lg"><UserRoundIcon className="size-5" /> </AvatarFallback>
                </Avatar>}
                {!user?.is_anonymous && members.map(member => (
                    <Avatar size="default">
                        <AvatarImage src={member.avatarUrl} alt={`@${member.username}`} />
                        <AvatarFallback className="text-lg">{member.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                ))}
                <AvatarGroupCount>
                    <PlusIcon />
                </AvatarGroupCount>
            </AvatarGroup>
            {user?.is_anonymous ?
                <LoginDialog isOpen={isDialogOpen} setIsOpen={(isOpen) => setIsDialogOpen(isOpen)} /> :
                <MemberSettingsDiaolog isOpen={isDialogOpen} setIsOpen={(isOpen) => setIsDialogOpen(isOpen)} />
            }
        </>
    )
}
