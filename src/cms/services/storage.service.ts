// Storage service for localStorage operations
import { CMS_CONSTANTS } from '@/cms/config/constants';

export class StorageService {
  private static instance: StorageService;
  
  private constructor() {}
  
  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Generic storage methods
  public setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
      throw new Error('Failed to save data to storage');
    }
  }

  public getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return null;
    }
  }

  public removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
    }
  }

  public clear(): void {
    try {
      // Only clear CMS-related items
      Object.values(CMS_CONSTANTS.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error(`Error clearing localStorage:`, error);
    }
  }

  // Specific CMS storage methods
  public saveContentTypes(contentTypes: any[]): void {
    this.setItem(CMS_CONSTANTS.STORAGE_KEYS.CONTENT_TYPES, contentTypes);
  }

  public loadContentTypes(): any[] {
    return this.getItem(CMS_CONSTANTS.STORAGE_KEYS.CONTENT_TYPES) || [];
  }

  public saveComponents(components: any[]): void {
    this.setItem(CMS_CONSTANTS.STORAGE_KEYS.COMPONENTS, components);
  }

  public loadComponents(): any[] {
    return this.getItem(CMS_CONSTANTS.STORAGE_KEYS.COMPONENTS) || [];
  }

  public saveEntries(entries: any[]): void {
    this.setItem(CMS_CONSTANTS.STORAGE_KEYS.ENTRIES, entries);
  }

  public loadEntries(): any[] {
    return this.getItem(CMS_CONSTANTS.STORAGE_KEYS.ENTRIES) || [];
  }

  public saveMediaFiles(mediaFiles: any[]): void {
    this.setItem(CMS_CONSTANTS.STORAGE_KEYS.MEDIA_FILES, mediaFiles);
  }

  public loadMediaFiles(): any[] {
    return this.getItem(CMS_CONSTANTS.STORAGE_KEYS.MEDIA_FILES) || [];
  }

  public saveSettings(settings: any): void {
    this.setItem(CMS_CONSTANTS.STORAGE_KEYS.SETTINGS, settings);
  }

  public loadSettings(): any {
    return this.getItem(CMS_CONSTANTS.STORAGE_KEYS.SETTINGS) || null;
  }

  public saveUsers(users: any[]): void {
    this.setItem(CMS_CONSTANTS.STORAGE_KEYS.USERS, users);
  }

  public loadUsers(): any[] {
    return this.getItem(CMS_CONSTANTS.STORAGE_KEYS.USERS) || [];
  }

  public saveApiTokens(apiTokens: any[]): void {
    this.setItem(CMS_CONSTANTS.STORAGE_KEYS.API_TOKENS, apiTokens);
  }

  public loadApiTokens(): any[] {
    return this.getItem(CMS_CONSTANTS.STORAGE_KEYS.API_TOKENS) || [];
  }

  public saveWebhooks(webhooks: any[]): void {
    this.setItem(CMS_CONSTANTS.STORAGE_KEYS.WEBHOOKS, webhooks);
  }

  public loadWebhooks(): any[] {
    return this.getItem(CMS_CONSTANTS.STORAGE_KEYS.WEBHOOKS) || [];
  }

  public saveUIConfig(uiConfig: any): void {
    this.setItem(CMS_CONSTANTS.STORAGE_KEYS.UI_CONFIG, uiConfig);
  }

  public loadUIConfig(): any {
    return this.getItem(CMS_CONSTANTS.STORAGE_KEYS.UI_CONFIG) || null;
  }

  // Export/Import functionality
  public exportAllData(): any {
    return {
      contentTypes: this.loadContentTypes(),
      components: this.loadComponents(),
      entries: this.loadEntries(),
      mediaFiles: this.loadMediaFiles(),
      settings: this.loadSettings(),
      users: this.loadUsers(),
      apiTokens: this.loadApiTokens(),
      webhooks: this.loadWebhooks(),
      uiConfig: this.loadUIConfig(),
      version: CMS_CONSTANTS.EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
    };
  }

  public importData(data: any): void {
    try {
      if (data.contentTypes) this.saveContentTypes(data.contentTypes);
      if (data.components) this.saveComponents(data.components);
      if (data.entries) this.saveEntries(data.entries);
      if (data.mediaFiles) this.saveMediaFiles(data.mediaFiles);
      if (data.settings) this.saveSettings(data.settings);
      if (data.users) this.saveUsers(data.users);
      if (data.apiTokens) this.saveApiTokens(data.apiTokens);
      if (data.webhooks) this.saveWebhooks(data.webhooks);
      if (data.uiConfig) this.saveUIConfig(data.uiConfig);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data');
    }
  }

  // Utility methods
  public getStorageSize(): number {
    let totalSize = 0;
    Object.values(CMS_CONSTANTS.STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length;
      }
    });
    return totalSize;
  }

  public getStorageInfo(): { used: number; available: number; percentage: number } {
    const used = this.getStorageSize();
    const available = 5 * 1024 * 1024; // 5MB estimate for localStorage
    const percentage = (used / available) * 100;
    
    return { used, available, percentage };
  }

  public isStorageAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const storageService = StorageService.getInstance();
