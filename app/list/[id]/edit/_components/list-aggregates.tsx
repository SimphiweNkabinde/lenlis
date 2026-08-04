import { useListStore } from "../_stores/use-list-store"

export default function ListAggregates() {

    const { hasAmounts, hasChecks, listItems } = useListStore(state => state)
    const totalSum = useListStore(state => state.listItems).map(i => i.amount || 0).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const checkedSum = useListStore(state => state.listItems).filter(i => i.checked).map(i => i.amount || 0).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    return (
        <div className='text-sm flex justify-between text-current/50'>
            <div>{hasChecks ? `${listItems.filter(i => i.checked).length}/` : ""}{listItems.length} items</div>
            {hasAmounts && <div>{hasChecks ? `${checkedSum} / ` : ""}{totalSum.toLocaleString()} total</div>}
        </div>
    )
}
