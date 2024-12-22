import * as React from "react"
import { ThemeProvider } from "./providers"
import './globals.css'
import { AuthProvider } from "@/contexts/auth-context"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 