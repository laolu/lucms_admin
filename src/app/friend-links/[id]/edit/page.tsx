'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { friendLinkService } from '@/services/friend-link'
import { FriendLinkForm } from '../../_components/friend-link-form'

export default function EditFriendLinkPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [initialData, setInitialData] = React.useState<any>(null)

  // 加载友情链接数据
  React.useEffect(() => {
    const loadFriendLink = async () => {
      try {
        setLoading(true)
        const data = await friendLinkService.getById(parseInt(params.id))
        setInitialData(data)
      } catch (error) {
        toast.error('加载友情链接数据失败')
        router.push('/admin/friend-links')
      } finally {
        setLoading(false)
      }
    }

    loadFriendLink()
  }, [params.id, router])

  const handleSubmit = async (formData: any) => {
    try {
      setSaving(true)
      await friendLinkService.update(parseInt(params.id), formData)
      toast.success('友情链接已更新')
      router.push('/admin/friend-links')
    } catch (error) {
      toast.error('更新友情链接失败')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>加载中...</div>
  }

  if (!initialData) {
    return <div>友情链接不存在</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">编辑友情链接</h1>
        <Button variant="outline" onClick={() => router.push('/admin/friend-links')}>
          返回列表
        </Button>
      </div>

      <FriendLinkForm
        initialData={initialData}
        onSubmit={handleSubmit}
        submitText="保存"
        saving={saving}
        onCancel={() => router.push('/admin/friend-links')}
      />
    </div>
  )
} 