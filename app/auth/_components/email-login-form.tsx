"use client"

import Spinner from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signInWithEmail } from "@/lib/actions/sign-in"
import { MailIcon } from "lucide-react"
import { useActionState } from "react"
import OtpVerificationForm from "./otp-verification-form"

export default function EmailLoginForm() {
    const signInWithEmailAdress = async (state: { success: boolean, message: string }, formData: FormData) => {
        const email = formData.get("email") as string
        const response = await signInWithEmail(email)
        if (response.success) {
        }
        return response
    }
    const [state, formAction, isPending] = useActionState(signInWithEmailAdress, { success: false, message: "bad", data: { email: "" } })
    return (
        <div className="flex flex-col gap-4">
            {!state.success && <form action={formAction} className="flex flex-col gap-4">
                <Field>
                    <Input defaultValue={state.data.email} disabled={isPending || state.success} className="h-9 rounded-lg" required name="email" placeholder="name@example.com" type="email" />
                    {state.errors?.email &&
                        <FieldError errors={[{ message: state.errors?.email.toString() }]} />
                    }
                </Field>
                <Field>
                    <Button disabled={isPending} className="h-9 rounded-lg" type="submit">
                        {isPending && <Spinner />} <MailIcon /> Continue with email
                    </Button>
                </Field>
            </form>}
            {state.success && <OtpVerificationForm email={state.data.email} convertAnonToEmail={!!state.data.convertAnonToEmail} />}
        </div>
    )
}
