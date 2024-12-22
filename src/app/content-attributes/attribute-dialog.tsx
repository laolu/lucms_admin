'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, X } from "lucide-react"
import { type ContentAttribute, type AttributeValue, AttributeType } from '@/services/content-attribute'

interface AttributeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  attribute: ContentAttribute | null
  onSubmit: (data: any) => void
}

export function AttributeDialog({
  open,
  onOpenChange,
  title,
  attribute,
  onSubmit
}: AttributeDialogProps) {
  const [name, setName] = React.useState('')
  const [type, setType] = React.useState<AttributeType>(AttributeType.SINGLE)
  const [values, setValues] = React.useState<Partial<AttributeValue>[]>([])
  const [isActive, setIsActive] = React.useState(true)

  // 重置表单状态
  const resetForm = React.useCallback(() => {
    setName('')
    setType(AttributeType.SINGLE)
    setValues([{ value: '', sort: 0, isActive: true }])
    setIsActive(true)
  }, [])

  // 当编辑属性时，初始化表单数据
  React.useEffect(() => {
    if (attribute) {
      setName(attribute.name)
      setType(attribute.type)
      setValues(attribute.values)
      setIsActive(attribute.isActive)
    } else {
      resetForm()
    }
  }, [attribute, resetForm])

  // 处理对话框关闭
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm()
    }
    onOpenChange(open)
  }

  const handleAddValue = () => {
    setValues(prev => [...prev, { value: '', sort: prev.length, isActive: true }])
  }

  const handleRemoveValue = (index: number) => {
    setValues(prev => prev.filter((_, i) => i !== index))
  }

  const handleValueChange = (index: number, value: string) => {
    setValues(prev => prev.map((item, i) => 
      i === index ? { ...item, value } : item
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      type,
      values: values.filter(v => v.value.trim() !== ''),
      isActive
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">属性名称</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入属性名称"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">属性类型</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as AttributeType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AttributeType.SINGLE}>单选</SelectItem>
                <SelectItem value={AttributeType.MULTIPLE}>多选</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>属性值</Label>
            <div className="space-y-2">
              {values.map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={value.value}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                    placeholder="请输入属性值"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveValue(index)}
                    disabled={values.length === 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddValue}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                添加属性值
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">启用状态</Label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">
              {attribute ? '更新' : '创建'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 