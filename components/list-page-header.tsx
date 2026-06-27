import { ArrowLeftIcon } from "lucide-react";
import { Button } from "./ui/button";
import { AuthDialog } from "./auth-dialog";
import Link from "next/link";

export default function ListPageHeader() {
    return (
        <div className="pb-2 justify-between w-full flex items-center py-4 px-4">
            <Link
                href="/"
                className="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 rounded-full size-10 rounded-full size-10">
                <ArrowLeftIcon />
            </Link>
            <div className="font-semibold text-lg">My Lists</div>
            <AuthDialog>
                <Button className="text-base">Login</Button>
            </AuthDialog>
        </div>
    )
}
