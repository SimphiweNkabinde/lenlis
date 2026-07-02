"use client"
import ListItems from './list-items'
import ListItemInput from './list-item-input'
import { ListItem } from '@/lib/definitions'
import { useEffect } from 'react'
import { useListStore } from '../_stores/use-list-store'

export default function ListWrapper({ defaultList, listId }: { defaultList: ListItem[], listId: string }) {

    const setList = useListStore(state => state.setList)
    const setListId = useListStore(state => state.setListId)
    useEffect(() => {
        setListId(listId)
        setList(defaultList)
    }, [])

    return (
        <>
            <ListItems />
            <ListItemInput />
        </>
    )
}
