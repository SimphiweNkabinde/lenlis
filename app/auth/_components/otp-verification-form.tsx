import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldTitle } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { verifyOtp } from "@/lib/actions/verify-otp";
import { useActionState } from "react";

export default function OtpVerificationForm({ email, convertAnonToEmail }: { email: string, convertAnonToEmail: boolean }) {

    const verifyOtpValue = async (state: { success: boolean, message: string }, formData: FormData) => {
        const response = await verifyOtp(formData.get("otp") as string, email, convertAnonToEmail)
        if (response.success) window.location.href = "/"
        return response
    }
    const [state, formAction, isPending] = useActionState(verifyOtpValue, { success: false, message: "" })
    return (
        <form action={formAction} className="flex flex-col gap-4 items-center justify-center">
            <Field className="justify-center text-center">
                <FieldTitle className="text-lg block">Check your inbox</FieldTitle>
                <FieldDescription className="text-center"><span className="text-white">Enter the verification code</span> we just sent to {email}.</FieldDescription>
                <InputOTP maxLength={6} minLength={6} name="otp" className="" required autoFocus>
                    <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-9 *:data-[slot=input-otp-slot]:w-9 *:data-[slot=input-otp-slot]:text-lg">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                {!state.success &&
                    <FieldError errors={[{ message: state.message }]} />
                }
            </Field>
            <Field>
                <Button disabled={isPending} type="submit" className="h-9 rounded-lg"> {isPending && <Spinner />} Verify code</Button>
            </Field>
        </form>
    )
}