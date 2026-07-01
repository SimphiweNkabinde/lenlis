import EmptyList from "./empty-list";

type ListItemType = {
    id: string
    text: string,
    is_checked?: boolean,
    amount?: number
}
export default function ListContainer({ list = [] }: { list?: ListItemType[] }) {

    if (!list.length) return <EmptyList />

    return (
        <ul className="list-outside ml-6 h-full pl-4 pr-4 flex flex-col gap-3 overflow-y-scroll pt-5 pb-10">
            {list.map(item => (
                <li key={item.id} className="text-[16px]">
                    {item.text}
                </li>
            ))}
        </ul>
    )
}
