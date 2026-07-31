"use client"
import Spinner from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { updateProfile } from "@/lib/actions/update-profile"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

export default function NameForm({ defaultName }: { defaultName: string }) {
    const { handleSubmit, register, formState: { isSubmitting, dirtyFields, errors }, setError } = useForm<{ name: string }>({ defaultValues: { name: defaultName } })

    const onSubmit: SubmitHandler<{ name: string }> = async (data) => {
        if (!data.name.trim()) return
        const response = await updateProfile({ name: data.name.trim() })
        if (!response.success) {
            if (response.errors) setError("name", { message: response?.errors?.name.toString() })
            else toast.error("Something went wrong", { description: "Please try again" })
        } else {
            toast.success("profile updated")
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <div className="flex gap-2">
                    <Input min={1} max={25} disabled={isSubmitting} className="rounded-lg h-10" {...register("name", { required: true })} />
                    <Button disabled={!dirtyFields.name || isSubmitting} type="submit" className="rounded-lg h-10 text-lg">
                        {isSubmitting && <Spinner />} save
                    </Button>
                </div>
                <FieldError errors={[{ message: errors.name?.message }]} />
            </Field>
        </form>
    )
}
