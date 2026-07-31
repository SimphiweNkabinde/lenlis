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
                <h1>Profile</h1>
                <div className="w-11"></div>
            </div>
            <div className="flex flex-col gap-7 animate-pulse">
                <Avatar className="size-20 mx-auto !border-0 bg-muted" />
                <div className="w-50 h-6 bg-muted mx-auto" />
                <FieldGroup>
                    <Field>
                        <FieldLabel className="max-w-12 h-5 bg-muted rounded"></FieldLabel>
                        <div className="w-full h-10 bg-muted rounded-lg"></div>
                    </Field>
                </FieldGroup>
            </div>
        </>
    )
}
