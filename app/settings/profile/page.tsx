import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import clsx from "clsx";
import { ArrowLeftIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import NameForm from "./_components/name-form";

export default async function Page() {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) redirect("/")
    const { data: profile } = await supabase.from("profiles").select("name, avatarUrl:avatar_url").eq("id", userData.user?.id).single()
    return (
        <>
            <div className="justify-between w-full flex items-center mb-5">
                <Link href="/settings" className={clsx(buttonVariants({ variant: "secondary" }), "rounded-full w-11 h-11")}><ArrowLeftIcon strokeWidth={2} /></Link>
                <h1>Profile</h1>
                <div className="w-11"></div>
            </div>
            <div className="flex flex-col gap-7">
                <Avatar className="size-20 mx-auto border-4 border-muted">
                    <AvatarImage src={profile?.avatarUrl} alt="@shadcn" />
                    <AvatarFallback className="text-3xl">{profile?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex gap-2 justify-center items-center text-muted-foreground">
                    <MailIcon className="size-5" />
                    <div>{userData.user.email}</div>
                </div>
                <NameForm defaultName={profile?.name} />
            </div>
        </>
    )
}
