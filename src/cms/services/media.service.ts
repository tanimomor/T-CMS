// Media Service
import { MediaFile } from '@/cms/lib/types';
import { useMediaStore } from '@/cms/lib/stores/media';
import { CMS_CONSTANTS } from '@/cms/config/constants';

export class MediaService {
  private static instance: MediaService;
  
  private constructor() {}
  
  public static getInstance(): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService();
    }
    return MediaService.instance;
  }

  // Media CRUD operations
  public addMediaFile(data: {
    name: string;
    filename: string;
    mimeType: string;
    size: number;
    width?: number;
    height?: number;
    url: string;
    alt?: string;
    caption?: string;
    folder?: string;
  }): MediaFile {
    const store = useMediaStore.getState();
    return store.addMediaFile(data);
  }

  public updateMediaFile(id: string, updates: Partial<MediaFile>): void {
    const store = useMediaStore.getState();
    store.updateMediaFile(id, updates);
  }

  public deleteMediaFile(id: string): void {
    const store = useMediaStore.getState();
    store.deleteMediaFile(id);
  }

  public getMediaFile(id: string): MediaFile | undefined {
    const store = useMediaStore.getState();
    return store.getMediaFile(id);
  }

  // File operations
  public async uploadFiles(files: File[]): Promise<MediaFile[]> {
    const store = useMediaStore.getState();
    return await store.uploadFiles(files);
  }

  public downloadFile(id: string): void {
    const store = useMediaStore.getState();
    store.downloadFile(id);
  }

  public async replaceFile(id: string, newFile: File): Promise<MediaFile> {
    const store = useMediaStore.getState();
    return await store.replaceFile(id, newFile);
  }

  // Selection management
  public selectFile(id: string): void {
    const store = useMediaStore.getState();
    store.selectFile(id);
  }

  public deselectFile(id: string): void {
    const store = useMediaStore.getState();
    store.deselectFile(id);
  }

  public selectAll(): void {
    const store = useMediaStore.getState();
    store.selectAll();
  }

  public clearSelection(): void {
    const store = useMediaStore.getState();
    store.clearSelection();
  }

  public deleteSelected(): void {
    const store = useMediaStore.getState();
    store.deleteSelected();
  }

  public getSelectedFiles(): string[] {
    const store = useMediaStore.getState();
    return store.selectedFiles;
  }

  // View management
  public setViewMode(mode: 'grid' | 'list'): void {
    const store = useMediaStore.getState();
    store.setViewMode(mode);
  }

  public getViewMode(): 'grid' | 'list' {
    const store = useMediaStore.getState();
    return store.viewMode;
  }

  public setCurrentFolder(folder: string | null): void {
    const store = useMediaStore.getState();
    store.setCurrentFolder(folder);
  }

  public getCurrentFolder(): string | null {
    const store = useMediaStore.getState();
    return store.currentFolder;
  }

  // Getters
  public getAllMediaFiles(): MediaFile[] {
    const store = useMediaStore.getState();
    return store.mediaFiles;
  }

  public getFilesByType(type: 'image' | 'video' | 'document' | 'all'): MediaFile[] {
    const store = useMediaStore.getState();
    return store.getFilesByType(type);
  }

  public getFilesByFolder(folder: string): MediaFile[] {
    const store = useMediaStore.getState();
    return store.getFilesByFolder(folder);
  }

  public getRecentFiles(limit?: number): MediaFile[] {
    const store = useMediaStore.getState();
    return store.getRecentFiles(limit);
  }

  public searchFiles(query: string): MediaFile[] {
    const store = useMediaStore.getState();
    return store.searchFiles(query);
  }

  public getFileCount(): number {
    const store = useMediaStore.getState();
    return store.getFileCount();
  }

  public getTotalSize(): number {
    const store = useMediaStore.getState();
    return store.getTotalSize();
  }

  // Validation methods
  public validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > CMS_CONSTANTS.DEFAULTS.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size exceeds maximum allowed size of ${CMS_CONSTANTS.DEFAULTS.MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    // Check file type
    const allowedTypes = [
      ...CMS_CONSTANTS.DEFAULTS.ALLOWED_IMAGE_TYPES,
      ...CMS_CONSTANTS.DEFAULTS.ALLOWED_VIDEO_TYPES,
      ...CMS_CONSTANTS.DEFAULTS.ALLOWED_DOCUMENT_TYPES,
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed`,
      };
    }

    return { isValid: true };
  }

  public validateFiles(files: File[]): { valid: File[]; invalid: { file: File; error: string }[] } {
    const valid: File[] = [];
    const invalid: { file: File; error: string }[] = [];

    files.forEach(file => {
      const validation = this.validateFile(file);
      if (validation.isValid) {
        valid.push(file);
      } else {
        invalid.push({ file, error: validation.error! });
      }
    });

    return { valid, invalid };
  }

  // Utility methods
  public getFileType(mimeType: string): 'image' | 'video' | 'document' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'document';
  }

  public getFileIcon(mimeType: string): string {
    const fileType = this.getFileType(mimeType);
    
    switch (fileType) {
      case 'image':
        return 'Image';
      case 'video':
        return 'Video';
      case 'document':
        if (mimeType.includes('pdf')) return 'FileText';
        if (mimeType.includes('word')) return 'FileText';
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'FileSpreadsheet';
        if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'FileSliders';
        return 'File';
      default:
        return 'File';
    }
  }

  public formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  public formatDimensions(width?: number, height?: number): string {
    if (!width || !height) return '';
    return `${width} × ${height}`;
  }

  public getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  public generateThumbnailUrl(mediaFile: MediaFile): string {
    // In a real app, this would generate a thumbnail URL
    // For now, return the original URL for images, or a placeholder for other types
    if (this.getFileType(mediaFile.mimeType) === 'image') {
      return mediaFile.url;
    }
    
    return '/api/thumbnails/placeholder.png';
  }

  // Folder operations
  public getFolders(): string[] {
    const files = this.getAllMediaFiles();
    const folders = new Set(files.map(file => file.folder).filter(Boolean));
    return Array.from(folders).sort();
  }

  public createFolder(name: string): void {
    // In a real app, this would create a folder
    // For now, we just track it in the current folder state
    this.setCurrentFolder(name);
  }

  public deleteFolder(folder: string): void {
    // Delete all files in the folder
    const filesInFolder = this.getFilesByFolder(folder);
    filesInFolder.forEach(file => this.deleteMediaFile(file.id));
  }

  public moveFilesToFolder(fileIds: string[], folder: string): void {
    fileIds.forEach(id => {
      this.updateMediaFile(id, { folder });
    });
  }

  // Statistics
  public getMediaStats(): {
    total: number;
    byType: { [key: string]: number };
    byFolder: { [key: string]: number };
    totalSize: number;
    averageSize: number;
    recentCount: number;
  } {
    const files = this.getAllMediaFiles();
    const byType: { [key: string]: number } = {};
    const byFolder: { [key: string]: number } = {};
    let totalSize = 0;

    files.forEach(file => {
      const fileType = this.getFileType(file.mimeType);
      byType[fileType] = (byType[fileType] || 0) + 1;
      
      const folder = file.folder || 'Root';
      byFolder[folder] = (byFolder[folder] || 0) + 1;
      
      totalSize += file.size;
    });

    const recentCount = files.filter(file => {
      const fileDate = new Date(file.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return fileDate > weekAgo;
    }).length;

    return {
      total: files.length,
      byType,
      byFolder,
      totalSize,
      averageSize: files.length > 0 ? totalSize / files.length : 0,
      recentCount,
    };
  }

  // Search and filtering
  public getFilteredFiles(filters: {
    type?: 'image' | 'video' | 'document' | 'all';
    folder?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }): MediaFile[] {
    let files = this.getAllMediaFiles();

    if (filters.type && filters.type !== 'all') {
      files = files.filter(file => this.getFileType(file.mimeType) === filters.type);
    }

    if (filters.folder) {
      files = files.filter(file => file.folder === filters.folder);
    }

    if (filters.search) {
      const query = filters.search.toLowerCase();
      files = files.filter(file =>
        file.name.toLowerCase().includes(query) ||
        file.filename.toLowerCase().includes(query) ||
        file.alt?.toLowerCase().includes(query) ||
        file.caption?.toLowerCase().includes(query)
      );
    }

    if (filters.dateFrom) {
      files = files.filter(file => new Date(file.createdAt) >= new Date(filters.dateFrom!));
    }

    if (filters.dateTo) {
      files = files.filter(file => new Date(file.createdAt) <= new Date(filters.dateTo!));
    }

    return files;
  }
}

// Export singleton instance
export const mediaService = MediaService.getInstance();
