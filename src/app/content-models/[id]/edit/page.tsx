'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { ModelForm } from '../../_components/model-form';
import { contentModelService } from '@/services/content-model';
import type { ContentModel } from '@/services/content-model';

export default function EditContentModelPage() {
  const params = useParams();
  const [model, setModel] = useState<ContentModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const data = await contentModelService.getById(Number(params.id));
        setModel(data);
      } catch (error) {
        toast.error('加载模型失败');
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, [params.id]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!model) {
    return <div>模型不存在</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">编辑内容模型</h1>
      </div>

      <ModelForm model={model} />
    </div>
  );
} 