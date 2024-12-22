'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { userService } from '@/services/user'

export default function CreateUserPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    password: '',
    isAdmin: false,
    isActive: true
  })

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.username.trim()) {
      toast.error('请输入用户名')
      return
    }
    if (!formData.email.trim()) {
      toast.error('请输入邮箱')
      return
    }
    if (!formData.password.trim()) {
      toast.error('请输入密码')
      return
    }

    try {
      setLoading(true)
      await userService.create(formData)
      toast.success('创建成功')
      router.push('/admin/users')
    } catch (error) {
      toast.error('创建失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">创建用户</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="请输入用户名"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="请输入邮箱"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="请输入密码"
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="isAdmin"
              checked={formData.isAdmin}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAdmin: checked }))}
            />
            <Label htmlFor="isAdmin">管理员账号</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">启用账号</Label>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? '创建中...' : '创建'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/users')}
          >
            取消
          </Button>
        </div>
      </form>
    </div>
  )
} 