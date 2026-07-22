import { EyeIcon, GlobeIcon } from "lucide-react"
import {
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
import { Field } from "@/components/ui/field"
import { UsersRoundIcon } from "lucide-react"
import { useListStore } from "../_stores/use-list-store"

export function VisibilitySettingsDialog({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {

    const { visibility, updateListAttributes } = useListStore(state => state)
    function setVisibility(value: "public" | "private") {
        updateListAttributes({ visibility: value })
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"> <EyeIcon className="size-4" /> Visibility Settings</DialogTitle>
                    <DialogDescription>
                        Choose who can see your list.
                    </DialogDescription>
                </DialogHeader>
                <RadioGroup onValueChange={(value) => setVisibility(value)} value={visibility} className="max-w-sm">
                    <FieldLabel htmlFor="public-visibility" className="!rounded-lg">
                        <Field orientation="horizontal" className="!items-center !p-3">
                            <FieldContent>
                                <FieldTitle><GlobeIcon className="size-4" />Public</FieldTitle>
                                <FieldDescription className="text-xs">
                                    Anyone can see this list
                                </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value="public" id="public-visibility" />
                        </Field>
                    </FieldLabel>
                    <FieldLabel htmlFor="private-visibility" className="!rounded-lg">
                        <Field orientation="horizontal" className="!items-center !p-3">
                            <FieldContent>
                                <FieldTitle><UsersRoundIcon className="size-4" />Private</FieldTitle>
                                <FieldDescription className="text-xs">Visible only to members of this list</FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value="private" id="private-visibility" />
                        </Field>
                    </FieldLabel>
                </RadioGroup>
                <DialogFooter>
                    <DialogClose className="ml-auto" render={<Button>Done</Button>}></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


