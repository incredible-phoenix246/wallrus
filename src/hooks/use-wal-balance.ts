import { useQuery } from "@tanstack/react-query"
import { useCurrentWallet } from "@mysten/dapp-kit"
import { useNetwork } from "~/hooks/use-network"

// WAL token configuration
const WAL_TOKEN_CONFIGS = {
    testnet: {
        walTokenType: process.env.NEXT_PUBLIC_TESTNET_WAL_TOKEN_TYPE!,
    },
    mainnet: {
        walTokenType: process.env.NEXT_PUBLIC_MAINNET_WAL_TOKEN_TYPE!,
    },
} as const

export function useWALBalance() {
    const { currentWallet } = useCurrentWallet()
    const { suiClient, currentNetwork } = useNetwork()

    const walBalanceQuery = useQuery({
        queryKey: ["wal-balance", currentWallet?.accounts[0]?.address, currentNetwork],
        queryFn: async () => {
            if (!currentWallet?.accounts[0]?.address) {
                throw new Error("No wallet connected")
            }

            const config = WAL_TOKEN_CONFIGS[currentNetwork as keyof typeof WAL_TOKEN_CONFIGS]
            if (!config.walTokenType) {
                throw new Error(`WAL not supported on ${currentNetwork}`)
            }

            try {
                const walCoins = await suiClient.getCoins({
                    owner: currentWallet.accounts[0].address,
                    coinType: config.walTokenType,
                })

                const totalBalance = walCoins.data.reduce((sum, coin) => sum + BigInt(coin.balance), BigInt(0))

                return {
                    balance: totalBalance,
                    formattedBalance: (Number(totalBalance) / 1_000_000_000).toFixed(6),
                    coinCount: walCoins.data.length,
                    coins: walCoins.data,
                }
            } catch (error) {
                console.error("Error fetching WAL balance:", error)
                return {
                    balance: BigInt(0),
                    formattedBalance: "0.000000",
                    coinCount: 0,
                    coins: [],
                }
            }
        },
        enabled: !!currentWallet?.accounts[0]?.address && !!suiClient,
        staleTime: Number(process.env.NEXT_PUBLIC_BALANCE_STALE_TIME) || 30000,
        refetchInterval: Number(process.env.NEXT_PUBLIC_BALANCE_REFETCH_INTERVAL) || 60000,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    })

    return {
        walBalance: walBalanceQuery.data?.balance ?? BigInt(0),
        formattedWALBalance: walBalanceQuery.data?.formattedBalance ?? "0.000000",
        walCoinCount: walBalanceQuery.data?.coinCount ?? 0,
        walCoins: walBalanceQuery.data?.coins ?? [],
        isLoadingBalance: walBalanceQuery.isFetching,
        balanceError: walBalanceQuery.error,
        refetchBalance: walBalanceQuery.refetch,
    }
}
