"use client"
import ListItems from './list-items'
import ListItemInput from './list-item-input'
import { ListItem } from '@/lib/definitions'
import { useEffect } from 'react'
import { useListStore } from '../_stores/use-list-store'
import ListName from './list-name'

type ListDataType = {
    id: string,
    name: string,
    createdAt: string,
}
export default function ListWrapper({ defaultListItems, listData }: { defaultListItems: ListItem[], listData: ListDataType }) {

    const setList = useListStore(state => state.setListItems)
    const setListId = useListStore(state => state.setId)
    useEffect(() => {
        setListId(listData.id)
        setList(defaultListItems)
    }, [])

    return (
        <>
            <div className="border-b-1 py-4 px-5">
                <ListName defaultName={listData.name} listId={listData.id} />
            </div>
            <ListItems />
            <ListItemInput />
        </>
    )
}
