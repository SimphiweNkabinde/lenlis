"use client"
import { useState } from 'react'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { ArrowUpIcon } from 'lucide-react'
import { useListStore } from '../_stores/use-list-store'

export default function ListItemInput() {

    const addItem = useListStore(state => state.addItemOptimistically)

    const [value, setValue] = useState<string>("")

    function handleSubmit() {
        addItem({ text: value })
        setValue("")
    }

    return (
        <div className="sticky bottom-5 w-full px-4">
            <InputGroup className="h-12 rounded-full pl-2 pr-1" >
                <InputGroupInput value={value} onChange={(event) => setValue(event.target.value)} placeholder="Add your first item" />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton onClick={() => handleSubmit()} variant="default" className="rounded-full size-9">
                        <ArrowUpIcon className="" />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>
    )
}
