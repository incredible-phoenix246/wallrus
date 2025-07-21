import { create } from "zustand"
import { persist } from "zustand/middleware"

export type DialogType = "tip-successful" | "tip-shared-blob" | "extend-blob" | "blob-management" | null

interface DialogData {
    transactionId?: string
    amountTipped?: string
    newTotalFunds?: string
    sharedBlobId?: string
    epochs?: string
    blobStatus?: any
    currentStep?: string
    tipAmount?: string
    extendEpochs?: string
    customTipAmount?: string
    customExtendEpochs?: string
}

interface WalletState {
    isConnected: boolean
    address: string | null
    isConnecting: boolean
}

interface BubbleState {
    show: boolean
    message: string
}

interface DialogStore {
    isOpen: boolean
    type: DialogType
    data: DialogData
    isProcessing: boolean
    wallet: WalletState
    bubble: BubbleState

    openDialog: (type: DialogType, data?: DialogData) => void
    closeDialog: () => void
    updateData: (data: Partial<DialogData>) => void
    setProcessing: (processing: boolean) => void
    connectWallet: () => Promise<void>
    disconnectWallet: () => void
    showBubble: (message: string) => void
    hideBubble: () => void
    setBlobStatus: (status: any) => void
    setCurrentStep: (step: string) => void
    resetBlobData: () => void
}

export const useDialogStore = create<DialogStore>()(
    persist(
        (set, get) => ({
            isOpen: false,
            type: null,
            data: {},
            isProcessing: false,
            wallet: {
                isConnected: false,
                address: null,
                isConnecting: false,
            },
            bubble: {
                show: false,
                message: "",
            },

            openDialog: (type, data = {}) => set({ isOpen: true, type, data }),
            closeDialog: () => set({ isOpen: false, type: null, data: {}, isProcessing: false }),
            updateData: (newData) =>
                set((state) => ({
                    data: { ...state.data, ...newData },
                })),
            setProcessing: (processing) => set({ isProcessing: processing }),

            connectWallet: async () => {
                set((state) => ({
                    wallet: { ...state.wallet, isConnecting: true },
                }))

                // Simulate wallet connection delay
                await new Promise((resolve) => setTimeout(resolve, 2000))

                // Simulate successful connection with a mock address
                const mockAddress = "0x5ce5f4e8c8b2a1d3e4f5a6b7c8d9e0f1a2b3c4d5e638"

                set((state) => ({
                    wallet: {
                        isConnected: true,
                        address: mockAddress,
                        isConnecting: false,
                    },
                }))
            },

            disconnectWallet: () => {
                set((state) => ({
                    wallet: {
                        isConnected: false,
                        address: null,
                        isConnecting: false,
                    },
                }))
            },
            showBubble: (message) => set({ bubble: { show: true, message } }),
            hideBubble: () => set({ bubble: { show: false, message: "" } }),
            setBlobStatus: (status) => set((state) => ({ data: { ...state.data, blobStatus: status } })),
            setCurrentStep: (step) => set((state) => ({ data: { ...state.data, currentStep: step } })),
            resetBlobData: () =>
                set((state) => ({
                    data: {
                        ...state.data,
                        blobStatus: null,
                        currentStep: "input",
                        tipAmount: "",
                        extendEpochs: "",
                        customTipAmount: "",
                        customExtendEpochs: "",
                    },
                })),
        }),
        {
            name: "dialog-store", // unique name for localStorage key
            partialize: (state) => ({
                wallet: state.wallet,
            }), // only persist wallet state
            skipHydration: false,
        },
    ),
)
