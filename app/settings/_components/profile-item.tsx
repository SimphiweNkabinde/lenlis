"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { useAuth } from '@/context/auth-provider'
import { ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'

export default function ProfileItem() {
    const { user } = useAuth()
    return (
        <Item variant="muted" size="default" className="mb-5" render={
            <Link href="/settings/profile">
                <ItemMedia className="h-full">
                    <Avatar className="size-10">
                        <AvatarImage src={user?.avatarUrl} alt="@shadcn" />
                        <AvatarFallback className="text-xl">{user?.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>{user?.name}</ItemTitle>
                    <ItemDescription>@{user?.username}</ItemDescription>
                </ItemContent>
                <ItemActions>
                    <ChevronRightIcon className="size-4" />
                </ItemActions>
            </Link>} />
    )
}
