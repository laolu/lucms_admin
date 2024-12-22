'use client';

import { ModelForm } from '../_components/model-form';

export default function CreateContentModelPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">创建内容模型</h1>
      </div>

      <ModelForm />
    </div>
  );
} 