'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { type CreateVipLevelData } from '@/services/vip-level'

const defaultFormData: CreateVipLevelData = {
  name: '',
  description: '',
  price: 0,
  duration: 30,
  benefits: [],
  isActive: true,
  sort: 0
}

interface VipLevelFormProps {
  initialData?: CreateVipLevelData
  onSubmit: (data: CreateVipLevelData) => Promise<void>
  submitText?: string
  saving?: boolean
  onCancel?: () => void
}

export function VipLevelForm({
  initialData,
  onSubmit,
  submitText = '保存',
  saving = false,
  onCancel
}: VipLevelFormProps) {
  const [formData, setFormData] = React.useState<CreateVipLevelData>(initialData || defaultFormData)
  const [benefitsText, setBenefitsText] = React.useState((initialData?.benefits || []).join('\n'))

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      setBenefitsText((initialData.benefits || []).join('\n'))
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const benefits = benefitsText.split('\n').filter(benefit => benefit.trim())
    await onSubmit({
      ...formData,
      benefits
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">等级名称</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">描述</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="price">价格</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="duration">时长(天)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="benefits">权益(每行一个)</Label>
          <Textarea
            id="benefits"
            value={benefitsText}
            onChange={(e) => setBenefitsText(e.target.value)}
            required
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
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label htmlFor="isActive">启用</Label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? '保存中...' : submitText}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            取消
          </Button>
        )}
      </div>
    </form>
  )
} 