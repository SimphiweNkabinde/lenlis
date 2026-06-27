import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './ui/input-group'
import { ArrowUpIcon } from 'lucide-react'

export default function ListItemInput() {
    return (
        <div className="sticky bottom-5 w-full px-4">
            <InputGroup className="h-12 rounded-full pl-2" >
                <InputGroupInput placeholder="Add your first item" />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton variant="default" className="rounded-full size-9 mr-1">
                        <ArrowUpIcon className="" />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>
    )
}
