import { EyeIcon, GlobeIcon, UsersRoundIcon } from "lucide-react"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useListStore } from "../_stores/use-list-store"
import { useEffect, useState } from "react"

export function VisibilitySettingsDialog({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {

    const { visibility: defaultVisibility, updateListAttributes } = useListStore(state => state)
    const [visibility, setVisibility] = useState(defaultVisibility)

    useEffect(() => {
        setVisibility(defaultVisibility)
    }, [defaultVisibility])

    function handleSave() {
        updateListAttributes({ visibility })
        setIsOpen(false)
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="size-10 p-2">
                        <EyeIcon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Visibility Settings</AlertDialogTitle>
                    <AlertDialogDescription>
                        Choose who can see your list.
                    </AlertDialogDescription>
                </AlertDialogHeader>
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
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleSave()}>Save</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

