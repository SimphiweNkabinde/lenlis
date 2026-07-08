"use client";
import { EyeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { VisibilitySettingsDialog } from './visibility-settings-dialog';

export default function VisibilityButton() {

    const [isVisibilityDialogOpen, setIsVisibilityDialogOpen] = useState<boolean>(false)

    return (
        <>
            <Button onClick={() => setIsVisibilityDialogOpen(true)} variant="secondary" className="size-8 text-muted-foreground rounded-full flex items-center justify-center">
                <EyeIcon className='size-4' />
            </Button>
            <VisibilitySettingsDialog isOpen={isVisibilityDialogOpen} setIsOpen={(isOpen) => setIsVisibilityDialogOpen(isOpen)} />
        </>
    )
}
