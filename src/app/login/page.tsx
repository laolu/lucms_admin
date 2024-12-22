"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

type LoginType = "email" | "phone"

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [loginType, setLoginType] = React.useState<LoginType>("email")
  const [identifier, setIdentifier] = React.useState("")
  const [password, setPassword] = React.useState("")
  const { login } = useAuth()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirectUrl") || undefined

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      await login(identifier, password, redirectUrl)
      toast({
        title: "登录成功",
        description: "欢迎回来！",
      })
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "登录失败",
        description: error instanceof Error ? error.message : "账号或密码错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-[1000px] p-4 sm:p-6 lg:p-8">
        <div className="relative bg-card rounded-xl shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* 左侧品牌区域 */}
            <div className="hidden lg:block relative bg-primary">
              <div className="pattern-grid absolute inset-0 opacity-20" />
              <div className="relative h-full flex flex-col justify-center p-12">
                <div className="space-y-8">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground/10">
                    <Icons.logo className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-primary-foreground">
                      后台管理系统
                    </h1>
                    <p className="text-primary-foreground/80">
                      高效、安全的管理平台
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧登录表单 */}
            <div className="p-8 lg:p-12">
              <div className="mx-auto w-full max-w-sm space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    账号登录
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    请输入您的账号和密码
                  </p>
                </div>

                <Tabs defaultValue="email" className="w-full" onValueChange={(value) => setLoginType(value as LoginType)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email">邮箱登录</TabsTrigger>
                    <TabsTrigger value="phone">手机号登录</TabsTrigger>
                  </TabsList>
                  <div className="mt-8">
                    <form onSubmit={onSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="identifier">
                            {loginType === "email" ? "邮箱地址" : "手机号码"}
                          </Label>
                          <Input
                            id="identifier"
                            type={loginType === "email" ? "email" : "tel"}
                            placeholder={loginType === "email" ? "请输入邮箱地址" : "请输入手机号码"}
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            disabled={isLoading}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">密码</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="请输入密码"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="remember" />
                          <Label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            记住我
                          </Label>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            登录中...
                          </>
                        ) : (
                          "登 录"
                        )}
                      </Button>
                    </form>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 