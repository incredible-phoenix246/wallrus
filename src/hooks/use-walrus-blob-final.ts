import { useQuery } from "@tanstack/react-query"
import { useWalrusClient } from "~/hooks/use-walrus-client"
import { useWalrusNetworkData } from "~/hooks/use-walrus-network-data"
import { useWalrusTip } from "~/hooks/use-walrus-tip"
import { useTipDialogStore, type BlobInfo } from "./tip-dialog-store"

// Helper function to extract blob metadata and content info
function extractBlobInfo(blobId: string, blobData: Uint8Array, networkInfo?: {
    tipBalance?: number
    costPerEpoch?: number
    epochsLeft?: number
    currentEpoch?: number
    storageEndEpoch?: number
}): BlobInfo {
    // Convert Uint8Array to string to analyze content
    const textDecoder = new TextDecoder("utf-8", { fatal: false })
    let contentPreview = ""
    let contentType = "unknown"
    let isValidText = false

    try {
        // Try to decode as text
        const decodedText = textDecoder.decode(blobData.slice(0, 1000)) // First 1000 bytes for preview
        contentPreview = decodedText
        isValidText = true

        // Detect content type based on content
        if (decodedText.includes("<?xml") || decodedText.includes("<svg")) {
            contentType = "image/svg+xml"
        } else if (decodedText.includes("<!DOCTYPE html") || decodedText.includes("<html")) {
            contentType = "text/html"
        } else if (decodedText.startsWith("{") || decodedText.startsWith("[")) {
            try {
                JSON.parse(decodedText)
                contentType = "application/json"
            } catch {
                contentType = "text/plain"
            }
        } else if (/^[\x20-\x7E\s]*$/.test(decodedText)) {
            contentType = "text/plain"
        }
    } catch {
        // If text decoding fails, it's likely binary data
        isValidText = false

        // Check for common binary file signatures
        const header = Array.from(blobData.slice(0, 10))
        if (header[0] === 0xff && header[1] === 0xd8) {
            contentType = "image/jpeg"
        } else if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47) {
            contentType = "image/png"
        } else if (header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46) {
            contentType = "image/gif"
        } else if (header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46) {
            contentType = "application/pdf"
        } else {
            contentType = "application/octet-stream"
        }
    }

    return {
        id: blobId,
        status: "active",
        size: blobData.length,
        contentType,
        contentPreview: isValidText ? contentPreview.slice(0, 200) + (contentPreview.length > 200 ? "..." : "") : null,
        isTextContent: isValidText,
        // Use network info if available, otherwise fallback to defaults
        tipBalance: networkInfo?.tipBalance ?? 0,
        costPerEpoch: networkInfo?.costPerEpoch ?? Math.floor(blobData.length * 0.1), // Rough estimate based on size
        epochsLeft: networkInfo?.epochsLeft ?? 5,
        currentEpoch: networkInfo?.currentEpoch,
        storageEndEpoch: networkInfo?.storageEndEpoch,
    }
}

export function useWalrusBlob() {
    const walrusClient = useWalrusClient()
    const { fetchBlobNetworkInfo, fetchNetworkStatus } = useWalrusNetworkData()
    const { sendTip, isSendingTip, tipError, tipResult } = useWalrusTip()
    const { searchQuery, setIsSearching, setBlobInfo, setError } = useTipDialogStore()

    // Query for network status (current epoch, etc.)
    const networkStatusQuery = useQuery({
        queryKey: ["walrus-network-status"],
        queryFn: fetchNetworkStatus,
        staleTime: Number(process.env.NEXT_PUBLIC_NETWORK_STATUS_STALE_TIME) || 30000,
        refetchInterval: Number(process.env.NEXT_PUBLIC_NETWORK_STATUS_REFETCH_INTERVAL) || 60000,
    })

    const searchBlobQuery = useQuery({
        queryKey: ["walrus-blob-enhanced", searchQuery],
        queryFn: async () => {
            if (!searchQuery.trim()) return null

            console.log("Searching for blob:", searchQuery)

            try {
                setIsSearching(true)
                setError(null)

                // Fetch blob data first
                const blobData = await walrusClient.readBlob({ blobId: searchQuery })
                console.log("Blob data retrieved, size:", blobData.length)

                // Fetch network information in parallel
                let networkInfo: {
                    tipBalance?: number
                    costPerEpoch?: number
                    epochsLeft?: number
                    currentEpoch?: number
                    storageEndEpoch?: number
                } | null = null
                try {
                    networkInfo = await fetchBlobNetworkInfo(searchQuery, blobData.length)
                    console.log("Network info retrieved:", networkInfo)
                } catch (networkError) {
                    console.warn("Could not fetch network info, using defaults:", networkError)
                    networkInfo = null
                }

                // Extract useful information from the blob
                const blobInfo = extractBlobInfo(searchQuery, blobData, networkInfo)
                console.log("Extracted blob info:", blobInfo)

                setBlobInfo(blobInfo)
                return { blobInfo, blobData }
            } catch (error) {
                console.log("Error searching blob:", error)
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
        staleTime: Number(process.env.NEXT_PUBLIC_BLOB_SEARCH_STALE_TIME) || 30000,
    })

    // Helper function to download blob content
    const downloadBlob = (blobInfo: BlobInfo, blobData: Uint8Array) => {
        const blob = new Blob([new Uint8Array(blobData)], { type: blobInfo.contentType })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url

        // Generate a better filename based on content type
        let extension = ""
        if (blobInfo.contentType === "image/svg+xml") extension = ".svg"
        else if (blobInfo.contentType === "image/png") extension = ".png"
        else if (blobInfo.contentType === "image/jpeg") extension = ".jpg"
        else if (blobInfo.contentType === "application/json") extension = ".json"
        else if (blobInfo.contentType === "text/html") extension = ".html"
        else if (blobInfo.contentType === "text/plain") extension = ".txt"

        a.download = `walrus-blob-${blobInfo.id.slice(0, 8)}${extension}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    // Helper function to view blob content as text/image
    const viewBlob = (blobInfo: BlobInfo, blobData: Uint8Array) => {
        if (blobInfo.isTextContent) {
            const textDecoder = new TextDecoder("utf-8")
            const textContent = textDecoder.decode(blobData)
            return { type: "text", content: textContent }
        } else if (blobInfo.contentType.startsWith("image/")) {
            const blob = new Blob([new Uint8Array(blobData)], { type: blobInfo.contentType })
            const url = URL.createObjectURL(blob)
            return { type: "image", url }
        }
        return { type: "binary", size: blobData.length }
    }

    return {
        searchBlob: searchBlobQuery.refetch,
        sendTip: (amount: number) => {
            if (searchQuery) {
                sendTip({ blobId: searchQuery, amount })
            }
        },
        downloadBlob,
        viewBlob,
        result: searchBlobQuery.data,
        blobInfo: searchBlobQuery.data?.blobInfo,
        blobData: searchBlobQuery.data?.blobData,
        networkStatus: networkStatusQuery.data,
        isSearching: searchBlobQuery.isFetching,
        isSendingTip,
        isLoadingNetworkStatus: networkStatusQuery.isFetching,
        searchError: searchBlobQuery.error,
        tipError,
        tipResult,
        networkError: networkStatusQuery.error,
    }
}
