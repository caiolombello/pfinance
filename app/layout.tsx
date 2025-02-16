import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "./components/sidebar"
import { MobileMenu } from "./components/mobile-menu"
import { Providers } from "./providers"
import { ModalProvider } from "./contexts/ModalContext"
import { AuthProvider } from "@/providers/auth"
// import { Toaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Controle Financeiro Pessoal",
  description: "Gerencie seus gastos de forma simples e eficiente",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          <Providers>
            <ModalProvider>
              <div className="min-h-full">
                <Sidebar />
                <MobileMenu />
                <main className="lg:pl-72">
                  <div className="px-4 py-10 sm:px-6 lg:px-8">{children}</div>
                </main>
              </div>
              {/* <Toaster richColors closeButton position="top-right" /> */}
            </ModalProvider>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}

