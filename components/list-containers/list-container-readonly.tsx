import { ListItem as ListItemType } from "@/lib/definitions";
import { Checkbox } from "../ui/checkbox";
import clsx from "clsx";
import { ListIcon } from "lucide-react";

export default function ListContainerReadonly({ list = [], showAmounts, showChecks }: { list: ListItemType[], showChecks: boolean, showAmounts: boolean }) {

    if (!list.length) return <EmptyList />

    return (
        <ul className="list-outside ml-6 pl-4 pr-4 flex flex-col gap-3 overflow-y-scroll pt-5 pb-10">
            {list.map(item => (
                <li key={item.id}>
                    <ListItem item={item} showAmounts={showAmounts} showChecks={showChecks} />
                </li>

            ))}
        </ul>
    )
}

function ListItem({ item, showAmounts, showChecks }: { item: ListItemType, showChecks: boolean, showAmounts: boolean }) {
    const { checked, text, amount } = item

    return (
        <div className="flex items-center gap-2 justify-between h-8">
            <div className="flex gap-2 items-center">
                {showChecks &&
                    <Checkbox
                        readOnly
                        checked={checked}
                        className="rounded-full size-5 border-black/50 dark:border-white/50 bg-transparent" />
                }
                <div className={clsx(
                    "text-[16px] min-h-6 border-0 rounded-none bg-transparent focus-visible:ring-0 p-0 m-0",
                    { "line-through decoration-1 text-current/60": checked && showChecks }
                )} >{text}</div>
            </div>
            {showAmounts &&
                <div className={clsx("w-40 text-right bg-transparent", { "line-through decoration-1 text-current/60": item.checked && showChecks })}>
                    {amount || 0}
                </div>
            }
        </div>)
}

function EmptyList() {
    return (
        <div className="flex items-center justify-center h-full px-4">
            <div className="text-current/75 flex gap-2 items-center">
                <ListIcon className="w-4" /><span>Start a new list</span>
            </div>
        </div>
    )
}
