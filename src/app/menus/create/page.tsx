'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { menuService } from '@/services/menu'
import { MenuForm } from '../_components/menu-form'

export default function CreateMenuPage() {
  const router = useRouter()
  const [saving, setSaving] = React.useState(false)

  const handleSubmit = async (formData: any) => {
    try {
      setSaving(true)
      await menuService.create(formData)
      toast.success('菜单已创建')
      router.push('/admin/menus')
    } catch (error) {
      toast.error('创建菜单失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">创建菜单</h1>
        <Button variant="outline" onClick={() => router.push('/admin/menus')}>
          返回列表
        </Button>
      </div>

      <MenuForm
        onSubmit={handleSubmit}
        submitText="创建"
        saving={saving}
        onCancel={() => router.push('/admin/menus')}
      />
    </div>
  )
} 