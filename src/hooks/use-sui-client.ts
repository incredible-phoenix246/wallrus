import { useNetwork } from "./use-network"

export function useSuiClient() {
    return useNetwork((state) => state.suiClient)
}
