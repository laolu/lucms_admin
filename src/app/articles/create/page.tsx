'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { articleService } from '@/services/article'
import { ArticleForm } from '../_components/article-form'

export default function CreateArticlePage() {
  const router = useRouter()
  const [saving, setSaving] = React.useState(false)

  const handleSubmit = async (formData: any) => {
    try {
      setSaving(true)
      await articleService.createArticle(formData)
      toast.success('文章已创建')
      router.push('/admin/articles')
    } catch (error) {
      toast.error('创建文章失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">创建文章</h1>
        <Button variant="outline" onClick={() => router.push('/admin/articles')}>
          返回列表
        </Button>
      </div>

      <ArticleForm
        onSubmit={handleSubmit}
        submitText="创建"
        saving={saving}
        onCancel={() => router.push('/admin/articles')}
      />
    </div>
  )
} 