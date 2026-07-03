import { addListItem } from "@/lib/actions/add-list-item";
import { ListItem } from "@/lib/definitions";
import { toast } from "sonner";
import { create } from "zustand";

export type ListItemState = ListItem & { isPending?: boolean }
type ListStoreState = {
    listItems: ListItemState[],
    listId: string
}

type ListStoreActions = {
    setListItems: (newList: ListStoreState['listItems']) => void
    setListId: (id: ListStoreState['listId']) => void
    addItemOptimistically: (newItem: Omit<ListItem, "id">) => void
    removeItem: (itemId: string) => void
    updateItem: (updatedItem: ListItem) => void
}
type ListStore = ListStoreState & ListStoreActions
export const useListStore = create<ListStore>()((set, get) => ({
    listItems: [],
    listId: "",
    setListId: (id) => set(() => ({ listId: id })),
    setListItems: (newList) => set(() => ({ listItems: newList })),
    addItemOptimistically: async (newItem) => {
        // Create a unique temp ID for the UI
        const tempId = `temp-${Date.now()}`
        // Instantly push the item into the UI state
        set((state) => ({ listItems: [...state.listItems, { ...newItem, id: tempId, isPending: true }] }))

        // Send item to database
        try {
            const response = await addListItem(get().listId, newItem)
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
    removeItem: (itemId) => set((state) => ({ listItems: state.listItems.filter(item => item.id !== itemId) })),
    updateItem: (updatedItem) => set((state) => ({ listItems: state.listItems.map((item) => item.id == updatedItem.id ? updatedItem : item) }))
}))