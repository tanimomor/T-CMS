'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { getBreadcrumbs } from '@/cms/config/routes';
import { useSettingsStore } from '@/cms/lib/stores/settings';
import Sidebar from './sidebar';
import Header from './header';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { uiConfig, updateUIConfig } = useSettingsStore();

  const handleSidebarToggle = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    updateUIConfig({ sidebarCollapsed: newCollapsed });
  };

  const breadcrumbs = getBreadcrumbs(pathname);
  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label || 'Admin';

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          onMenuToggle={handleSidebarToggle}
          title={pageTitle}
          breadcrumbs={breadcrumbs}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
