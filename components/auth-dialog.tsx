"use client"
import { useActionState } from "react"

// import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Separator } from "./ui/separator"
import { signInWithEmail } from "@/lib/actions/sign-in"
import clsx from "clsx"
import { useRouter } from "next/navigation"

export function AuthDialog({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
    const isDesktop = false //useMediaQuery("(min-width: 768px)")

    const title = "Log in or Sign up"
    const description = "Access your lists instantly on any device. Collaborate with others in real-time"

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    <AuthForm />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>
                        {description}
                    </DrawerDescription>
                </DrawerHeader>
                <AuthForm />
            </DrawerContent>
        </Drawer>
    )
}

export function AuthForm() {
    const router = useRouter()
    const signInWithEmailAdress = async (state: { success: boolean, message: string }, formData: FormData) => {
        const email = formData.get("email") as string
        const response = await signInWithEmail(email)
        if (response.success) {
            router.push(`/email-verification?email=${encodeURIComponent(email)}`)
        }
        return response
    }
    const [state, formAction, isPending] = useActionState(signInWithEmailAdress, { success: false, message: "", data: "" })

    return (
        <div className="flex flex-col gap-4 px-5">
            <Button variant="outline" className="h-10 flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                <span>Continue with Google</span>
            </Button>
            <div className="grid grid-cols-5 items-center">
                <Separator className="col-span-2" />
                <span className="col-span-1 text-center text-current/50">OR</span>
                <Separator className="col-span-2" />
            </div>
            <form action={formAction} className="flex flex-col gap-4">
                <div>
                    <Input required defaultValue={state.data?.email} name="email" placeholder="Email address" type="email" className="px-5 h-10 mb-1" />
                    {!state.success &&
                        <span className="text-destructive ms-5 text-sm">
                            {state.message}{state.errors && <>: {state.errors?.email.toString()}</>}
                        </span>
                    }
                </div>
                <Button type="submit" disabled={isPending} className={clsx("h-10", { "animate-pulse": isPending })}>Continue</Button>
            </form>
        </div>
    )
}
