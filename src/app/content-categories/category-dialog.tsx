'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { contentModelService } from '@/services/content-model'
import type { ContentModel } from '@/services/content-model'

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  initialData?: any
  parentId?: number | null
  categories: any[]
  onSubmit: (data: any) => void
}

export function CategoryDialog({
  open,
  onOpenChange,
  title,
  initialData,
  parentId = 0,
  categories,
  onSubmit,
}: CategoryDialogProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    sort: 0,
    isActive: true,
    parentId: 0,
    modelId: '',
    ...initialData,
  })

  const [models, setModels] = React.useState<ContentModel[]>([])

  // 加载内容模型列表
  const loadModels = React.useCallback(async () => {
    try {
      const data = await contentModelService.getAll()
      setModels(data)
    } catch (error) {
      console.error('加载内容模型失败:', error)
    }
  }, [])

  React.useEffect(() => {
    loadModels()
  }, [loadModels])

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        sort: initialData.sort,
        isActive: initialData.isActive,
        parentId: initialData.parentId || 0,
        modelId: initialData.modelId?.toString() || '',
      })
    } else {
      setFormData({
        name: '',
        description: '',
        sort: 0,
        isActive: true,
        parentId: parentId || 0,
        modelId: '',
      })
    }
  }, [initialData, parentId])

  const buildCategoryOptions = (items: any[], level = 0): React.ReactNode[] => {
    if (!Array.isArray(items)) {
      return [];
    }
    
    return items.flatMap((item) => {
      const prefix = '\u00A0'.repeat(level * 4)
      const options = [
        <SelectItem key={item.id} value={item.id.toString()}>
          {prefix + item.name}
        </SelectItem>
      ]
      
      if (item.children?.length) {
        options.push(...buildCategoryOptions(item.children, level + 1))
      }
      
      return options
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 确保所有字段都有正确的类型
    const submitData = {
      name: formData.name,
      description: formData.description,
      sort: Number(formData.sort),
      isActive: formData.isActive,
      parentId: Number(formData.parentId) || 0,  // 确保是数字
      modelId: formData.modelId ? Number(formData.modelId) : null
    };
    
    onSubmit(submitData);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              填写分类信息。完成后点击保存。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="parentId">父分类</Label>
              <Select
                value={formData.parentId?.toString() || "0"}
                onValueChange={(value) => 
                  setFormData({ 
                    ...formData, 
                    parentId: parseInt(value) || 0 
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择父分类（可选）" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">无父分类</SelectItem>
                  {buildCategoryOptions(categories.filter(c => c.id !== initialData?.id))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">分类名称</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="输入分类名称"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">描述</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="输入分类描述"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="modelId">内容模型</Label>
              <Select
                value={formData.modelId?.toString() || "none"}
                onValueChange={(value) => 
                  setFormData({ 
                    ...formData, 
                    modelId: value === "none" ? "" : value 
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择内容模型（可选）" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无内容模型</SelectItem>
                  {models.map(model => (
                    <SelectItem key={model.id} value={model.id.toString()}>
                      {model.name}
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
              />
            </div>

            <div className="flex justify-between items-center">
              <Label htmlFor="isActive">启用状态</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">保存</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 