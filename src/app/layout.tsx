import './globals.css'
import { cn, inDevelopment } from '~/lib/utils'
import type { Metadata } from 'next'
import { McLaren } from 'next/font/google'
import { Header } from '~/components/header'
import { Footer } from '~/components/footer'
import { TipDialogs } from '~/components/tip-dialogs'
import { Providers } from './provider'
import { NetworkSwitcher } from '~/components/network-switcher'
import { FloatingNetworkIndicator } from '~/components/floating-network-indicator'
import { TipDialog } from '~/components/tip-dialog'

const mcLaren = McLaren({
  variable: '--font-mclaren',
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Extend — Permanently Preserve What Matters',
  description:
    'Extend is a decentralized platform that empowers communities, researchers, developers, and creators to preserve digital content forever. From abandoned crypto projects to endangered cultural archives, Extend ensures nothing important is lost.',
  openGraph: {
    title: 'Extend — Permanently Preserve What Matters',
    description:
      'A decentralized preservation protocol for digital assets, Extend helps communities fund and maintain permanent storage of critical files—from academic research to open-source software and cultural records.',
    // url: 'https://yourdomain.com',
    siteName: 'Extend',
    // images: [
    //   {
    //     url: 'https://yourdomain.com/og-image.png',
    //     width: 1200,
    //     height: 630,
    //     alt: 'Extend App',
    //   },
    // ],
    type: 'website',
  },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'Extend — Permanently Preserve What Matters',
  //   description:
  //     'Preserve critical digital assets—decentralized, community-funded, and censorship-resistant. Extend gives you the power to keep knowledge, tools, and culture alive.',
  //   images: ['https://yourdomain.com/og-image.png'],
  // },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(mcLaren.variable, 'antialiased')}>
        <Providers
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange={false}
        >
          <main className="relative gap-2 bg-[#F2F2F2] font-sans">
            {/* {inDevelopment && } */}
            <NetworkSwitcher />
            <Header />
            {children}
            <FloatingNetworkIndicator />
            <TipDialog />
            <TipDialogs />
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  )
}
