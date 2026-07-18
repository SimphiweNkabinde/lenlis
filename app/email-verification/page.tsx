import { Suspense } from "react"
import EmailVerification from "./_components/email-verification"
import { Button } from "@/components/ui/button"

export default async function Page() {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center text-center gap-12 justify-center pt-15 animate-pulse">
                <div className="h-7 w-12 bg-muted">lenlis</div>
                <div>
                    <div className="h-8 w-50 mb-3"></div>
                    <div className="bg-muted h-7 w-full"></div>
                    <div className="bg-muted h-7 w-35"></div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="h12 w-65 bg-muted mb-4"></div>
                    <Button type="submit" variant="secondary" className="h-12 rounded-full w-full animate-pulse">Verify</Button>
                    <div className="h-6 w-35 bg-muted" >Resend email</div>
                </div>
            </div>
        }>
            <EmailVerification />
        </Suspense>)
}