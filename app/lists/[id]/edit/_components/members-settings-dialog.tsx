
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
import { Share2Icon, UsersRoundIcon } from "lucide-react"
import { useListStore } from "../_stores/use-list-store"
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserSearchCombobox } from "./user-search-combobox"
import { copyToClipboard, nativeShare } from "@/lib/utils"
import { removeInvite } from "@/lib/actions/remove-invite"
import { toast } from "sonner"

export function MemberSettingsDiaolog({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
    const { members, pendingInvites, id, removeInvite } = useListStore(state => state)

    async function handleShare() {
        nativeShare({ title: "Lenlis - invite link", url: `${window.location.origin}/lists/${id}/invites/accept` })
            .then(res => {
                if (!res.success) copyToClipboard(`${window.location.origin}/lists/${id}/invites/accept`)
            })
    }

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
                    <FieldGroup className="">
                        <Field>
                            <UserSearchCombobox />
                        </Field>
                    </FieldGroup>
                    <div>
                        <div className="text-muted-foreground">Who has access</div>
                        {members.map(member => (
                            <Item key={member.name} className="px-0">
                                <ItemMedia>
                                    <Avatar>
                                        <AvatarImage src={member.avatarUrl} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle>{member.name}</ItemTitle>
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
                        {pendingInvites.map(invitee => (
                            <Item key={invitee.email} className="px-0 flex-nowrap">
                                <ItemMedia>
                                    <Avatar>
                                        <AvatarFallback>{invitee.email.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle className="break-all text-muted-foreground">{invitee.email}</ItemTitle>
                                </ItemContent>
                                <ItemActions onClick={() => removeInvite(invitee.id)}>
                                    <Button variant="destructive">remove</Button>
                                </ItemActions>
                            </Item>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => handleShare()}><Share2Icon /> Share link</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


