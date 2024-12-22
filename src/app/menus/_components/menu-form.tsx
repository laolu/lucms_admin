'use client'

import * as React from 'react'
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
import { menuService, type Menu } from '@/services/menu'

interface MenuFormData {
  name: string
  icon?: string
  path?: string
  visible: boolean
  adminOnly: boolean
  sort: number
  parentId?: number
}

interface MenuFormProps {
  initialData?: MenuFormData
  onSubmit: (data: MenuFormData) => Promise<void>
  submitText?: string
  saving?: boolean
  onCancel: () => void
}

export function MenuForm({
  initialData = {
    name: '',
    icon: '',
    path: '',
    visible: true,
    adminOnly: false,
    sort: 0,
    parentId: undefined
  },
  onSubmit,
  submitText = '保存',
  saving = false,
  onCancel
}: MenuFormProps) {
  const [formData, setFormData] = React.useState<MenuFormData>(initialData)
  const [parentMenus, setParentMenus] = React.useState<Menu[]>([])
  const [loadingParentMenus, setLoadingParentMenus] = React.useState(true)

  // 加载父级菜单选项
  React.useEffect(() => {
    const loadParentMenus = async () => {
      try {
        setLoadingParentMenus(true)
        const data = await menuService.getAll({
          parentId: 0 // 只获取顶级菜单
        })
        setParentMenus(data.items)
      } catch (error) {
        console.error('加载父级菜单失败:', error)
      } finally {
        setLoadingParentMenus(false)
      }
    }

    loadParentMenus()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">名称</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="icon">图标</Label>
          <Input
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="path">路径</Label>
          <Input
            id="path"
            value={formData.path}
            onChange={(e) => setFormData({ ...formData, path: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="parentId">父级菜单</Label>
          <Select
            value={formData.parentId?.toString() || "0"}
            onValueChange={(value) => setFormData({ ...formData, parentId: value === "0" ? undefined : parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择父级菜单" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">顶级菜单</SelectItem>
              {parentMenus.map(menu => (
                <SelectItem key={menu.id} value={menu.id.toString()}>
                  {menu.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="sort">排序</Label>
          <Input
            id="sort"
            type="number"
            value={formData.sort}
            onChange={(e) => setFormData({ ...formData, sort: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Switch
              id="visible"
              checked={formData.visible}
              onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
            />
            <Label htmlFor="visible">显示</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="adminOnly"
              checked={formData.adminOnly}
              onCheckedChange={(checked) => setFormData({ ...formData, adminOnly: checked })}
            />
            <Label htmlFor="adminOnly">管理员菜单</Label>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? '保存中...' : submitText}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          取消
        </Button>
      </div>
    </form>
  )
} 