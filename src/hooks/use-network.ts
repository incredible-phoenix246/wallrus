import { create } from "zustand"
import { persist } from "zustand/middleware"
import { WalrusClient } from "@mysten/walrus"
import { createNetworkConfig } from "@mysten/dapp-kit"
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client"

export type NetworkType = "testnet" | "mainnet" | "devnet"

interface WalletState {
    lastConnectedWallet: string | null
    autoConnectEnabled: boolean
    setLastConnectedWallet: (walletName: string | null) => void
    setAutoConnectEnabled: (enabled: boolean) => void
}

interface NetworkState extends WalletState {
    currentNetwork: NetworkType
    networkConfig: ReturnType<typeof createNetworkConfig>["networkConfig"]
    suiClient: SuiClient
    walrusClient: WalrusClient
    switchNetwork: (network: NetworkType) => void
}


const { networkConfig } = createNetworkConfig({
    testnet: { url: getFullnodeUrl("testnet") },
    mainnet: { url: getFullnodeUrl("mainnet") },
    devnet: { url: getFullnodeUrl("devnet") },
})

const createClientsForNetwork = (network: NetworkType) => {
    const suiClient = new SuiClient({
        url: getFullnodeUrl(network),
    })

    const walrusClient = new WalrusClient({
        network: network === "mainnet" ? "mainnet" : "testnet",
        suiClient,
        wasmUrl: process.env.NEXT_PUBLIC_WALRUS_WASM_URL!,
        ...(network === "testnet"
            ? {
                  packageConfig: {
                      systemObjectId: process.env.NEXT_PUBLIC_TESTNET_SYSTEM_OBJECT_ID!,
                      stakingPoolId: process.env.NEXT_PUBLIC_TESTNET_STAKING_POOL_ID!,
                  },
              }
            : {
                  packageConfig: {
                      systemObjectId: process.env.NEXT_PUBLIC_MAINNET_SYSTEM_OBJECT_ID!,
                      stakingPoolId: process.env.NEXT_PUBLIC_MAINNET_STAKING_POOL_ID!,
                  },
              }),
    })

    return { suiClient, walrusClient }
}

export const useNetwork = create<NetworkState>()(
    persist(
        (set,) => {
            const initialNetwork: NetworkType = (process.env.NEXT_PUBLIC_DEFAULT_NETWORK as NetworkType) || "mainnet"
            const { suiClient, walrusClient } = createClientsForNetwork(initialNetwork)

            return {
                currentNetwork: initialNetwork,
                networkConfig,
                suiClient,
                walrusClient,
                lastConnectedWallet: null,
                autoConnectEnabled: true,
                switchNetwork: (network: NetworkType) => {
                    const { suiClient: newSuiClient, walrusClient: newWalrusClient } = createClientsForNetwork(network)

                    set({
                        currentNetwork: network,
                        suiClient: newSuiClient,
                        walrusClient: newWalrusClient,
                    })
                },
                setLastConnectedWallet: (walletName: string | null) => {
                    set({ lastConnectedWallet: walletName })
                },
                setAutoConnectEnabled: (enabled: boolean) => {
                    set({ autoConnectEnabled: enabled })
                },
            }
        },
        {
            name: "network-wallet-storage",
            partialize: (state) => ({
                currentNetwork: state.currentNetwork,
                lastConnectedWallet: state.lastConnectedWallet,
                autoConnectEnabled: state.autoConnectEnabled,
            }),
        },
    ),
)
