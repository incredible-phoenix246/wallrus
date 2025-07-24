import { create } from "zustand"

export interface BlobInfo {
    id: string
    status: "active" | "not_active" | "loading"
    size: number
    contentType: string
    contentPreview: string | null
    isTextContent: boolean
    tipBalance: number
    costPerEpoch: number
    epochsLeft: number
}

interface TipDialogState {
    isOpen: boolean
    searchQuery: string
    blobInfo: BlobInfo | null
    customTipAmount: string
    selectedPresetTip: number | null
    isSearching: boolean
    isSubmitting: boolean
    error: string | null

    // Actions
    openDialog: () => void
    closeDialog: () => void
    setSearchQuery: (query: string) => void
    setBlobInfo: (info: BlobInfo | null) => void
    setCustomTipAmount: (amount: string) => void
    setSelectedPresetTip: (amount: number | null) => void
    setIsSearching: (loading: boolean) => void
    setIsSubmitting: (submitting: boolean) => void
    setError: (error: string | null) => void
    resetForm: () => void
}

export const useTipDialogStore = create<TipDialogState>((set) => ({
    isOpen: false,
    searchQuery: "",
    blobInfo: null,
    customTipAmount: "",
    selectedPresetTip: null,
    isSearching: false,
    isSubmitting: false,
    error: null,

    openDialog: () => set({ isOpen: true }),
    closeDialog: () => set({ isOpen: false }),
    setSearchQuery: (query: string) => set({ searchQuery: query }),
    setBlobInfo: (info: BlobInfo | null) => set({ blobInfo: info }),
    setCustomTipAmount: (amount: string) =>
        set({
            customTipAmount: amount,
            selectedPresetTip: null, // Clear preset when custom amount is entered
        }),
    setSelectedPresetTip: (amount: number | null) =>
        set({
            selectedPresetTip: amount,
            customTipAmount: amount ? amount.toString() : "", // Update custom amount field
        }),
    setIsSearching: (loading: boolean) => set({ isSearching: loading }),
    setIsSubmitting: (submitting: boolean) => set({ isSubmitting: submitting }),
    setError: (error: string | null) => set({ error }),
    resetForm: () =>
        set({
            searchQuery: "",
            blobInfo: null,
            customTipAmount: "",
            selectedPresetTip: null,
            error: null,
            isSearching: false,
            isSubmitting: false,
        }),
}))
