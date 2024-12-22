'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { articleService } from '@/services/article'
import { ArticleForm } from '../../_components/article-form'

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [initialData, setInitialData] = React.useState<any>(null)

  // 加载文章数据
  React.useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true)
        const data = await articleService.getArticleById(parseInt(params.id))
        setInitialData(data)
      } catch (error) {
        toast.error('加载文章数据失败')
        router.push('/admin/articles')
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [params.id, router])

  const handleSubmit = async (formData: any) => {
    try {
      setSaving(true)
      await articleService.updateArticle(parseInt(params.id), formData)
      toast.success('文章已更新')
      router.push('/admin/articles')
    } catch (error) {
      toast.error('更新文章失败')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>加载中...</div>
  }

  if (!initialData) {
    return <div>文章不存在</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">编辑文章</h1>
        <Button variant="outline" onClick={() => router.push('/admin/articles')}>
          返回列表
        </Button>
      </div>

      <ArticleForm
        initialData={initialData}
        onSubmit={handleSubmit}
        submitText="保存"
        saving={saving}
        onCancel={() => router.push('/admin/articles')}
      />
    </div>
  )
} 