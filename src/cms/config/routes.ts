// CMS Admin Routes Configuration

export const CMS_ROUTES = {
  // Main admin routes
  ADMIN: '/admin',
  DASHBOARD: '/admin',
  CONTENT_MANAGER: '/admin/content-manager',
  CONTENT_BUILDER: '/admin/content-builder',
  COMPONENTS: '/admin/components',
  MEDIA: '/admin/media',
  SETTINGS: '/admin/settings',
  
  // Content Manager sub-routes
  CONTENT_MANAGER_ENTRY: (contentTypeId: string, entryId?: string) => 
    entryId 
      ? `/admin/content-manager/${contentTypeId}/${entryId}`
      : `/admin/content-manager/${contentTypeId}`,
  
  // Content Builder sub-routes
  CONTENT_BUILDER_TYPE: (contentTypeId?: string) => 
    contentTypeId 
      ? `/admin/content-builder/${contentTypeId}`
      : '/admin/content-builder',
  
  // Components sub-routes
  COMPONENT_DETAIL: (componentId: string) => 
    `/admin/components/${componentId}`,
  
  // Media sub-routes
  MEDIA_DETAIL: (mediaId: string) => 
    `/admin/media/${mediaId}`,
  
  // Settings sub-routes
  SETTINGS_GENERAL: '/admin/settings/general',
  SETTINGS_I18N: '/admin/settings/i18n',
  SETTINGS_ROLES: '/admin/settings/roles',
  SETTINGS_TOKENS: '/admin/settings/tokens',
  SETTINGS_WEBHOOKS: '/admin/settings/webhooks',
} as const;

// Navigation items configuration
export const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: CMS_ROUTES.DASHBOARD,
    icon: 'LayoutDashboard',
    description: 'Overview and quick actions',
  },
  {
    id: 'content-manager',
    label: 'Content Manager',
    href: CMS_ROUTES.CONTENT_MANAGER,
    icon: 'FileText',
    description: 'Manage your content entries',
  },
  {
    id: 'content-builder',
    label: 'Content-Type Builder',
    href: CMS_ROUTES.CONTENT_BUILDER,
    icon: 'Wrench',
    description: 'Create and edit content types',
  },
  {
    id: 'components',
    label: 'Component Library',
    href: CMS_ROUTES.COMPONENTS,
    icon: 'Puzzle',
    description: 'Manage reusable components',
  },
  {
    id: 'media',
    label: 'Media Library',
    href: CMS_ROUTES.MEDIA,
    icon: 'Image',
    description: 'Manage files and assets',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: CMS_ROUTES.SETTINGS,
    icon: 'Settings',
    description: 'Configure your CMS',
  },
] as const;

// Settings tabs configuration
export const SETTINGS_TABS = [
  {
    id: 'general',
    label: 'General',
    href: CMS_ROUTES.SETTINGS_GENERAL,
    icon: 'Settings',
    description: 'Basic application settings',
  },
  {
    id: 'i18n',
    label: 'Internationalization',
    href: CMS_ROUTES.SETTINGS_I18N,
    icon: 'Globe',
    description: 'Language and locale settings',
  },
  {
    id: 'roles',
    label: 'Roles & Permissions',
    href: CMS_ROUTES.SETTINGS_ROLES,
    icon: 'Shield',
    description: 'User roles and permissions',
  },
  {
    id: 'tokens',
    label: 'API Tokens',
    href: CMS_ROUTES.SETTINGS_TOKENS,
    icon: 'Key',
    description: 'API access tokens',
  },
  {
    id: 'webhooks',
    label: 'Webhooks',
    href: CMS_ROUTES.SETTINGS_WEBHOOKS,
    icon: 'Webhook',
    description: 'Configure webhooks',
  },
] as const;

// Content Builder tabs
export const CONTENT_BUILDER_TABS = [
  {
    id: 'content-types',
    label: 'Content Types',
    icon: 'FileText',
    description: 'Manage content types and single types',
  },
  {
    id: 'components',
    label: 'Components',
    icon: 'Puzzle',
    description: 'Manage reusable components',
  },
] as const;

// Helper functions
export const isActiveRoute = (currentPath: string, route: string): boolean => {
  if (route === CMS_ROUTES.ADMIN) {
    return currentPath === route;
  }
  return currentPath.startsWith(route);
};

export const getBreadcrumbs = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'Admin', href: CMS_ROUTES.ADMIN },
  ];

  if (segments.length > 1) {
    const section = segments[1];
    const navItem = NAV_ITEMS.find(item => item.id === section);
    if (navItem) {
      breadcrumbs.push({
        label: navItem.label,
        href: navItem.href,
      });
    }

    // Add specific page breadcrumbs
    if (segments.length > 2) {
      const subPage = segments[2];
      if (section === 'settings' && subPage !== 'general') {
        const settingsTab = SETTINGS_TABS.find(tab => tab.id === subPage);
        if (settingsTab) {
          breadcrumbs.push({
            label: settingsTab.label,
            href: settingsTab.href,
          });
        }
      }
    }
  }

  return breadcrumbs;
};
