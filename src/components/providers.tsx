"use client"

import * as React from "react"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

interface ProvidersProps {
  children: React.ReactNode
}

const ClientProviders = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="bg-background">
        {children}
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

const Providers = ({ children }: ProvidersProps) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <AuthProvider>
      {mounted ? (
        <ClientProviders>{children}</ClientProviders>
      ) : (
        <div className="bg-background">{children}</div>
      )}
    </AuthProvider>
  )
}

export { Providers } 