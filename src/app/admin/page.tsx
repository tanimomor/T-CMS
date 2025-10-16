'use client';

import React from 'react';
import { 
  FileText, 
  Puzzle, 
  Image, 
  Plus, 
  TrendingUp, 
  Users, 
  Calendar,
  ArrowRight,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/cms/components/ui/card';
import { Button } from '@/cms/components/ui/button';
import { Badge } from '@/cms/components/ui/badge';
import { useContentTypesStore } from '@/cms/lib/stores/content-types';
import { useComponentsStore } from '@/cms/lib/stores/components';
import { useEntriesStore } from '@/cms/lib/stores/entries';
import { useMediaStore } from '@/cms/lib/stores/media';
import { formatRelativeTime } from '@/cms/lib/utils';
import { useInitData } from '@/cms/lib/hooks/use-init-data';

export default function DashboardPage() {
  // Initialize mock data
  useInitData();
  
  const { contentTypes } = useContentTypesStore();
  const { components } = useComponentsStore();
  const { entries, getRecentEntries } = useEntriesStore();
  const { mediaFiles } = useMediaStore();

  const recentEntries = getRecentEntries(5);
  const stats = {
    contentTypes: contentTypes.length,
    components: components.length,
    entries: entries.length,
    mediaFiles: mediaFiles.length,
  };

  const quickActions = [
    {
      title: 'Create Content Type',
      description: 'Build a new content type',
      icon: FileText,
      href: '/admin/content-builder',
      color: 'bg-blue-500',
    },
    {
      title: 'Create Component',
      description: 'Build a reusable component',
      icon: Puzzle,
      href: '/admin/components',
      color: 'bg-purple-500',
    },
    {
      title: 'Upload Media',
      description: 'Add files to media library',
      icon: Image,
      href: '/admin/media',
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to your CMS</h1>
        <p className="text-primary-foreground/80">
          Manage your content, build components, and organize your media files all in one place.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Types</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contentTypes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.contentTypes === 0 ? 'No content types yet' : 'Content types created'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Components</CardTitle>
            <Puzzle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.components}</div>
            <p className="text-xs text-muted-foreground">
              {stats.components === 0 ? 'No components yet' : 'Reusable components'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entries</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.entries}</div>
            <p className="text-xs text-muted-foreground">
              {stats.entries === 0 ? 'No entries yet' : 'Content entries'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Files</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mediaFiles}</div>
            <p className="text-xs text-muted-foreground">
              {stats.mediaFiles === 0 ? 'No media files yet' : 'Files uploaded'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{action.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {action.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
            <CardDescription>
              Your latest content entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No entries yet</p>
                <p className="text-sm">Create your first content type to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentEntries.map((entry) => {
                  const contentType = contentTypes.find(ct => ct.id === entry.contentTypeId);
                  return (
                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {contentType?.displayName || 'Unknown Type'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatRelativeTime(entry.updatedAt)}
                        </p>
                      </div>
                      <Badge 
                        variant={entry.status === 'published' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {entry.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Follow these steps to set up your CMS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium text-sm">Create your first content type</p>
                  <p className="text-xs text-gray-500">
                    Define the structure for your content
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium text-sm">Build reusable components</p>
                  <p className="text-xs text-gray-500">
                    Create components for common content blocks
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium text-sm">Upload media files</p>
                  <p className="text-xs text-gray-500">
                    Add images and documents to your library
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <p className="font-medium text-sm">Create your first entry</p>
                  <p className="text-xs text-gray-500">
                    Start adding content to your site
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
