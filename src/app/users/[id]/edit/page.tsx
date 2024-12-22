'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { userService } from '@/services/user'

interface EditUserPageProps {
  params: {
    id: string
  }
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [resetPasswordOpen, setResetPasswordOpen] = React.useState(false)
  const [newPassword, setNewPassword] = React.useState('')
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    isAdmin: false,
    isActive: true
  })

  // 加载用户信息
  const loadUser = React.useCallback(async () => {
    try {
      const data = await userService.getById(parseInt(params.id))
      setFormData({
        username: data.username,
        email: data.email,
        isAdmin: data.isAdmin,
        isActive: data.isActive
      })
    } catch (error) {
      toast.error('加载用户信息失败')
      router.push('/admin/users')
    }
  }, [params.id, router])

  React.useEffect(() => {
    loadUser()
  }, [loadUser])

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

    try {
      setLoading(true)
      await userService.update({
        id: parseInt(params.id),
        ...formData
      })
      toast.success('更新成功')
      router.push('/admin/users')
    } catch (error) {
      toast.error('更新失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理重置密码
  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      toast.error('请输入新密码')
      return
    }

    try {
      setLoading(true)
      await userService.adminResetPassword(parseInt(params.id), newPassword)
      toast.success('密码重置成功')
      setResetPasswordOpen(false)
      setNewPassword('')
    } catch (error) {
      toast.error('密码重置失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">编辑用户</h1>
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

          <div className="grid gap-2">
            <Label>密码</Label>
            <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline">重置密码</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>重置密码</DialogTitle>
                  <DialogDescription>
                    为用户 {formData.username} 设置新密码
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">新密码</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="请输入新密码"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setResetPasswordOpen(false)}
                  >
                    取消
                  </Button>
                  <Button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={loading}
                  >
                    {loading ? '重置中...' : '确认重置'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? '更新中...' : '更新'}
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