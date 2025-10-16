import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ContentType, FieldConfig } from '@/cms/lib/types';
import { CMS_CONSTANTS } from '@/cms/config/constants';

interface ContentTypesState {
  contentTypes: ContentType[];
  isLoading: boolean;
  error: string | null;
}

interface ContentTypesActions {
  // CRUD operations
  createContentType: (contentType: Omit<ContentType, 'id' | 'createdAt' | 'updatedAt' | 'entryCount'>) => ContentType;
  updateContentType: (id: string, updates: Partial<ContentType>) => void;
  deleteContentType: (id: string) => void;
  getContentType: (id: string) => ContentType | undefined;
  getContentTypeByApiId: (apiId: string) => ContentType | undefined;
  
  // Field operations
  addField: (contentTypeId: string, field: FieldConfig) => void;
  updateField: (contentTypeId: string, fieldName: string, updates: Partial<FieldConfig>) => void;
  removeField: (contentTypeId: string, fieldName: string) => void;
  reorderFields: (contentTypeId: string, fieldNames: string[]) => void;
  
  // Utility functions
  incrementEntryCount: (contentTypeId: string) => void;
  decrementEntryCount: (contentTypeId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Getters
  getSingleTypes: () => ContentType[];
  getCollectionTypes: () => ContentType[];
  getContentTypesByKind: (kind: 'single' | 'collection') => ContentType[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);
const generateApiId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

export const useContentTypesStore = create<ContentTypesState & ContentTypesActions>()(
  persist(
    (set, get) => ({
      contentTypes: [],
      isLoading: false,
      error: null,

      createContentType: (contentTypeData) => {
        const id = generateId();
        const apiId = contentTypeData.apiId || generateApiId(contentTypeData.displayName);
        
        const newContentType: ContentType = {
          ...contentTypeData,
          id,
          apiId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          entryCount: 0,
        };

        set((state) => ({
          contentTypes: [...state.contentTypes, newContentType],
        }));

        return newContentType;
      },

      updateContentType: (id, updates) => {
        set((state) => ({
          contentTypes: state.contentTypes.map((ct) =>
            ct.id === id
              ? { ...ct, ...updates, updatedAt: new Date().toISOString() }
              : ct
          ),
        }));
      },

      deleteContentType: (id) => {
        set((state) => ({
          contentTypes: state.contentTypes.filter((ct) => ct.id !== id),
        }));
      },

      getContentType: (id) => {
        return get().contentTypes.find((ct) => ct.id === id);
      },

      getContentTypeByApiId: (apiId) => {
        return get().contentTypes.find((ct) => ct.apiId === apiId);
      },

      addField: (contentTypeId, field) => {
        set((state) => ({
          contentTypes: state.contentTypes.map((ct) =>
            ct.id === contentTypeId
              ? {
                  ...ct,
                  fields: [...ct.fields, field],
                  updatedAt: new Date().toISOString(),
                }
              : ct
          ),
        }));
      },

      updateField: (contentTypeId, fieldName, updates) => {
        set((state) => ({
          contentTypes: state.contentTypes.map((ct) =>
            ct.id === contentTypeId
              ? {
                  ...ct,
                  fields: ct.fields.map((field) =>
                    field.name === fieldName
                      ? { ...field, ...updates }
                      : field
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : ct
          ),
        }));
      },

      removeField: (contentTypeId, fieldName) => {
        set((state) => ({
          contentTypes: state.contentTypes.map((ct) =>
            ct.id === contentTypeId
              ? {
                  ...ct,
                  fields: ct.fields.filter((field) => field.name !== fieldName),
                  updatedAt: new Date().toISOString(),
                }
              : ct
          ),
        }));
      },

      reorderFields: (contentTypeId, fieldNames) => {
        set((state) => ({
          contentTypes: state.contentTypes.map((ct) =>
            ct.id === contentTypeId
              ? {
                  ...ct,
                  fields: fieldNames
                    .map((name) => ct.fields.find((f) => f.name === name))
                    .filter(Boolean) as FieldConfig[],
                  updatedAt: new Date().toISOString(),
                }
              : ct
          ),
        }));
      },

      incrementEntryCount: (contentTypeId) => {
        set((state) => ({
          contentTypes: state.contentTypes.map((ct) =>
            ct.id === contentTypeId
              ? { ...ct, entryCount: ct.entryCount + 1 }
              : ct
          ),
        }));
      },

      decrementEntryCount: (contentTypeId) => {
        set((state) => ({
          contentTypes: state.contentTypes.map((ct) =>
            ct.id === contentTypeId
              ? { ...ct, entryCount: Math.max(0, ct.entryCount - 1) }
              : ct
          ),
        }));
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      getSingleTypes: () => {
        return get().contentTypes.filter((ct) => ct.kind === 'single');
      },

      getCollectionTypes: () => {
        return get().contentTypes.filter((ct) => ct.kind === 'collection');
      },

      getContentTypesByKind: (kind) => {
        return get().contentTypes.filter((ct) => ct.kind === kind);
      },
    }),
    {
      name: CMS_CONSTANTS.STORAGE_KEYS.CONTENT_TYPES,
      version: 1,
    }
  )
);
