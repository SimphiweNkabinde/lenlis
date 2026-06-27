import ListPageHeader from "@/components/list-page-header";
import { ListTabs } from "@/components/list-tabs";

export default function Page() {
    return (
        <div className="flex h-dvh relative flex flex-col overflow-hidden">
            <ListPageHeader />
            <ListTabs />
        </div>
    )
}
