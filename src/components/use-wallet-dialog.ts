"use client"

import { create } from "zustand"

interface WalletDialogState {
    isConnectDialogOpen: boolean
    openConnectDialog: () => void
    closeConnectDialog: () => void
}

export const useWalletDialog = create<WalletDialogState>((set) => ({
    isConnectDialogOpen: false,
    openConnectDialog: () => set({ isConnectDialogOpen: true }),
    closeConnectDialog: () => set({ isConnectDialogOpen: false }),
}))
