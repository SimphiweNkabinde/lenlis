import { PlusIcon } from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from "@/components/ui/avatar"

const users = [
    { src: "https://github.com/shadcn.png", fallback: "CN", alt: "@shadcn" },
    { src: "https://github.com/maxleiter.png", fallback: "LR", alt: "@maxleiter" },
    { src: "https://github.com/evilrabbit.png", fallback: "ER", alt: "@evilrabbit" }
]

export function CollaboratorAvatars() {

    return (
        <AvatarGroup className="">
            {users.map(u => (
                <Avatar key={u.src} size="sm">
                    <AvatarImage src={u.src} alt={u.alt} />
                    <AvatarFallback>{u.fallback}</AvatarFallback>
                </Avatar>
            ))}
            <AvatarGroupCount>
                <PlusIcon />
            </AvatarGroupCount>
        </AvatarGroup>
    )
}
