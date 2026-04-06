import React from "react"
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ConvexClientProvider } from './ConvexClientProvider'
import { UserProvider } from '@/lib/user-context'
import { LanguageProvider } from '@/lib/language-context'
import { AIAssistant } from '@/components/ai-assistant'
import ThemeToggle from '@/components/theme-toggle'
import ThemeProviderWrapper from '@/components/theme-provider'
import { NavigationHeader } from '@/components/navigation-header'
import { RouteGuard } from '@/components/route-guard'
import Footer from '@/components/footer'
import { ClientScrollHandler } from '@/components/client-scroll-handler' 
import './globals.css'

export const metadata: Metadata = {
  title: 'HDP Edu - Korean Language & Career Platform',
  description: 'Learn Korean language and discover career opportunities in Korea with HDP Edu.',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ConvexClientProvider>
          <ThemeProviderWrapper>
            <LanguageProvider>
              <UserProvider>
                <RouteGuard>
                  <ClientScrollHandler />
                  <NavigationHeader />
                  <main>{children}</main>
                  <Footer />
                  <AIAssistant />
                  <ThemeToggle />
                </RouteGuard>
              </UserProvider>
            </LanguageProvider>
          </ThemeProviderWrapper>
        </ConvexClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
