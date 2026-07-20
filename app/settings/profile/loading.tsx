import { Avatar } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import clsx from "clsx";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function Loading() {
    return (
        <>
            <div className="justify-between w-full flex items-center mb-5">
                <Link href="/settings" className={clsx(buttonVariants({ variant: "secondary" }), "rounded-full w-11 h-11")}><ArrowLeftIcon strokeWidth={2} /></Link>
                <h1>User Profile</h1>
                <div className="w-11"></div>
            </div>
            <div className="flex flex-col gap-10 animate-pulse">
                <Avatar className="size-30 mx-auto !border-0 bg-muted">
                </Avatar>
                <FieldGroup>
                    <Field>
                        <FieldLabel className="max-w-12 h-5 bg-muted rounded"></FieldLabel>
                        <div className="w-full h-8 bg-muted rounded"></div>
                    </Field>
                    <Field>
                        <FieldLabel className="max-w-14 h-5 bg-muted rounded"></FieldLabel>
                        <div className="w-full h-8 bg-muted rounded"></div>
                        <FieldDescription className="max-w-1/2 h-5 bg-muted rounded"></FieldDescription>
                    </Field>
                    <div className="w-28 h-9 bg-muted rounded-full"></div>
                </FieldGroup>
            </div>
        </>
    )
}
