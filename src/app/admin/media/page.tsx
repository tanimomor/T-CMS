'use client';

import React, { useState } from 'react';
import { Upload, Grid, List, Search, Filter, MoreHorizontal, Download, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/cms/components/ui/card';
import { Button } from '@/cms/components/ui/button';
import { Input } from '@/cms/components/ui/input';
import { Select } from '@/cms/components/ui/select';
import { Badge } from '@/cms/components/ui/badge';
import { useMediaStore } from '@/cms/lib/stores/media';
import { useInitData } from '@/cms/lib/hooks/use-init-data';
import { formatRelativeTime, formatFileSize } from '@/cms/lib/utils';

export default function MediaLibraryPage() {
  // Initialize mock data
  useInitData();
  
  const { mediaFiles, viewMode, setViewMode, getFilesByType } = useMediaStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const typeOptions = [
    { value: 'all', label: 'All Files' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
    { value: 'document', label: 'Documents' },
  ];

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || getFileType(file.mimeType) === typeFilter;
    return matchesSearch && matchesType;
  });

  const getFileType = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'document';
  };

  const getFileIcon = (mimeType: string) => {
    const fileType = getFileType(mimeType);
    switch (fileType) {
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'document': return '📄';
      default: return '📁';
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const selectAllFiles = () => {
    setSelectedFiles(filteredFiles.map(file => file.id));
  };

  const clearSelection = () => {
    setSelectedFiles([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600">Manage your files and assets</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-2xl font-bold">{mediaFiles.length}</p>
              </div>
              <div className="text-2xl">📁</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Images</p>
                <p className="text-2xl font-bold">{getFilesByType('image').length}</p>
              </div>
              <div className="text-2xl">🖼️</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Videos</p>
                <p className="text-2xl font-bold">{getFilesByType('video').length}</p>
              </div>
              <div className="text-2xl">🎥</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-2xl font-bold">{getFilesByType('document').length}</p>
              </div>
              <div className="text-2xl">📄</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={typeOptions}
                className="w-40"
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              {selectedFiles.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedFiles.length} selected
                  </span>
                  <Button variant="outline" size="sm" onClick={clearSelection}>
                    Clear
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Grid/List */}
      <Card>
        <CardContent className="p-4">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📁</div>
              <p className="text-lg font-medium">No files found</p>
              <p className="text-sm">
                {searchQuery || typeFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Upload your first file to get started'
                }
              </p>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`relative group cursor-pointer rounded-lg border-2 transition-all ${
                        selectedFiles.includes(file.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleFileSelection(file.id)}
                    >
                      <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-t-lg">
                        <div className="text-4xl">{getFileIcon(file.mimeType)}</div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatRelativeTime(file.createdAt)}
                        </p>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                        selectedFiles.includes(file.id) ? 'bg-primary/5 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => toggleFileSelection(file.id)}
                          className="rounded"
                        />
                        <div className="text-2xl">{getFileIcon(file.mimeType)}</div>
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)} • {formatRelativeTime(file.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
