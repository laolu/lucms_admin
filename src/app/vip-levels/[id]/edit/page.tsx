'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { VipLevelForm } from '../../_components/vip-level-form'
import { vipLevelService, type CreateVipLevelData } from '@/services/vip-level'

interface EditVipLevelPageProps {
  params: {
    id: string
  }
}

export default function EditVipLevelPage({ params }: EditVipLevelPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = React.useState(false)
  const [initialData, setInitialData] = React.useState<CreateVipLevelData>()

  React.useEffect(() => {
    const loadVipLevel = async () => {
      try {
        const data = await vipLevelService.getById(parseInt(params.id))
        setInitialData(data)
      } catch (error) {
        console.error('加载失败:', error)
        toast({
          variant: 'destructive',
          description: '加载失败'
        })
        router.push('/admin/vip-levels')
      }
    }

    loadVipLevel()
  }, [params.id, router, toast])

  const handleSubmit = async (data: CreateVipLevelData) => {
    try {
      setSaving(true)
      await vipLevelService.update(parseInt(params.id), data)
      toast({
        description: '更新成功'
      })
      router.push('/admin/vip-levels')
      router.refresh()
    } catch (error) {
      console.error('更新失败:', error)
      toast({
        variant: 'destructive',
        description: '更新失败'
      })
    } finally {
      setSaving(false)
    }
  }

  if (!initialData) {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">编辑VIP等级</h1>
      </div>

      <VipLevelForm
        initialData={initialData}
        onSubmit={handleSubmit}
        saving={saving}
        onCancel={() => router.back()}
      />
    </div>
  )
} 