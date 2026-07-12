import HeaderSkeleton from "@/components/skeletons/header-skeleton";
import { ListTabsSkeleton } from "@/components/skeletons/list-tabs-skeleton";

export default async function LoadingPage() {

    return (
        <div className="flex h-dvh relative flex flex-col overflow-hidden">
            <HeaderSkeleton />
            <ListTabsSkeleton />
        </div>
    )
}
