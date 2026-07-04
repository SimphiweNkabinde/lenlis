"use client"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { createList } from "@/lib/actions/create-list"
import { ArrowUpIcon, ListIcon } from "lucide-react"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

type Inputs = {
    name: string;
    item: string;
};

export default function NewListForm() {

    const { handleSubmit, reset, register, formState: { isSubmitting } } = useForm<Inputs>()
    const [listItem, setListItem] = useState<string>("")

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setListItem(data.item)
        reset({ name: data.name, item: "" })
        await createList(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col relative">
            <div className="border-b-1 py-4 px-5">
                <Input
                    {...register("name")}
                    autoFocus
                    className="text-2xl rounded-none border-0 bg-transparent focus-visible:ring-0 px-0 mb-2"
                    placeholder="New list" />
            </div>
            <ListContainer listItem={listItem} />
            <div className="sticky bottom-5 w-full px-4">
                <InputGroup className="h-12 rounded-full pl-2 pr-1" >
                    <InputGroupInput {...register("item", { required: true })} placeholder="Add your first item" />
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton type="submit" variant="default" className="rounded-full size-9">
                            <ArrowUpIcon className="" />
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        </form>
    )
}

function ListContainer({ listItem }: { listItem: string }) {

    if (!listItem) return <EmptyList />

    return (
        <ul className="list-outside ml-6 h-full pl-4 pr-4 flex flex-col gap-3 overflow-y-scroll pt-5 pb-10">
            <li className="text-[16px]">
                {listItem}
            </li>
        </ul>
    )
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
