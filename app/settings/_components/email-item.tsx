"use client"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { useAuth } from "@/context/auth-provider";
import { ChevronRightIcon, MailIcon } from "lucide-react";
import Link from "next/link";

export default function EmailItem() {
    const { user, loading } = useAuth()
    return (
        <Item variant="muted" size="default" className="" render={
            <Link href="/settings/email" className="items-center">
                <ItemMedia className="h-full">
                    <MailIcon className="size-5" />
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>Email</ItemTitle>
                    <ItemDescription>
                        {loading ? <div className="w-full max-w-70 bg-muted h-5 animate-pulse rounded"></div> : user?.email}

                    </ItemDescription>
                </ItemContent>
                <ItemActions>
                    <ChevronRightIcon className="size-4" />
                </ItemActions>
            </Link>} />
    )
}
