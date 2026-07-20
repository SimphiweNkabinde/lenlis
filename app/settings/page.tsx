import { buttonVariants } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { ArrowLeftIcon, BellIcon, ChevronRightIcon, CircleQuestionMarkIcon, GemIcon } from "lucide-react"
import Link from "next/link"
import LogoutItem from "./_components/logout-item"
import EmailItem from "./_components/email-item"
import clsx from "clsx"
import ProfileItem from "./_components/profile-item"

export default async function Page() {
    return (
        <>
            <div className="justify-between w-full flex items-center mb-5">
                <Link href="/" className={clsx(buttonVariants({ variant: "secondary" }), "rounded-full w-11 h-11")}><ArrowLeftIcon strokeWidth={2} /></Link>
            </div>
            <h1 className="text-3xl mb-10 font-bold text-center">Settings</h1>

            <div className="flex w-full flex-col gap-3">
                <ProfileItem />
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
        </ >
    )
}
