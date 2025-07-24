import { useMutation } from "@tanstack/react-query"
import { useCurrentWallet, useSignAndExecuteTransaction } from "@mysten/dapp-kit"
import { Transaction } from "@mysten/sui/transactions"
import { useNetwork } from "~/hooks/use-network"
import { getQueryClient } from "~/get-query-client"

interface SendTipParams {
    blobId: string
    amount: number // Amount in WAL (smallest unit)
    recipient?: string // Optional recipient address, defaults to blob owner
}

interface TipResult {
    success: boolean
    txHash: string
    tipAmount: number
    blobId: string
}

// WAL token configuration for different networks
const WAL_TOKEN_CONFIGS = {
    testnet: {
        packageId: process.env.NEXT_PUBLIC_TESTNET_PACKAGE_ID!,
        walTokenType: process.env.NEXT_PUBLIC_TESTNET_WAL_TOKEN_TYPE!,
        tipModuleName: process.env.NEXT_PUBLIC_TIP_MODULE_NAME!,
        tipFunctionName: process.env.NEXT_PUBLIC_TIP_FUNCTION_NAME!,
    },
    mainnet: {
        packageId: process.env.NEXT_PUBLIC_MAINNET_PACKAGE_ID!,
        walTokenType: process.env.NEXT_PUBLIC_MAINNET_WAL_TOKEN_TYPE!,
        tipModuleName: process.env.NEXT_PUBLIC_TIP_MODULE_NAME!,
        tipFunctionName: process.env.NEXT_PUBLIC_TIP_FUNCTION_NAME!,
    },
} as const

export function useWalrusTip() {
    const queryClient = getQueryClient()
    const { currentWallet } = useCurrentWallet()
    const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction()
    const { currentNetwork, suiClient } = useNetwork()

    const sendTipMutation = useMutation({
        mutationFn: async ({ blobId, amount, recipient }: SendTipParams): Promise<TipResult> => {
            if (!currentWallet) {
                throw new Error("Wallet not connected")
            }

            if (amount <= 0) {
                throw new Error("Tip amount must be greater than 0")
            }

            const config = WAL_TOKEN_CONFIGS[currentNetwork as keyof typeof WAL_TOKEN_CONFIGS]
            if (!config.packageId || !config.walTokenType) {
                throw new Error(`Tipping not supported on ${currentNetwork} network`)
            }

            try {
                // Create the transaction
                const tx = new Transaction()

                // Get WAL coins from the user's wallet
                const walCoins = await suiClient.getCoins({
                    owner: currentWallet.accounts[0].address,
                    coinType: config.walTokenType,
                })

                if (walCoins.data.length === 0) {
                    throw new Error("No WAL tokens found in wallet")
                }

                // Calculate total WAL balance
                const totalBalance = walCoins.data.reduce((sum, coin) => sum + BigInt(coin.balance), BigInt(0))

                if (totalBalance < BigInt(amount)) {
                    throw new Error(`Insufficient WAL balance. Required: ${amount}, Available: ${totalBalance}`)
                }

                // Merge WAL coins if needed and split the tip amount
                let tipCoin
                if (walCoins.data.length === 1 && BigInt(walCoins.data[0].balance) >= BigInt(amount)) {
                    // Use existing coin and split if needed
                    if (BigInt(walCoins.data[0].balance) === BigInt(amount)) {
                        tipCoin = tx.object(walCoins.data[0].coinObjectId)
                    } else {
                        ;[tipCoin] = tx.splitCoins(tx.object(walCoins.data[0].coinObjectId), [amount])
                    }
                } else {
                    // Merge multiple coins first
                    const primaryCoin = tx.object(walCoins.data[0].coinObjectId)
                    const coinsToMerge = walCoins.data.slice(1).map((coin) => tx.object(coin.coinObjectId))

                    if (coinsToMerge.length > 0) {
                        tx.mergeCoins(primaryCoin, coinsToMerge)
                    }
                    ;[tipCoin] = tx.splitCoins(primaryCoin, [amount])
                }

                // Get blob object information to determine recipient if not provided
                let tipRecipient = recipient
                if (!tipRecipient) {
                    try {
                        const blobObject = await suiClient.getObject({
                            id: blobId,
                            options: {
                                showOwner: true,
                                showContent: true,
                            },
                        })

                        if (
                            blobObject.data?.owner &&
                            typeof blobObject.data.owner === "object" &&
                            "AddressOwner" in blobObject.data.owner
                        ) {
                            tipRecipient = blobObject.data.owner.AddressOwner
                        } else {
                            throw new Error("Could not determine blob owner")
                        }
                    } catch (error) {
                        console.warn("Could not fetch blob owner, using sender as recipient:", error)
                        tipRecipient = currentWallet.accounts[0].address
                    }
                }

                // Call the tip function on the Walrus contract
                tx.moveCall({
                    target: `${config.packageId}::${config.tipModuleName}::${config.tipFunctionName}`,
                    arguments: [
                        tx.pure.string(blobId), // blob_id
                        tipCoin, // tip_coin (WAL)
                        tx.pure.address(tipRecipient), // recipient
                    ],
                    typeArguments: [config.walTokenType], // Specify WAL token type
                })

                // Set gas budget (paid in SUI)
                tx.setGasBudget(Number(process.env.NEXT_PUBLIC_DEFAULT_GAS_BUDGET) || 10_000_000)

                console.log("Executing WAL tip transaction:", {
                    blobId,
                    amount: `${amount} WAL`,
                    recipient: tipRecipient,
                    sender: currentWallet.accounts[0].address,
                })

                // Sign and execute the transaction
                const result = await signAndExecuteTransaction({
                    transaction: tx,
                    options: {
                        showEffects: true,
                        showEvents: true,
                        showObjectChanges: true,
                    },
                })

                if (result.effects?.status?.status !== "success") {
                    throw new Error(`Transaction failed: ${result.effects?.status?.error || "Unknown error"}`)
                }

                console.log("WAL tip transaction successful:", {
                    digest: result.digest,
                    events: result.events,
                    effects: result.effects,
                })

                return {
                    success: true,
                    txHash: result.digest,
                    tipAmount: amount,
                    blobId,
                }
            } catch (error) {
                console.error("Error sending WAL tip:", error)

                if (error instanceof Error) {
                    if (error.message.includes("WAL")) {
                        throw error // Re-throw WAL-specific errors as-is
                    }
                    if (error.message.includes("Insufficient")) {
                        throw new Error("Insufficient WAL balance to send tip")
                    }
                    if (error.message.includes("rejected")) {
                        throw new Error("Transaction was rejected by user")
                    }
                    if (error.message.includes("timeout")) {
                        throw new Error("Transaction timed out")
                    }
                }

                throw error
            }
        },

        onSuccess: (result) => {
            console.log("Tip sent successfully:", result)

            // Invalidate relevant queries to refresh data
            queryClient.invalidateQueries({
                queryKey: ["walrus-blob-enhanced"],
            })
            queryClient.invalidateQueries({
                queryKey: ["walrus-network-status"],
            })
            queryClient.invalidateQueries({
                queryKey: ["tip-history"],
            })
        },

        onError: (error) => {
            console.error("Tip mutation failed:", error)
        },
    })

    return {
        sendTip: sendTipMutation.mutate,
        sendTipAsync: sendTipMutation.mutateAsync,
        isSendingTip: sendTipMutation.isPending,
        tipError: sendTipMutation.error,
        tipResult: sendTipMutation.data,
        reset: sendTipMutation.reset,
    }
}
