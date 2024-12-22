'use client'

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { userService } from "@/services/user"

interface User {
  id: string
  name: string
  // 添加其他需要的用户属性
}

interface AuthContextType {
  user: User | null
  login: (identifier: string, password: string, redirectUrl?: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // 初始化时从 localStorage 恢复用户状态和 token
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)
    
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        // 如果解析失败，清除存储的数据
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem(TOKEN_KEY)
      }
    }
  }, [])

  const login = async (identifier: string, password: string, redirectUrl?: string) => {
    setIsLoading(true)
    try {
      const data = await userService.login(identifier, password)
      
      // 保存 token 和用户信息到 localStorage
      if (data.token && data.user) {
        localStorage.setItem(TOKEN_KEY, data.token)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
        setUser(data.user)
      }

      // 登录成功后重定向
      router.push(redirectUrl || '/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await userService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // 无论登出 API 是否成功，都清除本地状态
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      setUser(null)
      setIsLoading(false)
      router.push('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

// 获取 token 的辅助函数
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 