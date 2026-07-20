import { addListItem } from "@/lib/actions/add-list-item";
import { deleteListItem } from "@/lib/actions/delete-list-item";
import { updateListItem } from "@/lib/actions/update-list-item";
import { updateList } from "@/lib/actions/update-list-name";
import { ListItem } from "@/lib/definitions";
import { toast } from "sonner";
import { create } from "zustand";

export type ListItemState = ListItem & { isPending?: boolean }
type ListStoreState = {
    listItems: ListItemState[],
    id: string,
    name: string,
    hasChecks?: boolean,
    hasAmounts?: boolean,
    visibility: "public" | "private",
    members: { username: string, avatarUrl: string, role: "owner" | "editor" | "viewer" }[]
}
type ReorderedListData = { newList: ListItemState[], movedItemId?: string }
type ListStoreActions = {
    initializeStore: (storeState: ListStoreState) => void
    setName: (name: string) => void
    addItem: (newItem: Omit<ListItem, "id" | "position">) => void
    removeItem: (itemId: string) => void
    updateItem: (id: string, updatedItem: { text?: string, checked?: boolean, amount?: number }) => void
    updateListAttributes: (listAttributes: { hasChecks?: boolean, hasAmounts?: boolean, visibility?: "public" | "private" }) => void
    setListItems: (setStateCb: (listItems: ListItemState[]) => ReorderedListData) => void
}
type ListStore = ListStoreState & ListStoreActions
export const useListStore = create<ListStore>()((set, get) => ({
    listItems: [],
    id: "",
    name: "",
    visibility: "public",
    members: [],
    initializeStore: (storeState) => set((state) => ({ ...storeState })),
    setName: (name) => set(() => ({ name })),
    updateListAttributes: async (listAttributes) => {
        // OPTIMISTIC UPDATE
        // Instantly update UI state
        const previousAttributes = { hasAmounts: get().hasAmounts, hasChecks: get().hasChecks, visibility: get().visibility }
        set((state) => ({ ...listAttributes }))

        // Send update to database
        try {
            const response = await updateList(get().id, listAttributes)
            if (!response.success) throw new Error(JSON.stringify(response))

            if (Object.hasOwn(listAttributes, "visibility")) toast.success("Visibility changes saved")

        } catch (error) {
            console.log(error)
            toast.error("Could'nt sync with database", { description: "Something went wrong" })
            // Rollback if the database write fails
            set((state) => ({ ...previousAttributes }))
        }
    },
    addItem: async (newItem) => {
        // OPTIMISTIC UPDATE
        // Create a unique temp ID for the UI
        const tempId = `temp-${Date.now()}`

        // SET POSITION
        const list = get().listItems
        let position = calculateItemNewPosition(null, null)
        if (list.length > 0) {
            const maxPosition = Math.max(...list.map(i => i.position || 0))
            position = calculateItemNewPosition(maxPosition, null)
        }
        // Instantly push the item into the UI state
        set((state) => ({ listItems: [...state.listItems, { ...newItem, id: tempId, isPending: true, position }] }))

        // Send item to database
        try {
            const response = await addListItem(get().id, { ...newItem, position })
            if (!response.success) throw new Error(JSON.stringify(response))

            set(state => (
                { listItems: state.listItems.map(item => item.id == tempId ? { ...item, id: response.data.id, isPending: false } : item) }
            ))
        } catch (error) {
            console.log(error)
            toast.error("Could'nt sync with database", { description: "Something went wrong" })
            // Rollback: Remove the item from the UI if the database write fails
            set(state => ({ listItems: state.listItems.filter(item => item.id !== tempId) }))
        }
    },
    updateItem: async (id, itemUpdates) => {
        // OPTIMISTIC UPDATE
        // Instantly update UI state
        const previousItemState = get().listItems.find(i => i.id == id)!
        set((state) => ({ listItems: state.listItems.map((item) => item.id == id ? { ...item, ...itemUpdates, isPending: true } : item) }))

        // Send update to database
        try {
            const response = await updateListItem(get().id, id, itemUpdates)
            if (!response.success) throw new Error(JSON.stringify(response))

        } catch (error) {
            console.log(error)
            toast.error("Could'nt sync with database", { description: "Something went wrong" })
            // Rollback if the database write fails
            set((state) => ({ listItems: state.listItems.map((item) => item.id == id ? previousItemState : item) }))
        } finally {
            // revert pending satus
            set((state) => ({ listItems: state.listItems.map((item) => item.id == id ? { ...item, isPending: false } : item) }))
        }
    },
    removeItem: async (id) => {
        // OPTIMISTIC UPDATE

        const itemToBeDeleted = get().listItems.find(i => i.id == id)!
        const itemPreviousIndex = get().listItems.findIndex(i => i.id == id)!
        // Instantly remove item from the UI state
        set((state) => ({ listItems: state.listItems.filter(item => item.id !== id) }))

        // remove item from database
        try {
            const response = await deleteListItem(get().id, id)
            if (!response.success) throw new Error(JSON.stringify(response))

        } catch (error) {
            console.log(error)
            toast.error("Could'nt sync with database", { description: "Something went wrong" })
            // Rollback: replace the item to UI if the database write fails
            set(state => ({ listItems: state.listItems.toSpliced(itemPreviousIndex, 0, itemToBeDeleted) }))
        }
    },
    setListItems: async (setStateCb) => {
        const previousListItemsState = get().listItems
        const { newList, movedItemId } = setStateCb(get().listItems)
        set((state) => ({ listItems: newList.map((item) => item.id === movedItemId ? { ...item, isPending: true } : item) }))

        // update list item order in db
        if (movedItemId) {
            const newIndex = newList.findIndex(items => items.id == movedItemId)
            const prevPosition = newList[newIndex - 1] ? newList[newIndex - 1].position : null
            const nextPosition = newList[newIndex + 1] ? newList[newIndex + 1].position : null
            const position = calculateItemNewPosition(prevPosition, nextPosition)

            try {
                const response = await updateListItem(get().id, movedItemId, { position })
                if (!response.success) throw new Error(JSON.stringify(response))
            } catch (error) {
                console.log(error)
                toast.error("Could'nt sync with database", { description: "Something went wrong" })
                // Rollback if the database write fails
                set((state) => ({ listItems: previousListItemsState }))

            } finally {
                // revert pending satus
                set((state) => ({ listItems: state.listItems.map((item) => item.id == movedItemId ? { ...item, isPending: false } : item) }))
            }
        }
    }
}))

export function calculateItemNewPosition(prevPosition: number | null, nextPosition: number | null): number {
    const prev = prevPosition ? parseFloat(`${prevPosition}`) : null;
    const next = nextPosition ? parseFloat(`${nextPosition}`) : null;

    // Moving to the absolute top (no item above)
    if (prev === null && next !== null) {
        return next / 2;
    }
    // Moving to the absolute bottom (no item below)
    if (prev !== null && next === null) {
        // next thousand
        return Math.floor(prev / 1000 + 1) * 1000;
    }
    // Moving between two items
    if (prev !== null && next !== null) {
        return (prev + next) / 2;
    }
    // first item item on the list
    return 1000;
}