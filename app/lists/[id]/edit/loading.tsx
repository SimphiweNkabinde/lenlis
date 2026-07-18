export default function LoadingPage() {
    return (
        <>
            <div className="border-b-1 pt-4 px-5 flex flex-col gap-3 h-33 animate-pulse">
                <div className="rounded bg-muted h-7 w-full"></div>
                <div className="flex items-center justify-between gap-2">
                    <div className="rounded-full h-8 bg-muted w-25"></div>
                    <div className="h-7 bg-muted w-15 rounded"></div>
                </div>
            </div>
            <ul className="list-outside px-5 flex flex-col gap-4 overflow-y-scroll pt-5 pb-10 animate-pulse">
                <li className="h-7 bg-muted rounded w-1/3"></li>
                <li className="h-7 bg-muted rounded w-full"></li>
                <li className="h-7 bg-muted rounded w-1/2"></li>
                <li className="h-7 bg-muted rounded w-full"></li>
                <li className="h-7 bg-muted rounded w-1/5"></li>
                <li className="h-7 bg-muted rounded w-6/8"></li>
                <li className="h-7 bg-muted rounded w-6/8"></li>
                <li className="h-7 bg-muted rounded w-2/3"></li>
                <li className="h-7 bg-muted rounded w-1/2"></li>
                <li className="h-7 bg-muted rounded w-1/6"></li>
            </ul>
        </>
    )
}
