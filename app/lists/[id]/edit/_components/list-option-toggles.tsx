import { Button } from '@/components/ui/button'
import { CheckIcon } from 'lucide-react'
import { useListStore } from '../_stores/use-list-store'

export default function ListOptionToggles() {

    const { hasAmounts, hasChecks, updateListAttributes } = useListStore(state => state)

    return (
        <div className='flex items-center gap-2'>
            <Button
                onClick={() => updateListAttributes({ hasChecks: !hasChecks })}
                variant={hasChecks ? "default" : "outline"}
                className="rounded size-6">
                <CheckIcon />
            </Button>
            <Button
                onClick={() => updateListAttributes({ hasAmounts: !hasAmounts })}
                variant={hasAmounts ? "default" : "outline"}
                className="rounded size-6 text-[9px]">
                1.23
            </Button>
        </div>
    )
}
