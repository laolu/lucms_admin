"use client"

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    setMounted(true)
    try {
      const savedTheme = window?.localStorage?.getItem('theme') as Theme
      if (savedTheme) {
        setTheme(savedTheme)
      } else {
        const prefersDark = window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches
        setTheme(prefersDark ? 'dark' : 'light')
      }
    } catch (e) {
      console.error('Failed to get theme preference:', e)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    try {
      if (mounted && window?.localStorage) {
        window.localStorage.setItem('theme', newTheme)
      }
    } catch (e) {
      console.error('Failed to save theme preference:', e)
    }
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 