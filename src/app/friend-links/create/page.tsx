'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { friendLinkService } from '@/services/friend-link'
import { FriendLinkForm } from '../_components/friend-link-form'

export default function CreateFriendLinkPage() {
  const router = useRouter()
  const [saving, setSaving] = React.useState(false)

  const handleSubmit = async (formData: any) => {
    try {
      setSaving(true)
      await friendLinkService.create(formData)
      toast.success('友情链接已创建')
      router.push('/admin/friend-links')
    } catch (error) {
      toast.error('创建友情链接失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">创建友情链接</h1>
        <Button variant="outline" onClick={() => router.push('/admin/friend-links')}>
          返回列表
        </Button>
      </div>

      <FriendLinkForm
        onSubmit={handleSubmit}
        submitText="创建"
        saving={saving}
        onCancel={() => router.push('/admin/friend-links')}
      />
    </div>
  )
} 