"use client"
import { Input } from "@/components/ui/input";
import { updateList } from "@/lib/actions/update-list-name";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { useListStore } from "../_stores/use-list-store";

export default function ListName({ defaultName }: { defaultName: string }) {

    const [isPending, setIsPending] = useState<boolean>(false)
    const { id: listId, setName: setStoreName } = useListStore(state => state)

    const handleUpdate = useDebouncedCallback(async (name) => {
        setIsPending(true)
        try {
            const response = await updateList(listId, { name })
            if (!response.success) {
                toast.error("Couldn't update list name", { description: response.message })
            }
            setStoreName(name)
        } catch (error) {
            console.log(error)
            toast.error("Couldn't update list name", { description: "Something went wrong" })
        } finally {
            setIsPending(false)
        }
    }, 1000)

    return (
        <>
            <Input
                defaultValue={defaultName}
                onChange={(e) => handleUpdate(e.target.value)}
                className={clsx("text-2xl rounded-none border-0 bg-transparent focus-visible:ring-0 px-0", { "animate-pulse": isPending })}
                placeholder="New list" />
        </>
    )
}
