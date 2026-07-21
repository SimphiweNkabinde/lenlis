import { buttonVariants } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import clsx from "clsx";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function Loading() {
    return (
        <>
            <div className="justify-between w-full flex items-center mb-5">
                <Link href="/" className={clsx(buttonVariants({ variant: "secondary" }), "rounded-full w-11 h-11")}><ArrowLeftIcon strokeWidth={2} /></Link>
            </div>

            <div className="flex w-full flex-col gap-3 animate-pulse">
                <div className="text-muted-foreground">Account</div>
                <Item variant="muted" size="default" className="h-18">
                    <ItemMedia className="h-full">
                        <div className="size-5 rounded bg-muted"></div>
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle className="w-25 h-4 bg-muted rounded mb-1"></ItemTitle>
                        <ItemDescription className="w-40 h-4 bg-muted rounded"></ItemDescription>
                    </ItemContent>
                </Item>
                <Item variant="muted" size="default" className="h-18">
                    <ItemMedia className="h-full">
                        <div className="size-5 rounded bg-muted"></div>
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle className="w-25 h-4 bg-muted rounded mb-1"></ItemTitle>
                        <ItemDescription className="w-40 h-4 bg-muted rounded"></ItemDescription>
                    </ItemContent>
                </Item>
                <div className="text-muted-foreground mt-5">Help & Support</div>
                <Item variant="muted" size="default" className="h-18">
                    <ItemMedia className="h-full">
                        <div className="size-5 rounded bg-muted"></div>
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle className="w-25 h-4 bg-muted rounded mb-1"></ItemTitle>
                        <ItemDescription className="w-40 h-4 bg-muted rounded"></ItemDescription>
                    </ItemContent>
                </Item>
                <Item variant="muted" size="default" className="h-18">
                    <ItemMedia className="h-full">
                        <div className="size-5 rounded bg-muted"></div>
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle className="w-25 h-4 bg-muted rounded mb-1"></ItemTitle>
                        <ItemDescription className="w-40 h-4 bg-muted rounded"></ItemDescription>
                    </ItemContent>
                </Item>
                <Item variant="muted" size="default" className="h-18 mt-5">
                    <ItemMedia className="h-full">
                        <div className="size-5 rounded bg-muted"></div>
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle className="w-25 h-4 bg-muted rounded mb-1"></ItemTitle>
                    </ItemContent>
                </Item>
            </div>
        </ >
    )
}
