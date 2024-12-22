import { ContentForm } from '../_components/content-form';

export default function CreateContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">创建内容</h3>
        <p className="text-sm text-muted-foreground">
          创建新的内容并设置其属性
        </p>
      </div>
      <ContentForm />
    </div>
  );
} 