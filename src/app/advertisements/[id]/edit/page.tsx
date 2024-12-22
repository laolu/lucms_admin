'use client'

import AdForm from '../../_components/ad-form';

export default function EditAdvertisementPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">编辑广告</h3>
        <p className="text-sm text-muted-foreground">
          编辑广告信息。
        </p>
      </div>
      <AdForm id={params.id} />
    </div>
  );
} 