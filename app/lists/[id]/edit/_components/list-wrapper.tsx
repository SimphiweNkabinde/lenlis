"use client"
import ListItems from './list-items'
import ListItemInput from './list-item-input'
import { ListItem } from '@/lib/definitions'
import { useEffect } from 'react'
import { useListStore } from '../_stores/use-list-store'
import ListName from './list-name'
import { CollaboratorAvatars } from './collaborator-avatars'
import ListOptionToggles from './list-option-toggles'
import ListAggregates from './list-aggregates'
import ShareButton from './share-button'
import VisibilityButton from './visibility-button'

type ListDataType = {
    id: string,
    name: string,
    hasAmounts?: boolean,
    hasCheckd?: boolean,
    visibility: "private" | "public"
}
export default function ListWrapper({ defaultListItems, listData }: { defaultListItems: ListItem[], listData: ListDataType }) {

    const initializeStore = useListStore(state => state.initializeStore)
    useEffect(() => {
        initializeStore({ ...listData, listItems: defaultListItems })
    }, [])

    return (
        <>
            <div className="border-b-1 pt-4 pb-2 px-5 flex flex-col gap-3 h-33">
                <ListName defaultName={listData.name} />
                <div className='flex justify-between'>
                    <div className='flex items-center gap-3'>
                        <CollaboratorAvatars />
                        <ShareButton />
                        <VisibilityButton />
                    </div>
                    <ListOptionToggles />
                </div>
                <ListAggregates />
            </div>
            <ListItems />
            <ListItemInput />
        </>
    )
}
