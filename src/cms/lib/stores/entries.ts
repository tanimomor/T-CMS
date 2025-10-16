import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Entry, EntryStatus, SearchFilters, SortOptions } from '@/cms/lib/types';
import { CMS_CONSTANTS } from '@/cms/config/constants';

interface EntriesState {
  entries: Entry[];
  isLoading: boolean;
  error: string | null;
  currentEntry: Entry | null;
  searchFilters: SearchFilters;
  sortOptions: SortOptions;
}

interface EntriesActions {
  // CRUD operations
  createEntry: (entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => Entry;
  updateEntry: (id: string, updates: Partial<Entry>) => void;
  deleteEntry: (id: string) => void;
  getEntry: (id: string) => Entry | undefined;
  duplicateEntry: (id: string) => Entry | undefined;
  
  // Status operations
  publishEntry: (id: string) => void;
  unpublishEntry: (id: string) => void;
  scheduleEntry: (id: string, scheduledAt: string) => void;
  
  // Current entry management
  setCurrentEntry: (entry: Entry | null) => void;
  updateCurrentEntry: (updates: Partial<Entry>) => void;
  saveCurrentEntry: () => void;
  publishCurrentEntry: () => void;
  
  // Search and filtering
  setSearchFilters: (filters: SearchFilters) => void;
  setSortOptions: (sort: SortOptions) => void;
  clearFilters: () => void;
  
  // Utility functions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Getters
  getEntriesByContentType: (contentTypeId: string) => Entry[];
  getEntriesByStatus: (status: EntryStatus) => Entry[];
  getEntriesByLocale: (locale: string) => Entry[];
  getFilteredEntries: () => Entry[];
  getRecentEntries: (limit?: number) => Entry[];
  getEntryCount: (contentTypeId: string) => number;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useEntriesStore = create<EntriesState & EntriesActions>()(
  persist(
    (set, get) => ({
      entries: [],
      isLoading: false,
      error: null,
      currentEntry: null,
      searchFilters: {},
      sortOptions: { field: 'updatedAt', direction: 'desc' },

      createEntry: (entryData) => {
        const id = generateId();
        
        const newEntry: Entry = {
          ...entryData,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          entries: [...state.entries, newEntry],
        }));

        return newEntry;
      },

      updateEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? { 
                  ...entry, 
                  ...updates, 
                  updatedAt: new Date().toISOString(),
                  // If updating published entry, mark as modified
                  status: entry.status === 'published' && updates.data 
                    ? 'modified' 
                    : entry.status
                }
              : entry
          ),
        }));
      },

      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
          currentEntry: state.currentEntry?.id === id ? null : state.currentEntry,
        }));
      },

      getEntry: (id) => {
        return get().entries.find((entry) => entry.id === id);
      },

      duplicateEntry: (id) => {
        const originalEntry = get().entries.find((entry) => entry.id === id);
        if (!originalEntry) return undefined;

        const duplicatedEntry = get().createEntry({
          ...originalEntry,
          data: { ...originalEntry.data },
          status: 'draft',
          locale: originalEntry.locale,
          createdBy: 'current-user', // This should be the actual current user
          updatedBy: 'current-user',
        });

        return duplicatedEntry;
      },

      publishEntry: (id) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? {
                  ...entry,
                  status: 'published',
                  publishedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : entry
          ),
        }));
      },

      unpublishEntry: (id) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? {
                  ...entry,
                  status: 'draft',
                  publishedAt: undefined,
                  updatedAt: new Date().toISOString(),
                }
              : entry
          ),
        }));
      },

      scheduleEntry: (id, scheduledAt) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? {
                  ...entry,
                  status: 'scheduled',
                  scheduledAt,
                  updatedAt: new Date().toISOString(),
                }
              : entry
          ),
        }));
      },

      setCurrentEntry: (entry) => {
        set({ currentEntry: entry });
      },

      updateCurrentEntry: (updates) => {
        set((state) => ({
          currentEntry: state.currentEntry
            ? { ...state.currentEntry, ...updates, updatedAt: new Date().toISOString() }
            : null,
        }));
      },

      saveCurrentEntry: () => {
        const { currentEntry } = get();
        if (!currentEntry) return;

        get().updateEntry(currentEntry.id, currentEntry);
      },

      publishCurrentEntry: () => {
        const { currentEntry } = get();
        if (!currentEntry) return;

        get().updateEntry(currentEntry.id, {
          ...currentEntry,
          status: 'published',
          publishedAt: new Date().toISOString(),
        });
      },

      setSearchFilters: (filters) => {
        set({ searchFilters: filters });
      },

      setSortOptions: (sort) => {
        set({ sortOptions: sort });
      },

      clearFilters: () => {
        set({ 
          searchFilters: {},
          sortOptions: { field: 'updatedAt', direction: 'desc' }
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      getEntriesByContentType: (contentTypeId) => {
        return get().entries.filter((entry) => entry.contentTypeId === contentTypeId);
      },

      getEntriesByStatus: (status) => {
        return get().entries.filter((entry) => entry.status === status);
      },

      getEntriesByLocale: (locale) => {
        return get().entries.filter((entry) => entry.locale === locale);
      },

      getFilteredEntries: () => {
        const { entries, searchFilters, sortOptions } = get();
        let filtered = [...entries];

        // Apply filters
        if (searchFilters.status && searchFilters.status.length > 0) {
          filtered = filtered.filter((entry) => searchFilters.status!.includes(entry.status));
        }

        if (searchFilters.locale && searchFilters.locale.length > 0) {
          filtered = filtered.filter((entry) => searchFilters.locale!.includes(entry.locale));
        }

        if (searchFilters.contentTypeId) {
          filtered = filtered.filter((entry) => entry.contentTypeId === searchFilters.contentTypeId);
        }

        if (searchFilters.search) {
          const query = searchFilters.search.toLowerCase();
          filtered = filtered.filter((entry) => {
            // Search in entry data (title, content, etc.)
            const dataString = JSON.stringify(entry.data).toLowerCase();
            return dataString.includes(query);
          });
        }

        if (searchFilters.dateFrom) {
          filtered = filtered.filter((entry) => 
            new Date(entry.createdAt) >= new Date(searchFilters.dateFrom!)
          );
        }

        if (searchFilters.dateTo) {
          filtered = filtered.filter((entry) => 
            new Date(entry.createdAt) <= new Date(searchFilters.dateTo!)
          );
        }

        // Apply sorting
        filtered.sort((a, b) => {
          const aValue = a[sortOptions.field as keyof Entry];
          const bValue = b[sortOptions.field as keyof Entry];
          
          if (aValue < bValue) return sortOptions.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortOptions.direction === 'asc' ? 1 : -1;
          return 0;
        });

        return filtered;
      },

      getRecentEntries: (limit = 10) => {
        return get().entries
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, limit);
      },

      getEntryCount: (contentTypeId) => {
        return get().entries.filter((entry) => entry.contentTypeId === contentTypeId).length;
      },
    }),
    {
      name: CMS_CONSTANTS.STORAGE_KEYS.ENTRIES,
      version: 1,
      partialize: (state) => ({
        entries: state.entries,
        searchFilters: state.searchFilters,
        sortOptions: state.sortOptions,
      }),
    }
  )
);
