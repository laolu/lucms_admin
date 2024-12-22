'use client'

import AdForm from '../_components/ad-form';

export default function CreateAdvertisementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">创建广告</h3>
        <p className="text-sm text-muted-foreground">
          创建一个新的广告位。
        </p>
      </div>
      <AdForm />
    </div>
  );
} 