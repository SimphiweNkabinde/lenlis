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
import { ListActionButtonsEdit } from '../../_components/list-action-buttons'

type ListDataType = {
    id: string,
    name: string,
    hasAmounts?: boolean,
    hasCheckd?: boolean
}
export default function ListWrapper({ defaultListItems, listData, members, pendingInvites, userRole }: { defaultListItems: ListItem[], listData: ListDataType, members: { name: string, role: "owner" | "viewer" | "editor", avatarUrl: string }[], pendingInvites: { email: string, role: "editor" | "viewer" }[], userRole: "owner" | "editor" }) {

    const { initializeStore, id } = useListStore(state => state)
    useEffect(() => {
        initializeStore({ ...listData, listItems: defaultListItems, members: members, pendingInvites, userRole })
    }, [])

    return (
        <>
            <div className="border-b-1 pt-4 pb-2 px-5 flex flex-col gap-3 h-33 lg:px-[10%] lg:px-[15%]">
                <div className="lg:flex justify-between">
                    <ListName defaultName={listData.name} />
                    <div className="hidden lg:block"><ListActionButtonsEdit /></div>
                </div>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-3'>
                        <CollaboratorAvatars />
                        <div className="lg:hidden"><ShareButton /></div>
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
