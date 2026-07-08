"use client";
import { toast } from 'sonner';
import { useListStore } from '../_stores/use-list-store';
import { Share2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ShareButton() {

    const { id: listId, name: listName } = useListStore(state => state)

    async function handleShare() {
        const shareData = {
            title: listName,
            text: 'Lenlis - Shared Lists, Simplified',
            url: `${window.location.origin}/lists/${listId}`
        };

        if (navigator.share)
            // native share menu
            navigator.share(shareData).catch(err => { });
        else {
            navigator.clipboard.writeText(shareData.url)
                .then(() => toast.info("Link copied to clipboard"))
                .catch(() => { })
        }
    }
    return (
        <Button onClick={() => handleShare()} variant="secondary" className="size-8 text-muted-foreground rounded-full flex items-center justify-center">
            <Share2Icon className='size-4' />
        </Button>
    )
}
