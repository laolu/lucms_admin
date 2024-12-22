'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { menuService } from '@/services/menu'
import { MenuForm } from '../../_components/menu-form'

export default function EditMenuPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [initialData, setInitialData] = React.useState<any>(null)

  // 加载菜单数据
  React.useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true)
        const data = await menuService.getById(parseInt(params.id))
        setInitialData(data)
      } catch (error) {
        toast.error('加载菜单数据失败')
        router.push('/admin/menus')
      } finally {
        setLoading(false)
      }
    }

    loadMenu()
  }, [params.id, router])

  const handleSubmit = async (formData: any) => {
    try {
      setSaving(true)
      await menuService.update({
        id: parseInt(params.id),
        ...formData
      })
      toast.success('菜单已更新')
      router.push('/admin/menus')
    } catch (error) {
      toast.error('更新菜单失败')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6">加载中...</div>
  }

  if (!initialData) {
    return <div className="p-6">菜单不存在</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">编辑菜单</h1>
        <Button variant="outline" onClick={() => router.push('/admin/menus')}>
          返回列表
        </Button>
      </div>

      <MenuForm
        initialData={initialData}
        onSubmit={handleSubmit}
        submitText="保存"
        saving={saving}
        onCancel={() => router.push('/admin/menus')}
      />
    </div>
  )
} 