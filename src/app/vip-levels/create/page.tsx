'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { VipLevelForm } from '../_components/vip-level-form'
import { vipLevelService, type CreateVipLevelData } from '@/services/vip-level'

export default function CreateVipLevelPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = React.useState(false)

  const handleSubmit = async (data: CreateVipLevelData) => {
    try {
      setSaving(true)
      await vipLevelService.create(data)
      toast({
        description: '创建成功'
      })
      router.push('/admin/vip-levels')
      router.refresh()
    } catch (error) {
      console.error('创建失败:', error)
      toast({
        variant: 'destructive',
        description: '创建失败'
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">新建VIP等级</h1>
      </div>

      <VipLevelForm
        onSubmit={handleSubmit}
        saving={saving}
        onCancel={() => router.back()}
      />
    </div>
  )
} 