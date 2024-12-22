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
import { Label } from "@/components/ui/label"

interface FriendLinkFormData {
  name: string
  url: string
  logo?: string
  description?: string
  sort: number
  visible: boolean
}

interface FriendLinkFormProps {
  initialData?: FriendLinkFormData
  onSubmit: (data: FriendLinkFormData) => Promise<void>
  submitText?: string
  saving?: boolean
  onCancel: () => void
}

export function FriendLinkForm({
  initialData = {
    name: '',
    url: '',
    logo: '',
    description: '',
    sort: 0,
    visible: true
  },
  onSubmit,
  submitText = '保存',
  saving = false,
  onCancel
}: FriendLinkFormProps) {
  const [formData, setFormData] = React.useState<FriendLinkFormData>(initialData)

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
          <Label htmlFor="url">链接</Label>
          <Input
            id="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="logo">Logo</Label>
          <Input
            id="logo"
            value={formData.logo}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            placeholder="可选"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">描述</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="可选"
          />
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

        <div className="grid gap-2">
          <Label htmlFor="visible">状态</Label>
          <Select
            value={formData.visible ? "true" : "false"}
            onValueChange={(value) => setFormData({ ...formData, visible: value === "true" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">显示</SelectItem>
              <SelectItem value="false">隐藏</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          取消
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? '保存中...' : submitText}
        </Button>
      </div>
    </form>
  )
} 