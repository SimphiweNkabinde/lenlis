import HeaderSkeleton from "@/components/skeletons/header-skeleton";

export default function LoadingPage() {
    const items = Array(10).fill("card")
    return (
        <div className="flex h-dvh flex-col overflow-hidden animate-pulse">
            <HeaderSkeleton />
            <div className="border-b-1 pt-4 px-5 flex flex-col gap-3 h-32">
                <div className="rounded bg-muted h-7 w-full"></div>
                <div className="flex items-center gap-2">
                    <div className="rounded-full size-7 bg-muted"></div>
                    <div className="h-4 bg-muted w-25 rounded"></div>
                </div>
            </div>
            <ul className="list-outside px-5 flex flex-col gap-7 overflow-y-scroll pt-5 pb-10">
                <li className="h-5 bg-muted rounded w-1/3"></li>
                <li className="h-5 bg-muted rounded w-full"></li>
                <li className="h-5 bg-muted rounded w-1/2"></li>
                <li className="h-5 bg-muted rounded w-full"></li>
                <li className="h-5 bg-muted rounded w-1/5"></li>
                <li className="h-5 bg-muted rounded w-6/8"></li>
                <li className="h-5 bg-muted rounded w-6/8"></li>
                <li className="h-5 bg-muted rounded w-2/3"></li>
                <li className="h-5 bg-muted rounded w-1/2"></li>
                <li className="h-5 bg-muted rounded w-1/6"></li>
            </ul>
        </div>
    )
}
