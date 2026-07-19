import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { ArrowLeftIcon, BellIcon, ChevronRightIcon, CircleDollarSignIcon, CircleQuestionMarkIcon, FileTextIcon, GemIcon, LogOutIcon, PencilIcon, ShapesIcon, ShieldAlertIcon } from "lucide-react"
import Link from "next/link"
import LogoutItem from "./_components/logout-item"
import EmailItem from "./_components/email-item"
import clsx from "clsx"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function Page() {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) redirect("/")
    const { data: profile } = await supabase.from("profiles").select("name, username, avatar_url").eq("id", userData.user?.id).single()
    return (
        <div className="h-dvh relative flex flex-col overflow-scroll p-4">
            <div className="justify-between w-full flex items-center mb-5">
                <Link href="/" className={clsx(buttonVariants({ variant: "secondary" }), "rounded-full w-11 h-11")}><ArrowLeftIcon strokeWidth={2} /></Link>
                <h1 className="text-2xl">Settings</h1>
                <div className="w-11"></div>
            </div>
            <div className="text-center mb-10">
                <Avatar className="size-20 mx-auto mb-5">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                    <AvatarBadge className="!size-7">
                        <PencilIcon />
                    </AvatarBadge>
                </Avatar>
                <div className="font-semibold text-xl">{profile?.name}</div>
                <div className="text-base text-muted-foreground">@{profile?.username}</div>
            </div>

            <div className="flex w-full flex-col gap-3">
                <EmailItem />
                <Item variant="muted" size="default" className="" render={
                    <Link href="/settings/notifications">
                        <ItemMedia className="h-full">
                            <GemIcon className="size-5" />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>Subscriptions</ItemTitle>
                            <ItemDescription>Explore premium benefits</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <ChevronRightIcon className="size-4" />
                        </ItemActions>
                    </Link>} />
                <Item variant="muted" size="default" className="" render={
                    <Link href="/settings/notifications">
                        <ItemMedia className="h-full">
                            <BellIcon className="size-5" />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>Notifications</ItemTitle>
                            <ItemDescription>Email and push notifications</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <ChevronRightIcon className="size-4" />
                        </ItemActions>
                    </Link>} />
                <Item variant="muted" size="default" className="" render={
                    <Link href="/settings/notifications">
                        <ItemMedia className="h-full">
                            <CircleQuestionMarkIcon className="size-5" />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>Help and feedback</ItemTitle>
                            <ItemDescription>Contact us, issues, Terms & privacy</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <ChevronRightIcon className="size-4" />
                        </ItemActions>
                    </Link>} />
                <LogoutItem />
            </div>
        </div >
    )
}
