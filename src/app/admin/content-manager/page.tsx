'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/cms/components/ui/card';
import { Button } from '@/cms/components/ui/button';
import { Input } from '@/cms/components/ui/input';
import { Select } from '@/cms/components/ui/select';
import { Badge } from '@/cms/components/ui/badge';
import { useContentTypesStore } from '@/cms/lib/stores/content-types';
import { useEntriesStore } from '@/cms/lib/stores/entries';
import { useInitData } from '@/cms/lib/hooks/use-init-data';
import { formatRelativeTime } from '@/cms/lib/utils';

export default function ContentManagerPage() {
  // Initialize mock data
  useInitData();
  
  const { contentTypes, getCollectionTypes } = useContentTypesStore();
  const { entries, getEntriesByContentType, getFilteredEntries } = useEntriesStore();
  
  const [selectedContentType, setSelectedContentType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const collectionTypes = getCollectionTypes();
  const currentContentType = contentTypes.find(ct => ct.id === selectedContentType);
  const contentTypeEntries = selectedContentType 
    ? getEntriesByContentType(selectedContentType)
    : [];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'modified', label: 'Modified' },
    { value: 'scheduled', label: 'Scheduled' },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'modified': return 'error';
      case 'scheduled': return 'info';
      default: return 'default';
    }
  };

  const getEntryTitle = (entry: any) => {
    return entry.data?.title || entry.data?.name || `Entry ${entry.id.slice(0, 8)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Manager</h1>
          <p className="text-gray-600">Manage your content entries</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Entry
        </Button>
      </div>

      {/* Content Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Content Type</CardTitle>
          <CardDescription>
            Choose a content type to manage its entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {collectionTypes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No collection types available</p>
              <p className="text-sm">Create a collection type first to manage entries</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collectionTypes.map((contentType) => (
                <Card
                  key={contentType.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedContentType === contentType.id
                      ? 'ring-2 ring-primary bg-primary/5'
                      : ''
                  }`}
                  onClick={() => setSelectedContentType(contentType.id)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{contentType.displayName}</CardTitle>
                    <CardDescription className="text-sm">
                      {contentType.description || 'No description'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {contentType.entryCount} entries
                      </span>
                      <Badge variant="secondary" size="sm">
                        {contentType.fields.length} fields
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Entries List */}
      {selectedContentType && currentContentType && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{currentContentType.displayName} Entries</CardTitle>
                <CardDescription>
                  Manage entries for {currentContentType.displayName}
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create {currentContentType.displayName}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
                placeholder="Filter by status"
                className="w-48"
              />
            </div>

            {/* Entries Table */}
            {contentTypeEntries.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-medium">No entries found</p>
                <p className="text-sm">Create your first {currentContentType.displayName} entry</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contentTypeEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">
                          {getEntryTitle(entry)}
                        </h3>
                        <Badge variant={getStatusVariant(entry.status)} size="sm">
                          {entry.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span>ID: {entry.id.slice(0, 8)}</span>
                        <span>Updated {formatRelativeTime(entry.updatedAt)}</span>
                        {entry.publishedAt && (
                          <span>Published {formatRelativeTime(entry.publishedAt)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!selectedContentType && collectionTypes.length > 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-lg font-medium text-gray-900 mb-2">
              Select a content type to get started
            </p>
            <p className="text-gray-500">
              Choose a content type from above to view and manage its entries
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
