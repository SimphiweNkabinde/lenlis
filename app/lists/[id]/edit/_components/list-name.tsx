"use client"
import { Input } from "@/components/ui/input";
import { updateListName } from "@/lib/actions/update-list-name";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

export default function ListName({ defaultName, listId }: { defaultName: string, listId: string }) {
    const updateListNameById = updateListName.bind(null, listId)

    const [isPending, setIsPending] = useState<boolean>(false)

    const handleUpdate = useDebouncedCallback(async (name) => {
        setIsPending(true)
        try {
            const response = await updateListNameById(name)
            if (!response.success) {
                toast.error("Couldn't update list name", { description: response.message })
            }
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
                className={clsx("text-2xl rounded-none border-0 bg-transparent focus-visible:ring-0 px-0 mb-2", { "animate-pulse": isPending })}
                placeholder="New list" />
        </>
    )
}
