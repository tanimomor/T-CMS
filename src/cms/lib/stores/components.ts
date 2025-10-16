import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Component, FieldConfig } from '@/cms/lib/types';
import { CMS_CONSTANTS } from '@/cms/config/constants';

interface ComponentsState {
  components: Component[];
  isLoading: boolean;
  error: string | null;
}

interface ComponentsActions {
  // CRUD operations
  createComponent: (component: Omit<Component, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'usedIn'>) => Component;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  getComponent: (id: string) => Component | undefined;
  getComponentByName: (name: string) => Component | undefined;
  
  // Field operations
  addField: (componentId: string, field: FieldConfig) => void;
  updateField: (componentId: string, fieldName: string, updates: Partial<FieldConfig>) => void;
  removeField: (componentId: string, fieldName: string) => void;
  reorderFields: (componentId: string, fieldNames: string[]) => void;
  
  // Usage tracking
  incrementUsage: (componentId: string, contentTypeId: string) => void;
  decrementUsage: (componentId: string, contentTypeId: string) => void;
  getUsageCount: (componentId: string) => number;
  getUsedIn: (componentId: string) => string[];
  
  // Utility functions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Getters
  getComponentsByCategory: (category: string) => Component[];
  getRepeatableComponents: () => Component[];
  getSingleUseComponents: () => Component[];
  searchComponents: (query: string) => Component[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useComponentsStore = create<ComponentsState & ComponentsActions>()(
  persist(
    (set, get) => ({
      components: [],
      isLoading: false,
      error: null,

      createComponent: (componentData) => {
        const id = generateId();
        
        const newComponent: Component = {
          ...componentData,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 0,
          usedIn: [],
        };

        set((state) => ({
          components: [...state.components, newComponent],
        }));

        return newComponent;
      },

      updateComponent: (id, updates) => {
        set((state) => ({
          components: state.components.map((comp) =>
            comp.id === id
              ? { ...comp, ...updates, updatedAt: new Date().toISOString() }
              : comp
          ),
        }));
      },

      deleteComponent: (id) => {
        set((state) => ({
          components: state.components.filter((comp) => comp.id !== id),
        }));
      },

      getComponent: (id) => {
        return get().components.find((comp) => comp.id === id);
      },

      getComponentByName: (name) => {
        return get().components.find((comp) => comp.name === name);
      },

      addField: (componentId, field) => {
        set((state) => ({
          components: state.components.map((comp) =>
            comp.id === componentId
              ? {
                  ...comp,
                  fields: [...comp.fields, field],
                  updatedAt: new Date().toISOString(),
                }
              : comp
          ),
        }));
      },

      updateField: (componentId, fieldName, updates) => {
        set((state) => ({
          components: state.components.map((comp) =>
            comp.id === componentId
              ? {
                  ...comp,
                  fields: comp.fields.map((field) =>
                    field.name === fieldName
                      ? { ...field, ...updates }
                      : field
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : comp
          ),
        }));
      },

      removeField: (componentId, fieldName) => {
        set((state) => ({
          components: state.components.map((comp) =>
            comp.id === componentId
              ? {
                  ...comp,
                  fields: comp.fields.filter((field) => field.name !== fieldName),
                  updatedAt: new Date().toISOString(),
                }
              : comp
          ),
        }));
      },

      reorderFields: (componentId, fieldNames) => {
        set((state) => ({
          components: state.components.map((comp) =>
            comp.id === componentId
              ? {
                  ...comp,
                  fields: fieldNames
                    .map((name) => comp.fields.find((f) => f.name === name))
                    .filter(Boolean) as FieldConfig[],
                  updatedAt: new Date().toISOString(),
                }
              : comp
          ),
        }));
      },

      incrementUsage: (componentId, contentTypeId) => {
        set((state) => ({
          components: state.components.map((comp) =>
            comp.id === componentId
              ? {
                  ...comp,
                  usageCount: comp.usageCount + 1,
                  usedIn: comp.usedIn.includes(contentTypeId)
                    ? comp.usedIn
                    : [...comp.usedIn, contentTypeId],
                }
              : comp
          ),
        }));
      },

      decrementUsage: (componentId, contentTypeId) => {
        set((state) => ({
          components: state.components.map((comp) =>
            comp.id === componentId
              ? {
                  ...comp,
                  usageCount: Math.max(0, comp.usageCount - 1),
                  usedIn: comp.usedIn.filter((id) => id !== contentTypeId),
                }
              : comp
          ),
        }));
      },

      getUsageCount: (componentId) => {
        const component = get().components.find((comp) => comp.id === componentId);
        return component?.usageCount || 0;
      },

      getUsedIn: (componentId) => {
        const component = get().components.find((comp) => comp.id === componentId);
        return component?.usedIn || [];
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      getComponentsByCategory: (category) => {
        return get().components.filter((comp) => comp.category === category);
      },

      getRepeatableComponents: () => {
        return get().components.filter((comp) => comp.isRepeatable);
      },

      getSingleUseComponents: () => {
        return get().components.filter((comp) => !comp.isRepeatable);
      },

      searchComponents: (query) => {
        const lowercaseQuery = query.toLowerCase();
        return get().components.filter((comp) =>
          comp.name.toLowerCase().includes(lowercaseQuery) ||
          comp.displayName.toLowerCase().includes(lowercaseQuery) ||
          comp.description?.toLowerCase().includes(lowercaseQuery) ||
          comp.category.toLowerCase().includes(lowercaseQuery)
        );
      },
    }),
    {
      name: CMS_CONSTANTS.STORAGE_KEYS.COMPONENTS,
      version: 1,
    }
  )
);
