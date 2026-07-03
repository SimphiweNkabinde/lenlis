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
    hasChecks?: boolean,
    hasAmounts?: boolean
}

type ListStoreActions = {
    initializeStore: (storeState: ListStoreState) => void
    addItem: (newItem: Omit<ListItem, "id">) => void
    removeItem: (itemId: string) => void
    updateItem: (id: string, updatedItem: { text?: string, checked?: boolean, amount?: number }) => void
    updateListAttributes: (listAttributes: { hasChecks?: boolean, hasAmounts?: boolean }) => void
}
type ListStore = ListStoreState & ListStoreActions
export const useListStore = create<ListStore>()((set, get) => ({
    listItems: [],
    id: "",
    initializeStore: (storeState) => set((state) => ({ ...storeState })),
    updateListAttributes: async (listAttributes) => {
        // OPTIMISTIC UPDATE
        // Instantly update UI state
        const previousAttributes = { hasAmounts: get().hasAmounts, hasChecks: get().hasChecks }
        set((state) => ({ ...listAttributes }))

        // Send update to database
        try {
            const response = await updateList(get().id, listAttributes)
            if (!response.success) throw new Error(JSON.stringify(response))

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
        // Instantly push the item into the UI state
        set((state) => ({ listItems: [...state.listItems, { ...newItem, id: tempId, isPending: true }] }))

        // Send item to database
        try {
            const response = await addListItem(get().id, newItem)
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

}))