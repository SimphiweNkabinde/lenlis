
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { SearchIcon, UsersRoundIcon } from "lucide-react"
import { useListStore } from "../_stores/use-list-store"
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function MemberSettingsDiaolog({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
    const { members } = useListStore(state => state)
    const roles: { label: string, value: string }[] = [{ label: "Editor", value: "editor" }, { label: "Viewer", value: "viewer" }, { label: "Owner", value: "owner" }]
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"> <UsersRoundIcon className="size-4" /> Add members</DialogTitle>
                    <DialogDescription>
                        Invite others to collaborate on your list.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-5">
                    <FieldGroup className="flex-row gap-1">
                        <Field>
                            <InputGroup className="rounded-xl">
                                <InputGroupInput placeholder="username or email" />
                                <InputGroupAddon align="inline-start">
                                    <SearchIcon />
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>
                        <Field className="w-auto">
                            <Select items={roles.filter(i => i.value !== "owner")} defaultValue="editor">
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Role</SelectLabel>
                                        {roles.filter(i => i.value !== "owner").map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>
                    <div>
                        <div className="text-muted-foreground">Who has access</div>
                        {members.map(member => (
                            <Item className="px-0">
                                <ItemMedia>
                                    <Avatar>
                                        <AvatarImage src={member.avatarUrl} />
                                        <AvatarFallback>{member.username.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle>{member.username}</ItemTitle>
                                </ItemContent>
                                <ItemActions>
                                    <Select items={roles} disabled={member.role == "owner"} defaultValue={member.role}>
                                        <SelectTrigger className="w-full max-w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Role</SelectLabel>
                                                {roles.map((item) => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </ItemActions>
                            </Item>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose className="ml-auto" render={<Button>Done</Button>}></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


