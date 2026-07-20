import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import { Form } from "@base-ui/react";
import clsx from "clsx";
import { ArrowLeftIcon, CameraIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) redirect("/")
    const { data: profile } = await supabase.from("profiles").select("name, username, avatarUrl:avatar_url").eq("id", userData.user?.id).single()
    return (
        <>
            <div className="justify-between w-full flex items-center mb-5">
                <Link href="/settings" className={clsx(buttonVariants({ variant: "secondary" }), "rounded-full w-11 h-11")}><ArrowLeftIcon strokeWidth={2} /></Link>
                <h1>User Profile</h1>
                <div className="w-11"></div>
            </div>
            <div className="flex flex-col gap-10">
                <Avatar className="size-30 mx-auto border-4 border-muted">
                    <AvatarImage src={profile?.avatarUrl} alt="@shadcn" />
                    <AvatarFallback className="text-3xl">{profile?.username?.charAt(0)}</AvatarFallback>
                    <AvatarBadge className="!size-7"><CameraIcon className="!size-5" /></AvatarBadge>
                </Avatar>
                <Form>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
                            <Input defaultValue={profile?.name} id="fieldgroup-name" />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="fieldgroup-username">Username</FieldLabel>
                            <Input id="fieldgroup-username" defaultValue={profile?.username} />
                            <FieldDescription>
                                Your profile helps people recognize you.
                            </FieldDescription>
                        </Field>
                        <Field orientation="horizontal">
                            <Button type="submit" className="" size="lg">Save profile</Button>
                        </Field>
                    </FieldGroup>
                </Form>
            </div>
        </>
    )
}
