"use client"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { createList } from "@/lib/actions/create-list"
import clsx from "clsx"
import { ArrowUpIcon } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import { success } from "zod"

export default function NewListForm() {

    const { handleSubmit, register, formState: { isSubmitting, dirtyFields }, getValues } = useForm<{ name: string }>({ defaultValues: { name: "" } })

    const onSubmit: SubmitHandler<{ name: string }> = async (data) => {
        if (!data.name.trim()) return
        const { success } = await createList(data.name.trim())
        if (!success) {
            toast.error("Something went wrong", { description: "Please try again" })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="h-3/4 flex flex-col items-center justify-evenly gap-5">
            <p className="text-current/50 text-sm text-center">
                From groceries to travel plans. <br /> Every list starts here.
            </p>
            <div className="w-full px-4 flex flex-col items-center justify-evenly gap-5">
                <h1 className="text-2xl">Start a new list</h1>
                <InputGroup className={clsx("h-12 rounded-full pl-2 pr-1", { "animate-pulse": isSubmitting })} >
                    <InputGroupInput disabled={isSubmitting} {...register("name", { required: true })} placeholder="Give it a name" />
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton type="submit" disabled={!dirtyFields.name || isSubmitting} variant="default" className="rounded-full size-9">
                            <ArrowUpIcon className="size-5" />
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>
            <p></p>
        </form>
    )
}
