"use client"
import { AuthForm } from "@/components/auth-dialog"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { resendOtp } from "@/lib/actions/resend-otp"
import { verifyOtp } from "@/lib/actions/verify-otp"
import clsx from "clsx"
import { useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { toast, Toaster } from "sonner"

export default function EmailVerification() {

    const searchParams = useSearchParams()
    const email = searchParams.get("email")!
    const isAnon = searchParams.get("isanon")
    const router = useRouter()

    const verifyOtpValue = async (state: { success: boolean, message: string }, formData: FormData) => {
        const response = await verifyOtp(formData.get("otp") as string, email, isAnon === "true")
        if (response.success) window.location.href = "/"
        return response
    }
    const [state, formAction, isPending] = useActionState(verifyOtpValue, { success: false, message: "" })

    async function handleResend() {
        const response = await resendOtp(email, isAnon === "true")
        if (response.success) {
            toast("verification code has been sent again")
        } else {
            toast.error(response.message)
        }
    }


    if (!email) return (
        <div className="flex flex-col items-center text-center gap-12 justify-center pt-15">
            <div className="text-xl font-medium">lenlis</div>
            <div>
                <h1 className="text-2xl mb-3">Oops, an error occurred!</h1>
                <p className="text-muted-foreground">Missing email for email verification. <br /> Try again. </p>

            </div>
            <AuthForm />
        </div>
    )

    return (
        <>
            <div className="flex flex-col items-center text-center gap-12 justify-center pt-15">
                <div className="text-xl font-medium">lenlis</div>
                <div>
                    <h1 className="text-2xl mb-3">Check your inbox</h1>
                    <p className="text-muted-foreground">Enter the verification code we just sent to <br />{email}</p>
                </div>
                <div className="flex flex-col gap-4">
                    <form action={formAction} className="flex flex-col gap-4 items-center">
                        <InputOTP maxLength={6} minLength={6} name="otp" required autoFocus>
                            <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        {!state.success &&
                            <span className="text-destructive ms-5 text-sm">
                                {state.message}{state.errors && <>: {state.errors?.email.toString()}</>}
                            </span>
                        }
                        <Button type="submit" className={clsx("h-12 rounded-full w-full", { "animate-pulse": isPending })}>Verify</Button>
                    </form>
                    <Button onClick={() => handleResend()} variant="link" >Resend email</Button>
                </div>
            </div>
            <Toaster />
        </>
    )
}
