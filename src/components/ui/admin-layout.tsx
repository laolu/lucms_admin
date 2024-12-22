import React from 'react';

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function AdminLayout({ title, children }: AdminLayoutProps) {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
} 