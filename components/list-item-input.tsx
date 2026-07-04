"use client"
import { useState } from 'react'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './ui/input-group'
import { ArrowUpIcon } from 'lucide-react'

export default function ListItemInput({ onValueSubmit }: { onValueSubmit: (val: string) => void }) {

    const [value, setValue] = useState<string>("")

    function handleSubmit() {
        if (!value.trim()) return
        onValueSubmit(value)
        setValue("")
    }

    return (
        <div className="sticky bottom-5 w-full px-4">
            <InputGroup className="h-12 rounded-full pl-2 pr-1" >
                <InputGroupInput value={value} onChange={(event) => setValue(event.target.value)} placeholder="Add your first item" />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton onClick={() => handleSubmit()} variant="default" className="rounded-full size-9">
                        <ArrowUpIcon className="size-5" />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>
    )
}
