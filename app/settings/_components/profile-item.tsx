"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { useAuth } from '@/context/auth-provider'
import clsx from 'clsx'
import { ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'

export default function ProfileItem() {
    const { user, loading } = useAuth()
    return (

        <Item variant="muted" size="default" render={
            <Link href="/settings/profile">
                <ItemMedia className="h-full">
                    <Avatar className={clsx("size-10", { "animate-pulse": loading })}>
                        <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                        <AvatarFallback className="text-xl">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </ItemMedia>
                <ItemContent>
                    <ItemTitle className={clsx({ "w-25 h-4 bg-muted rounded mb-1": loading })}>{user?.name}</ItemTitle>
                    <ItemDescription className={clsx({ "w-40 h-4 bg-muted rounded": loading })}>{user?.email && user?.email}</ItemDescription>
                </ItemContent>
                <ItemActions>
                    <ChevronRightIcon className="size-4" />
                </ItemActions>
            </Link>} />
    )
}
