import { buttonVariants } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { ArrowLeftIcon, BugIcon, ChevronRightIcon, InfoIcon } from "lucide-react"
import Link from "next/link"
import LogoutItem from "./_components/logout-item"
import clsx from "clsx"
import ProfileItem from "./_components/profile-item"

export default async function Page() {
    return (
        <>
            <div className="justify-between w-full flex items-center mb-5">
                <Link href="/" className={clsx(buttonVariants({ variant: "secondary" }), "rounded-full w-11 h-11")}><ArrowLeftIcon strokeWidth={2} /></Link>
            </div>

            <div className="flex w-full flex-col gap-3">
                <div className="text-muted-foreground">Account</div>
                <ProfileItem />
                <div className="text-muted-foreground mt-5">Help & Support</div>
                <Item variant="muted" size="default" className="" render={
                    <Link href="/settings/notifications">
                        <ItemMedia className="h-full">
                            <BugIcon className="size-5" />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>Send feedback</ItemTitle>
                            <ItemDescription>Report technical issues</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <ChevronRightIcon className="size-4" />
                        </ItemActions>
                    </Link>} />
                <Item variant="muted" size="default" className="" render={
                    <Link href="/settings/about">
                        <ItemMedia className="h-full">
                            <InfoIcon className="size-5" />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>About</ItemTitle>
                            <ItemDescription>Terms & privacy policy</ItemDescription>
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
