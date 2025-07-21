import { create } from "zustand"

export type DialogType = "tip-successful" | "tip-shared-blob" | null

interface DialogData {
    transactionId?: string
    amountTipped?: string
    newTotalFunds?: string
    sharedBlobId?: string
}

interface DialogStore {
    isOpen: boolean
    type: DialogType
    data: DialogData
    isProcessing: boolean
    openDialog: (type: DialogType, data?: DialogData) => void
    closeDialog: () => void
    updateData: (data: Partial<DialogData>) => void
    setProcessing: (processing: boolean) => void
}

export const useDialogStore = create<DialogStore>((set) => ({
    isOpen: false,
    type: null,
    data: {},
    isProcessing: false,
    openDialog: (type, data = {}) => set({ isOpen: true, type, data }),
    closeDialog: () => set({ isOpen: false, type: null, data: {}, isProcessing: false }),
    updateData: (newData) =>
        set((state) => ({
            data: { ...state.data, ...newData },
        })),
    setProcessing: (processing) => set({ isProcessing: processing }),
}))
