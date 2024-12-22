'use client';

import { ContentForm } from '../../_components/content-form';

interface EditContentPageProps {
  params: {
    id: string;
  };
}

export default function EditContentPage({ params }: EditContentPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">编辑内容</h3>
        <p className="text-sm text-muted-foreground">
          编辑内容并设置其属性
        </p>
      </div>
      <ContentForm id={params.id} />
    </div>
  );
} 