// Entry Service
import { Entry, EntryStatus, SearchFilters, SortOptions } from '@/cms/lib/types';
import { useEntriesStore } from '@/cms/lib/stores/entries';
import { useContentTypesStore } from '@/cms/lib/stores/content-types';
import { CMS_CONSTANTS } from '@/cms/config/constants';

export class EntryService {
  private static instance: EntryService;
  
  private constructor() {}
  
  public static getInstance(): EntryService {
    if (!EntryService.instance) {
      EntryService.instance = new EntryService();
    }
    return EntryService.instance;
  }

  // Entry CRUD operations
  public createEntry(data: {
    contentTypeId: string;
    status?: EntryStatus;
    locale?: string;
    data: Record<string, any>;
    createdBy?: string;
    updatedBy?: string;
  }): Entry {
    const store = useEntriesStore.getState();
    const contentTypeStore = useContentTypesStore.getState();
    
    // Validate content type exists
    const contentType = contentTypeStore.getContentType(data.contentTypeId);
    if (!contentType) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.CONTENT_TYPE_NOT_FOUND);
    }

    // Validate entry data against content type schema
    this.validateEntryData(data.data, contentType.fields);

    // Increment entry count for content type
    contentTypeStore.incrementEntryCount(data.contentTypeId);

    return store.createEntry({
      contentTypeId: data.contentTypeId,
      status: data.status || 'draft',
      locale: data.locale || CMS_CONSTANTS.DEFAULTS.DEFAULT_LOCALE,
      data: data.data,
      createdBy: data.createdBy || 'current-user',
      updatedBy: data.updatedBy || 'current-user',
    });
  }

  public updateEntry(id: string, updates: Partial<Entry>): void {
    const store = useEntriesStore.getState();
    const entry = store.getEntry(id);
    
    if (!entry) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.ENTRY_NOT_FOUND);
    }

    // Validate data if being updated
    if (updates.data) {
      const contentTypeStore = useContentTypesStore.getState();
      const contentType = contentTypeStore.getContentType(entry.contentTypeId);
      if (contentType) {
        this.validateEntryData(updates.data, contentType.fields);
      }
    }

    store.updateEntry(id, updates);
  }

  public deleteEntry(id: string): void {
    const store = useEntriesStore.getState();
    const entry = store.getEntry(id);
    
    if (!entry) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.ENTRY_NOT_FOUND);
    }

    // Decrement entry count for content type
    const contentTypeStore = useContentTypesStore.getState();
    contentTypeStore.decrementEntryCount(entry.contentTypeId);

    store.deleteEntry(id);
  }

  public getEntry(id: string): Entry | undefined {
    const store = useEntriesStore.getState();
    return store.getEntry(id);
  }

  public duplicateEntry(id: string): Entry | undefined {
    const store = useEntriesStore.getState();
    return store.duplicateEntry(id);
  }

  // Status operations
  public publishEntry(id: string): void {
    const store = useEntriesStore.getState();
    const entry = store.getEntry(id);
    
    if (!entry) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.ENTRY_NOT_FOUND);
    }

    store.publishEntry(id);
  }

  public unpublishEntry(id: string): void {
    const store = useEntriesStore.getState();
    const entry = store.getEntry(id);
    
    if (!entry) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.ENTRY_NOT_FOUND);
    }

    store.unpublishEntry(id);
  }

  public scheduleEntry(id: string, scheduledAt: string): void {
    const store = useEntriesStore.getState();
    const entry = store.getEntry(id);
    
    if (!entry) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.ENTRY_NOT_FOUND);
    }

    // Validate scheduled date is in the future
    if (new Date(scheduledAt) <= new Date()) {
      throw new Error('Scheduled date must be in the future');
    }

    store.scheduleEntry(id, scheduledAt);
  }

  // Current entry management
  public setCurrentEntry(entry: Entry | null): void {
    const store = useEntriesStore.getState();
    store.setCurrentEntry(entry);
  }

  public getCurrentEntry(): Entry | null {
    const store = useEntriesStore.getState();
    return store.currentEntry;
  }

  public updateCurrentEntry(updates: Partial<Entry>): void {
    const store = useEntriesStore.getState();
    store.updateCurrentEntry(updates);
  }

  public saveCurrentEntry(): void {
    const store = useEntriesStore.getState();
    store.saveCurrentEntry();
  }

  public publishCurrentEntry(): void {
    const store = useEntriesStore.getState();
    store.publishCurrentEntry();
  }

  // Search and filtering
  public setSearchFilters(filters: SearchFilters): void {
    const store = useEntriesStore.getState();
    store.setSearchFilters(filters);
  }

  public setSortOptions(sort: SortOptions): void {
    const store = useEntriesStore.getState();
    store.setSortOptions(sort);
  }

  public clearFilters(): void {
    const store = useEntriesStore.getState();
    store.clearFilters();
  }

  public getFilteredEntries(): Entry[] {
    const store = useEntriesStore.getState();
    return store.getFilteredEntries();
  }

  // Getters
  public getAllEntries(): Entry[] {
    const store = useEntriesStore.getState();
    return store.entries;
  }

  public getEntriesByContentType(contentTypeId: string): Entry[] {
    const store = useEntriesStore.getState();
    return store.getEntriesByContentType(contentTypeId);
  }

  public getEntriesByStatus(status: EntryStatus): Entry[] {
    const store = useEntriesStore.getState();
    return store.getEntriesByStatus(status);
  }

  public getEntriesByLocale(locale: string): Entry[] {
    const store = useEntriesStore.getState();
    return store.getEntriesByLocale(locale);
  }

  public getRecentEntries(limit?: number): Entry[] {
    const store = useEntriesStore.getState();
    return store.getRecentEntries(limit);
  }

  public getEntryCount(contentTypeId: string): number {
    const store = useEntriesStore.getState();
    return store.getEntryCount(contentTypeId);
  }

  // Validation methods
  private validateEntryData(data: Record<string, any>, fields: any[]): void {
    for (const field of fields) {
      const value = data[field.name];
      
      // Check required fields
      if (field.required && (value === undefined || value === null || value === '')) {
        throw new Error(`Field '${field.name}' is required`);
      }

      // Skip validation for empty optional fields
      if (!field.required && (value === undefined || value === null || value === '')) {
        continue;
      }

      // Type-specific validation
      this.validateFieldValue(field, value);
    }
  }

  private validateFieldValue(field: any, value: any): void {
    switch (field.type) {
      case 'text':
      case 'longtext':
        if (typeof value !== 'string') {
          throw new Error(`Field '${field.name}' must be a string`);
        }
        if (field.maxLength && value.length > field.maxLength) {
          throw new Error(`Field '${field.name}' exceeds maximum length of ${field.maxLength}`);
        }
        if (field.minLength && value.length < field.minLength) {
          throw new Error(`Field '${field.name}' is below minimum length of ${field.minLength}`);
        }
        break;

      case 'number':
      case 'decimal':
      case 'float':
        if (typeof value !== 'number' || isNaN(value)) {
          throw new Error(`Field '${field.name}' must be a number`);
        }
        if (field.min !== undefined && value < field.min) {
          throw new Error(`Field '${field.name}' is below minimum value of ${field.min}`);
        }
        if (field.max !== undefined && value > field.max) {
          throw new Error(`Field '${field.name}' exceeds maximum value of ${field.max}`);
        }
        break;

      case 'email':
        if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          throw new Error(`Field '${field.name}' must be a valid email address`);
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          throw new Error(`Field '${field.name}' must be a boolean`);
        }
        break;

      case 'date':
      case 'datetime':
        if (!(value instanceof Date) && typeof value !== 'string') {
          throw new Error(`Field '${field.name}' must be a date`);
        }
        break;

      case 'enumeration':
        if (!field.enumerationValues?.includes(value)) {
          throw new Error(`Field '${field.name}' must be one of: ${field.enumerationValues?.join(', ')}`);
        }
        break;

      case 'media':
        // Media validation would depend on implementation
        break;

      case 'relation':
        // Relation validation would depend on implementation
        break;

      case 'json':
        try {
          JSON.stringify(value);
        } catch {
          throw new Error(`Field '${field.name}' must be valid JSON`);
        }
        break;

      case 'component':
      case 'repeatable-component':
        // Component validation would depend on implementation
        break;

      case 'dynamic-zone':
        // Dynamic zone validation would depend on implementation
        break;
    }
  }

  // Utility methods
  public getEntryTitle(entry: Entry): string {
    // Try to find a title field in the entry data
    const titleFields = ['title', 'name', 'heading', 'subject'];
    
    for (const field of titleFields) {
      if (entry.data[field] && typeof entry.data[field] === 'string') {
        return entry.data[field];
      }
    }

    // Fallback to entry ID
    return `Entry ${entry.id}`;
  }

  public getEntryStatusColor(status: EntryStatus): string {
    return CMS_CONSTANTS.STATUS_COLORS[status] || 'gray';
  }

  public getEntryStatusLabel(status: EntryStatus): string {
    const labels: Record<EntryStatus, string> = {
      draft: 'Draft',
      published: 'Published',
      modified: 'Modified',
      scheduled: 'Scheduled',
    };
    return labels[status] || status;
  }

  // Statistics
  public getEntryStats(): {
    total: number;
    byStatus: { [key in EntryStatus]: number };
    byContentType: { [key: string]: number };
    byLocale: { [key: string]: number };
    recentCount: number;
  } {
    const entries = this.getAllEntries();
    const byStatus: { [key in EntryStatus]: number } = {
      draft: 0,
      published: 0,
      modified: 0,
      scheduled: 0,
    };
    const byContentType: { [key: string]: number } = {};
    const byLocale: { [key: string]: number } = {};

    entries.forEach(entry => {
      byStatus[entry.status]++;
      byContentType[entry.contentTypeId] = (byContentType[entry.contentTypeId] || 0) + 1;
      byLocale[entry.locale] = (byLocale[entry.locale] || 0) + 1;
    });

    const recentCount = entries.filter(entry => {
      const entryDate = new Date(entry.updatedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate > weekAgo;
    }).length;

    return {
      total: entries.length,
      byStatus,
      byContentType,
      byLocale,
      recentCount,
    };
  }

  // Bulk operations
  public bulkDelete(entryIds: string[]): void {
    entryIds.forEach(id => this.deleteEntry(id));
  }

  public bulkPublish(entryIds: string[]): void {
    entryIds.forEach(id => this.publishEntry(id));
  }

  public bulkUnpublish(entryIds: string[]): void {
    entryIds.forEach(id => this.unpublishEntry(id));
  }
}

// Export singleton instance
export const entryService = EntryService.getInstance();
