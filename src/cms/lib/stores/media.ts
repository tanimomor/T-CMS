import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MediaFile } from '@/cms/lib/types';
import { CMS_CONSTANTS } from '@/cms/config/constants';

interface MediaState {
  mediaFiles: MediaFile[];
  isLoading: boolean;
  error: string | null;
  selectedFiles: string[];
  viewMode: 'grid' | 'list';
  currentFolder: string | null;
}

interface MediaActions {
  // CRUD operations
  addMediaFile: (file: Omit<MediaFile, 'id' | 'createdAt' | 'updatedAt'>) => MediaFile;
  updateMediaFile: (id: string, updates: Partial<MediaFile>) => void;
  deleteMediaFile: (id: string) => void;
  getMediaFile: (id: string) => MediaFile | undefined;
  
  // File operations
  uploadFiles: (files: File[]) => Promise<MediaFile[]>;
  downloadFile: (id: string) => void;
  replaceFile: (id: string, newFile: File) => Promise<MediaFile>;
  
  // Selection management
  selectFile: (id: string) => void;
  deselectFile: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  deleteSelected: () => void;
  
  // View management
  setViewMode: (mode: 'grid' | 'list') => void;
  setCurrentFolder: (folder: string | null) => void;
  
  // Utility functions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Getters
  getFilesByType: (type: 'image' | 'video' | 'document' | 'all') => MediaFile[];
  getFilesByFolder: (folder: string) => MediaFile[];
  getRecentFiles: (limit?: number) => MediaFile[];
  searchFiles: (query: string) => MediaFile[];
  getFileCount: () => number;
  getTotalSize: () => number;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper function to get file type from MIME type
const getFileType = (mimeType: string): 'image' | 'video' | 'document' => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return 'document';
};

// Helper function to generate file URL (in real app, this would be from server)
const generateFileUrl = (filename: string): string => {
  return `/api/media/${filename}`;
};

// Helper function to get image dimensions
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
    };
    img.src = URL.createObjectURL(file);
  });
};

export const useMediaStore = create<MediaState & MediaActions>()(
  persist(
    (set, get) => ({
      mediaFiles: [],
      isLoading: false,
      error: null,
      selectedFiles: [],
      viewMode: 'grid',
      currentFolder: null,

      addMediaFile: (fileData) => {
        const id = generateId();
        
        const newMediaFile: MediaFile = {
          ...fileData,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          mediaFiles: [...state.mediaFiles, newMediaFile],
        }));

        return newMediaFile;
      },

      updateMediaFile: (id, updates) => {
        set((state) => ({
          mediaFiles: state.mediaFiles.map((file) =>
            file.id === id
              ? { ...file, ...updates, updatedAt: new Date().toISOString() }
              : file
          ),
        }));
      },

      deleteMediaFile: (id) => {
        set((state) => ({
          mediaFiles: state.mediaFiles.filter((file) => file.id !== id),
          selectedFiles: state.selectedFiles.filter((fileId) => fileId !== id),
        }));
      },

      getMediaFile: (id) => {
        return get().mediaFiles.find((file) => file.id === id);
      },

      uploadFiles: async (files) => {
        const { setLoading, setError, addMediaFile } = get();
        
        setLoading(true);
        setError(null);

        try {
          const uploadedFiles: MediaFile[] = [];

          for (const file of files) {
            // Validate file size
            if (file.size > CMS_CONSTANTS.DEFAULTS.MAX_FILE_SIZE) {
              throw new Error(`File ${file.name} is too large. Maximum size is ${CMS_CONSTANTS.DEFAULTS.MAX_FILE_SIZE / 1024 / 1024}MB`);
            }

            // Validate file type
            const allowedTypes = [
              ...CMS_CONSTANTS.DEFAULTS.ALLOWED_IMAGE_TYPES,
              ...CMS_CONSTANTS.DEFAULTS.ALLOWED_VIDEO_TYPES,
              ...CMS_CONSTANTS.DEFAULTS.ALLOWED_DOCUMENT_TYPES,
            ];

            if (!allowedTypes.includes(file.type)) {
              throw new Error(`File type ${file.type} is not allowed`);
            }

            // Get image dimensions if it's an image
            let dimensions = { width: 0, height: 0 };
            if (file.type.startsWith('image/')) {
              dimensions = await getImageDimensions(file);
            }

            // Create media file record
            const mediaFile = addMediaFile({
              name: file.name.split('.')[0],
              filename: file.name,
              mimeType: file.type,
              size: file.size,
              width: dimensions.width || undefined,
              height: dimensions.height || undefined,
              url: generateFileUrl(file.name),
              folder: get().currentFolder || undefined,
            });

            uploadedFiles.push(mediaFile);
          }

          setLoading(false);
          return uploadedFiles;
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Upload failed');
          setLoading(false);
          throw error;
        }
      },

      downloadFile: (id) => {
        const file = get().getMediaFile(id);
        if (!file) return;

        // In a real app, this would trigger a download from the server
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },

      replaceFile: async (id, newFile) => {
        const { updateMediaFile, setError } = get();
        
        try {
          // Validate new file
          if (newFile.size > CMS_CONSTANTS.DEFAULTS.MAX_FILE_SIZE) {
            throw new Error(`File is too large. Maximum size is ${CMS_CONSTANTS.DEFAULTS.MAX_FILE_SIZE / 1024 / 1024}MB`);
          }

          // Get image dimensions if it's an image
          let dimensions = { width: 0, height: 0 };
          if (newFile.type.startsWith('image/')) {
            dimensions = await getImageDimensions(newFile);
          }

          // Update the media file
          updateMediaFile(id, {
            name: newFile.name.split('.')[0],
            filename: newFile.name,
            mimeType: newFile.type,
            size: newFile.size,
            width: dimensions.width || undefined,
            height: dimensions.height || undefined,
            url: generateFileUrl(newFile.name),
          });

          const updatedFile = get().getMediaFile(id);
          if (!updatedFile) throw new Error('File not found after update');
          
          return updatedFile;
        } catch (error) {
          setError(error instanceof Error ? error.message : 'File replacement failed');
          throw error;
        }
      },

      selectFile: (id) => {
        set((state) => ({
          selectedFiles: state.selectedFiles.includes(id)
            ? state.selectedFiles
            : [...state.selectedFiles, id],
        }));
      },

      deselectFile: (id) => {
        set((state) => ({
          selectedFiles: state.selectedFiles.filter((fileId) => fileId !== id),
        }));
      },

      selectAll: () => {
        const { mediaFiles, currentFolder } = get();
        const filesToSelect = currentFolder
          ? mediaFiles.filter((file) => file.folder === currentFolder)
          : mediaFiles;
        
        set({ selectedFiles: filesToSelect.map((file) => file.id) });
      },

      clearSelection: () => {
        set({ selectedFiles: [] });
      },

      deleteSelected: () => {
        const { selectedFiles, deleteMediaFile } = get();
        selectedFiles.forEach((id) => deleteMediaFile(id));
        set({ selectedFiles: [] });
      },

      setViewMode: (mode) => {
        set({ viewMode: mode });
      },

      setCurrentFolder: (folder) => {
        set({ currentFolder: folder });
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      getFilesByType: (type) => {
        const files = get().mediaFiles;
        if (type === 'all') return files;
        
        return files.filter((file) => getFileType(file.mimeType) === type);
      },

      getFilesByFolder: (folder) => {
        return get().mediaFiles.filter((file) => file.folder === folder);
      },

      getRecentFiles: (limit = 20) => {
        return get().mediaFiles
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);
      },

      searchFiles: (query) => {
        const lowercaseQuery = query.toLowerCase();
        return get().mediaFiles.filter((file) =>
          file.name.toLowerCase().includes(lowercaseQuery) ||
          file.filename.toLowerCase().includes(lowercaseQuery) ||
          file.alt?.toLowerCase().includes(lowercaseQuery) ||
          file.caption?.toLowerCase().includes(lowercaseQuery)
        );
      },

      getFileCount: () => {
        return get().mediaFiles.length;
      },

      getTotalSize: () => {
        return get().mediaFiles.reduce((total, file) => total + file.size, 0);
      },
    }),
    {
      name: CMS_CONSTANTS.STORAGE_KEYS.MEDIA_FILES,
      version: 1,
      partialize: (state) => ({
        mediaFiles: state.mediaFiles,
        viewMode: state.viewMode,
        currentFolder: state.currentFolder,
      }),
    }
  )
);
