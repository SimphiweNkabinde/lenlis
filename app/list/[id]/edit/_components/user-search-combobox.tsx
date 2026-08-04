"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import { InputGroupAddon } from "@/components/ui/input-group"
import {
    Item,
    ItemContent,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { UserRoundPlusIcon } from "lucide-react"
import { useState } from "react"
import z from "zod"
import { useListStore } from "../_stores/use-list-store"

export function UserSearchCombobox() {
    const { addInvite } = useListStore(state => state)
    const [validEmail, setValidEmail] = useState<string | null>(null)

    function handleChange(value: string) {
        const validatedEmail = z.email().safeParse(value)

        if (validatedEmail.success) {
            setValidEmail(validatedEmail.data)
        } else setValidEmail(null)
    }

    return (
        <>
            <Combobox autoComplete="off"
                onValueChange={(value) => typeof value == "string" ? addInvite(value) : {}}
                items={validEmail ? [validEmail] : []}
            >
                <ComboboxInput autoFocus={false} autoComplete="off" onChange={(event) => handleChange(event.target.value)} placeholder="email">
                    <InputGroupAddon autoFocus={false}>
                        <UserRoundPlusIcon />
                    </InputGroupAddon>
                </ComboboxInput>
                <ComboboxContent>
                    {/* <ComboboxEmpty>No countries found.</ComboboxEmpty> */}
                    <ComboboxList>
                        {(email: string) => (
                            <ComboboxItem key={email} value={email}>
                                <Item size="xs" className="p-0">
                                    <ItemMedia>
                                        <Avatar>
                                            <AvatarFallback className="text-xl"><UserRoundPlusIcon /></AvatarFallback>
                                        </Avatar>
                                    </ItemMedia>
                                    <ItemContent>
                                        <ItemTitle className="break-all">
                                            {email}
                                        </ItemTitle>
                                    </ItemContent>
                                </Item>
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </>
    )
}
