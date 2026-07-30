import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import { Form } from "@base-ui/react";
import clsx from "clsx";
import { ArrowLeftIcon, CameraIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) redirect("/")
    const { data: profile } = await supabase.from("profiles").select("name, avatarUrl:avatar_url").eq("id", userData.user?.id).single()
    return (
        <>
            <div className="justify-between w-full flex items-center mb-5">
                <Link href="/settings" className={clsx(buttonVariants({ variant: "secondary" }), "rounded-full w-11 h-11")}><ArrowLeftIcon strokeWidth={2} /></Link>
                <h1>User Profile</h1>
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
                <Form>
                    <Field>
                        <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
                        <div className="flex gap-2">
                            <Input defaultValue={profile?.name} className="rounded-lg h-10" id="fieldgroup-name" />
                            <Button disabled type="submit" className="rounded-lg h-10 text-lg">save</Button>
                        </div>
                    </Field>
                </Form>
            </div>
        </>
    )
}
