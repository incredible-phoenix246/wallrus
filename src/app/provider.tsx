'use client'

import { useNetwork } from '~/hooks/use-network'
import { Toaster } from '~/components/ui/sonner'
import { getQueryClient } from '~/get-query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'

export function Providers({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const queryClient = getQueryClient()
  const { networkConfig, currentNetwork } = useNetwork()

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        networks={networkConfig}
        defaultNetwork={currentNetwork}
      >
        <WalletProvider>
          <NextThemesProvider {...props}>
            {children}
            <Toaster richColors duration={1000} position="bottom-right" />
            <ReactQueryDevtools
              initialIsOpen={false}
              position="left"
              buttonPosition="top-left"
            />
          </NextThemesProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  )
}
