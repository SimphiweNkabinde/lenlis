"use client"
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { useAuth } from "@/context/auth-provider";
import { MailIcon } from "lucide-react";

export default function EmailItem() {
    const { user, loading } = useAuth()
    return (
        <Item variant="muted" size="default" className="" >
            <ItemMedia className="h-full">
                <MailIcon className="size-5" />
            </ItemMedia>
            <ItemContent>
                <ItemTitle>Email</ItemTitle>
                <ItemDescription>
                    {loading ? <span className="block w-full max-w-70 bg-muted h-5 animate-pulse rounded"></span> : user?.email}
                </ItemDescription>
            </ItemContent>
        </Item>
    )
}
