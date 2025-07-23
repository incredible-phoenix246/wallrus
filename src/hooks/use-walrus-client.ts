import { useNetwork } from "./use-network"

export function useWalrusClient() {
    return useNetwork((state) => state.walrusClient)
}
