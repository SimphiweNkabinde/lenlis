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
                className="rounded size-6 lg:rounded-lg lg:w-auto lg:h-auto lg:py-1">
                <CheckIcon /> <span className="hidden lg:block text-xs">Checkboxes</span>
            </Button>
            <Button
                onClick={() => updateListAttributes({ hasAmounts: !hasAmounts })}
                variant={hasAmounts ? "default" : "outline"}
                className="rounded size-6 lg:rounded-lg lg:w-auto lg:h-auto lg:py-1">
                <span className="text-[9px]">1.23</span> <span className="hidden lg:block text-xs">Amounts</span>
            </Button>
        </div>
    )
}
