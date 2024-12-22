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
import { Editor } from '@/components/editor'
import { articleService } from '@/services/article'

interface ArticleFormData {
  title: string
  content: string
  categoryId: number | ''
  isVisible: boolean
  sort: number
}

interface ArticleFormProps {
  initialData?: ArticleFormData
  onSubmit: (data: ArticleFormData) => Promise<void>
  submitText?: string
  saving?: boolean
  onCancel: () => void
}

export function ArticleForm({
  initialData = {
    title: '',
    content: '',
    categoryId: '',
    isVisible: true,
    sort: 0
  },
  onSubmit,
  submitText = '保存',
  saving = false,
  onCancel
}: ArticleFormProps) {
  const [formData, setFormData] = React.useState<ArticleFormData>(initialData)
  const [categories, setCategories] = React.useState<any[]>([])

  // 加载文章分类
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await articleService.getAllCategories()
        setCategories(data || [])
      } catch (error) {
        console.error('加载分类失败:', error)
      }
    }
    loadCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">标题</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">分类</Label>
          <Select
            value={formData.categoryId ? formData.categoryId.toString() : ''}
            onValueChange={(value) => setFormData({ ...formData, categoryId: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="content">内容</Label>
          <Editor
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
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

        <div className="flex items-center gap-2">
          <Switch
            id="isVisible"
            checked={formData.isVisible}
            onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
          />
          <Label htmlFor="isVisible">显示文章</Label>
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