'use client';

import React, { useState } from 'react';
import { Settings, Globe, Shield, Key, Webhook, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/cms/components/ui/card';
import { Button } from '@/cms/components/ui/button';
import { Input } from '@/cms/components/ui/input';
import { Textarea } from '@/cms/components/ui/textarea';
import { Select } from '@/cms/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/cms/components/ui/tabs';
import { Badge } from '@/cms/components/ui/badge';
import { useSettingsStore } from '@/cms/lib/stores/settings';

export default function SettingsPage() {
  const { settings, updateSettings, getActiveLocales, addLocale, removeLocale } = useSettingsStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const localeOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'zh', label: 'Chinese' },
  ];

  const timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Europe/Berlin', label: 'Berlin (CET)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your CMS settings</p>
        </div>
        <Button onClick={handleSave} loading={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="i18n">
            <Globe className="h-4 w-4 mr-2" />
            Internationalization
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Shield className="h-4 w-4 mr-2" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="tokens">
            <Key className="h-4 w-4 mr-2" />
            API Tokens
          </TabsTrigger>
          <TabsTrigger value="webhooks">
            <Webhook className="h-4 w-4 mr-2" />
            Webhooks
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic application configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Application Name"
                value={settings.appName}
                onChange={(e) => updateSettings({ appName: e.target.value })}
                placeholder="My CMS"
              />
              <Textarea
                label="Description"
                value={settings.description || ''}
                onChange={(e) => updateSettings({ description: e.target.value })}
                placeholder="A brief description of your CMS"
                rows={3}
              />
              <Select
                label="Default Timezone"
                value={settings.timezone}
                onChange={(e) => updateSettings({ timezone: e.target.value })}
                options={timezoneOptions}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="draftAndPublish"
                  checked={settings.draftAndPublishEnabled}
                  onChange={(e) => updateSettings({ draftAndPublishEnabled: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="draftAndPublish" className="text-sm font-medium">
                  Enable Draft & Publish System
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Internationalization */}
        <TabsContent value="i18n" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Internationalization</CardTitle>
              <CardDescription>
                Configure language and locale settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="i18nEnabled"
                  checked={settings.i18nEnabled}
                  onChange={(e) => updateSettings({ i18nEnabled: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="i18nEnabled" className="text-sm font-medium">
                  Enable Internationalization
                </label>
              </div>
              
              {settings.i18nEnabled && (
                <>
                  <Select
                    label="Default Locale"
                    value={settings.defaultLocale}
                    onChange={(e) => updateSettings({ defaultLocale: e.target.value })}
                    options={localeOptions}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Active Locales
                    </label>
                    <div className="space-y-2">
                      {getActiveLocales().map((locale) => (
                        <div key={locale.code} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium">{locale.name}</span>
                            <span className="text-sm text-gray-500">({locale.code})</span>
                            {locale.isDefault && (
                              <Badge variant="primary" size="sm">Default</Badge>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Add Locale
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles & Permissions */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>
                Manage user roles and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Admin', description: 'Full access to all features', color: 'bg-red-100 text-red-800' },
                  { name: 'Editor', description: 'Can create, edit, and publish content', color: 'bg-blue-100 text-blue-800' },
                  { name: 'Author', description: 'Can create and edit their own content', color: 'bg-green-100 text-green-800' },
                  { name: 'Viewer', description: 'Read-only access to content', color: 'bg-gray-100 text-gray-800' },
                ].map((role) => (
                  <div key={role.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{role.name}</h3>
                        <Badge className={role.color} size="sm">
                          {role.name}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit Permissions
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Tokens */}
        <TabsContent value="tokens" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Tokens</CardTitle>
                  <CardDescription>
                    Manage API access tokens for external integrations
                  </CardDescription>
                </div>
                <Button>
                  Create Token
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Key className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No API tokens created yet</p>
                <p className="text-sm">Create your first API token to enable external access</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Webhooks</CardTitle>
                  <CardDescription>
                    Configure webhooks for real-time notifications
                  </CardDescription>
                </div>
                <Button>
                  Add Webhook
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Webhook className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No webhooks configured yet</p>
                <p className="text-sm">Add webhooks to receive notifications about content changes</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
