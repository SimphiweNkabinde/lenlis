import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Marker, MarkerContent } from "@/components/ui/marker";
import Image from "next/image";
import Link from "next/link";
import EmailLoginForm from "../_components/email-login-form";
import GoogleLoginButton from "../_components/google-login-button";

export default function Page() {

    return (
        <div className="h-dvh flex flex-col items-center justify-between p-6">
            <div></div>
            <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
                <div className="flex justify-center">
                    <Image className="dark:hidden" src="/lenlis-logo.png" height={45} width={45} alt="lenlis logo" />
                    <Image className="hidden dark:block" src="/lenlis-logo-white.png" height={45} width={45} alt="lenlis logo" />
                </div>
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Log in or Sign up</h1>
                    <p className="text-sm text-muted-foreground">Access your lists on any device. Collaborate with others in real-time</p>
                </div>
                <div className="flex flex-col gap-6">
                    <div>
                        <GoogleLoginButton />
                    </div>
                    <Marker variant="separator">
                        <MarkerContent>OR</MarkerContent>
                    </Marker>
                    <EmailLoginForm />
                </div>

            </div>
            <p className="text-xs sm:text-sm text-center text-muted-foreground">
                By clicking continue, you agree to our <Link className="underline" href="#">Terms of Service</Link> and <Link className="underline" href="#">Privacy Policy</Link>.
            </p>
        </div>
    )
}
