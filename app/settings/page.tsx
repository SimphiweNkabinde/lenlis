import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { ArrowLeftIcon, BellIcon, ChevronRightIcon, CircleDollarSignIcon, CircleQuestionMarkIcon, FileTextIcon, LogOutIcon, PencilIcon, ShapesIcon, ShieldAlertIcon } from "lucide-react"
import Link from "next/link"
import LogoutItem from "./_components/logout-item"
import EmailItem from "./_components/email-item"
import clsx from "clsx"

export default function Page() {
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
                <div className="font-semibold text-xl">Jacob Mazibuko</div>
            </div>

            <div className="flex w-full flex-col gap-3">
                <EmailItem />
                <Item variant="muted" size="default" className="" render={
                    <Link href="/settings/notifications">
                        <ItemMedia>
                            <BellIcon className="size-5" />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>Notifications</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <ChevronRightIcon className="size-4" />
                        </ItemActions>
                    </Link>} />
                <Item variant="muted" size="default" className="" render={
                    <Link href="/settings/notifications">
                        <ItemMedia>
                            <CircleDollarSignIcon className="size-5" />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>Upgrade to Premium</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <ChevronRightIcon className="size-4" />
                        </ItemActions>
                    </Link>} />
                <Item variant="muted" size="default" className="" render={
                    <Link href="/settings/notifications">
                        <ItemMedia>
                            <ShieldAlertIcon className="size-5" />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>Privacy</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <ChevronRightIcon className="size-4" />
                        </ItemActions>
                    </Link>} />
                <Item variant="muted" size="default" className="" render={
                    <Link href="/settings/notifications">
                        <ItemMedia>
                            <ShapesIcon className="size-5" />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>Terms of Service</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <ChevronRightIcon className="size-4" />
                        </ItemActions>
                    </Link>} />
                <Item variant="muted" size="default" className="" render={
                    <Link href="/settings/notifications">
                        <ItemMedia>
                            <CircleQuestionMarkIcon className="size-5" />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>Suppport</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <ChevronRightIcon className="size-4" />
                        </ItemActions>
                    </Link>} />
                <Item variant="muted" size="default" className="" render={
                    <Link href="/settings/notifications">
                        <ItemMedia>
                            <FileTextIcon className="size-5" />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>Community Guideline</ItemTitle>
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
