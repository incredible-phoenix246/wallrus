import { useNetwork } from "~/hooks/use-network"
import type { SuiClient } from "@mysten/sui/client"

interface WalrusNetworkConfig {
    systemObjectId: string
    stakingPoolId: string
    packageId: string
}

interface BlobNetworkInfo {
    tipBalance: number
    costPerEpoch: number
    epochsLeft: number
    storageEndEpoch: number
    currentEpoch: number
    blobSize: number
}

// Network configurations for different networks
const NETWORK_CONFIGS: Record<string, WalrusNetworkConfig> = {
    testnet: {
        systemObjectId: "0x98ebc47370603fe81d9e15491b2f1443d619d1dab720d586e429ed233e1255c1",
        stakingPoolId: "0x20266a17b4f1a216727f3eef5772f8d486a9e3b5e319af80a5b75809c035561d",
        packageId: "0x98ebc47370603fe81d9e15491b2f1443d619d1dab720d586e429ed233e1255c1",
    },
    mainnet: {
        systemObjectId: "",
        stakingPoolId: "",
        packageId: "",
    },
}

export function useWalrusNetworkData() {
    const { suiClient, currentNetwork } = useNetwork()

    const fetchBlobNetworkInfo = async (blobId: string, blobSize: number): Promise<BlobNetworkInfo> => {
        const config = NETWORK_CONFIGS[currentNetwork]
        if (!config.systemObjectId) {
            throw new Error(`Network configuration not available for ${currentNetwork}`)
        }

        try {
            const currentEpoch = await getCurrentEpoch(suiClient)
            const blobStorageInfo = await getBlobStorageInfo(suiClient, blobId, config)
            const epochsLeft = Math.max(0, blobStorageInfo.storageEndEpoch - currentEpoch)
            const tipBalance = await getTipBalance(suiClient, blobId, config)
            const costPerEpoch = await calculateCostPerEpoch(suiClient, blobSize, config)

            return {
                tipBalance,
                costPerEpoch,
                epochsLeft,
                storageEndEpoch: blobStorageInfo.storageEndEpoch,
                currentEpoch,
                blobSize,
            }
        } catch (error) {
            console.error("Error fetching blob network info:", error)
            throw error
        }
    }

    const fetchNetworkStatus = async () => {
        try {
            const [currentEpoch, systemState, networkMetrics] = await Promise.all([
                getCurrentEpoch(suiClient),
                suiClient.getLatestSuiSystemState(),
                suiClient
                    .getNetworkMetrics()
                    .catch(() => null),
            ])
            return {
                currentEpoch,
                systemState,
                networkMetrics,
            }
        } catch (error) {
            console.error("Error fetching network status:", error)
            throw error
        }
    }

    return {
        fetchBlobNetworkInfo,
        fetchNetworkStatus,
    }
}

async function getCurrentEpoch(suiClient: SuiClient): Promise<number> {
    try {
        const epochInfo = await suiClient.getCurrentEpoch()
        return Number.parseInt(epochInfo.epoch)
    } catch (error) {
        console.error("Error getting current epoch:", error)
        try {
            const systemState = await suiClient.getLatestSuiSystemState()
            return Number.parseInt(systemState.epoch)
        } catch (fallbackError) {
            console.error("Error getting epoch from system state:", fallbackError)
            throw fallbackError
        }
    }
}

async function getBlobStorageInfo(
    suiClient: SuiClient,
    blobId: string,
    config: WalrusNetworkConfig,
): Promise<{ storageEndEpoch: number }> {
    try {
        const objectsResponse = await suiClient.queryTransactionBlocks({
            filter: {
                InputObject: blobId,
            },
            options: {
                showInput: true,
                showEffects: true,
                showEvents: true,
            },
            limit: 10,
        })

        for (const tx of objectsResponse.data) {
            if (tx.events) {
                for (const event of tx.events) {
                    if (event.type.includes("walrus") && event.type.includes("storage")) {
                        const parsedJson = event.parsedJson as any
                        if (parsedJson && parsedJson.blob_id === blobId) {
                            return {
                                storageEndEpoch: Number.parseInt(parsedJson.storage_end_epoch || "0"),
                            }
                        }
                    }
                }
            }
        }
        const currentEpoch = await getCurrentEpoch(suiClient)
        return {
            storageEndEpoch: currentEpoch + 5,
        }
    } catch (error) {
        console.error("Error getting blob storage info:", error)
        const currentEpoch = await getCurrentEpoch(suiClient)
        return { storageEndEpoch: currentEpoch + 5 }
    }
}


async function getTipBalance(suiClient: SuiClient, blobId: string, config: WalrusNetworkConfig): Promise<number> {
    try {
        const tipEvents = await suiClient.queryEvents({
            query: {
                MoveEventType: `${config.packageId}::tip::TipEvent`,
            },
            limit: 50,
        })

        let totalTips = 0
        for (const event of tipEvents.data) {
            const parsedJson = event.parsedJson as any
            if (parsedJson && parsedJson.blob_id === blobId) {
                totalTips += Number.parseInt(parsedJson.amount || "0")
            }
        }

        return totalTips
    } catch (error) {
        console.error("Error getting tip balance:", error)
        return 0
    }
}

// Helper function to calculate cost per epoch
async function calculateCostPerEpoch(
    suiClient: SuiClient,
    blobSize: number,
    config: WalrusNetworkConfig,
): Promise<number> {
    try {
        // Get the system object to find pricing parameters
        const systemObject = await suiClient.getObject({
            id: config.systemObjectId,
            options: {
                showContent: true,
                showType: true,
            },
        })

        if (systemObject.data?.content && "fields" in systemObject.data.content) {
            const fields = systemObject.data.content.fields as any

            // Look for pricing fields (these field names are hypothetical and would need to be adjusted)
            const pricePerBytePerEpoch = Number.parseInt(fields.price_per_byte_per_epoch || "100")
            return pricePerBytePerEpoch * blobSize
        }

        // Fallback calculation if we can't get exact pricing
        // Estimate based on blob size (rough estimate: 0.1 MIST per byte per epoch)
        return Math.max(1000, Math.floor(blobSize * 0.1))
    } catch (error) {
        console.error("Error calculating cost per epoch:", error)
        // Fallback calculation
        return Math.max(1000, Math.floor(blobSize * 0.1))
    }
}

// Helper function to get protocol configuration
export async function getProtocolConfig(suiClient: SuiClient) {
    try {
        const protocolConfig = await suiClient.getProtocolConfig()
        return protocolConfig
    } catch (error) {
        console.error("Error getting protocol config:", error)
        return null
    }
}

// Helper function to get reference gas price
export async function getReferenceGasPrice(suiClient: SuiClient) {
    try {
        const gasPrice = await suiClient.getReferenceGasPrice()
        return gasPrice
    } catch (error) {
        console.error("Error getting reference gas price:", error)
        return BigInt(1000) // Default fallback
    }
}
