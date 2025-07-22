'use client'

import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from '@mysten/dapp-kit'
import { Toaster } from '~/components/ui/sonner'
import { getQueryClient } from '~/get-query-client'
import { getFullnodeUrl } from '@mysten/sui/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
})

export function Providers({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider>
          <NextThemesProvider {...props}>
            {children}
            <Toaster richColors duration={1000} position="bottom-right" />
            <ReactQueryDevtools
              initialIsOpen={false}
              position="left"
              buttonPosition="bottom-left"
            />
          </NextThemesProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  )
}
