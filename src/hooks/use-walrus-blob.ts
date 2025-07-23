import { useQuery, useMutation, } from "@tanstack/react-query"
import { useWalrusClient } from "~/hooks/use-walrus-client"
import { useTipDialogStore, type BlobInfo } from "./tip-dialog-store"
import { useCurrentWallet } from "@mysten/dapp-kit"
import { getQueryClient } from "~/get-query-client"

export function useWalrusBlob() {
    const queryClient = getQueryClient()
    const walrusClient = useWalrusClient()
    const { currentWallet } = useCurrentWallet()
    const { searchQuery, setIsSearching, setBlobInfo, setError } = useTipDialogStore()


    const searchBlobQuery = useQuery({
        queryKey: ["walrus-blob", searchQuery],
        queryFn: async () => {
            if (!searchQuery.trim()) return null

            try {
                const blob = await walrusClient.readBlob({ blobId: searchQuery });
                console.log("Blob found:", blob);
                setIsSearching(true)
                setError(null)
                const mockBlobInfo: BlobInfo = {
                    id: searchQuery,
                    status: Math.random() > 0.5 ? "active" : "not_active",
                    tipBalance: Math.floor(Math.random() * 1000000),
                    costPerEpoch: Math.floor(Math.random() * 100000),
                    epochsLeft: Math.floor(Math.random() * 10),
                }

                setBlobInfo(mockBlobInfo)
                return mockBlobInfo
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Failed to search blob"
                setError(errorMessage)
                setBlobInfo(null)
                throw error
            } finally {
                setIsSearching(false)
            }
        },
        enabled: !!searchQuery.trim() && searchQuery.length > 10,
        retry: 1,
        staleTime: 0
    })


    const sendTipMutation = useMutation({
        mutationFn: async ({ blobId, amount }: { blobId: string; amount: number }) => {
            if (!currentWallet) {
                throw new Error("Wallet not connected")
            }

            // TODO: Implement actual Walrus SDK tip functionality
            // This would involve creating a transaction to tip the blob
            console.log(`Sending tip of ${amount} to blob ${blobId}`)

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000))

            return { success: true, txHash: "0x123..." }
        },
        onSuccess: () => {
            // Invalidate blob query to refresh data
            queryClient.invalidateQueries({ queryKey: ["walrus-blob", searchQuery] })
        },
    })

    return {
        searchBlob: searchBlobQuery.refetch,
        sendTip: sendTipMutation.mutate,
        isSearching: searchBlobQuery.isFetching,
        isSendingTip: sendTipMutation.isPending,
        searchError: searchBlobQuery.error,
        tipError: sendTipMutation.error,
    }
}
