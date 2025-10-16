// Core CMS Types and Interfaces

export type FieldType = 
  | 'text'
  | 'longtext'
  | 'richtext'
  | 'number'
  | 'decimal'
  | 'float'
  | 'date'
  | 'datetime'
  | 'time'
  | 'boolean'
  | 'email'
  | 'password'
  | 'enumeration'
  | 'media'
  | 'relation'
  | 'json'
  | 'uid'
  | 'component'
  | 'repeatable-component'
  | 'dynamic-zone';

export type ContentTypeKind = 'single' | 'collection';

export type EntryStatus = 'draft' | 'published' | 'modified' | 'scheduled';

export type Locale = {
  code: string;
  name: string;
  isDefault: boolean;
};

// Field Configuration
export interface FieldConfig {
  name: string;
  type: FieldType;
  required?: boolean;
  unique?: boolean;
  private?: boolean;
  defaultValue?: any;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  localized?: boolean;
  // Field-specific settings
  enumerationValues?: string[];
  relationTarget?: string;
  relationType?: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
  componentId?: string;
  allowedComponents?: string[];
  minComponents?: number;
  maxComponents?: number;
  uidTarget?: string;
  mediaType?: 'image' | 'video' | 'file' | 'all';
  multiple?: boolean;
}

// Component Definition
export interface Component {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  category: string;
  icon?: string;
  isRepeatable: boolean;
  minInstances?: number;
  maxInstances?: number;
  defaultInstances?: number;
  fields: FieldConfig[];
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  usedIn: string[]; // Content type IDs that use this component
}

// Content Type Definition
export interface ContentType {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  kind: ContentTypeKind;
  apiId: string;
  draftAndPublish: boolean;
  i18n: boolean;
  fields: FieldConfig[];
  createdAt: string;
  updatedAt: string;
  entryCount: number;
}

// Entry Data
export interface Entry {
  id: string;
  contentTypeId: string;
  status: EntryStatus;
  locale: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  publishedAt?: string;
  scheduledAt?: string;
}

// Media File
export interface MediaFile {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

// User
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'author' | 'viewer';
  isActive: boolean;
  lastLogin?: string;
}

// Settings
export interface Settings {
  appName: string;
  description?: string;
  defaultLocale: string;
  locales: Locale[];
  timezone: string;
  i18nEnabled: boolean;
  draftAndPublishEnabled: boolean;
}

// API Token
export interface ApiToken {
  id: string;
  name: string;
  type: 'read-only' | 'full-access';
  token: string;
  expiresAt?: string;
  createdAt: string;
  lastUsedAt?: string;
}

// Webhook
export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
}

// Form Field Props
export interface FormFieldProps {
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  locale?: string;
  isLocalized?: boolean;
}

// Component Instance
export interface ComponentInstance {
  id: string;
  componentId: string;
  data: Record<string, any>;
}

// Dynamic Zone Block
export interface DynamicZoneBlock {
  id: string;
  componentId: string;
  data: Record<string, any>;
}

// Search and Filter Types
export interface SearchFilters {
  status?: EntryStatus[];
  locale?: string[];
  contentTypeId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

// Dashboard Stats
export interface DashboardStats {
  totalContentTypes: number;
  totalEntries: number;
  totalComponents: number;
  totalMediaFiles: number;
  recentEntries: Entry[];
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'created' | 'updated' | 'published' | 'deleted';
  entityType: 'content-type' | 'entry' | 'component' | 'media';
  entityId: string;
  entityName: string;
  user: string;
  timestamp: string;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Export/Import Types
export interface ExportData {
  contentTypes: ContentType[];
  components: Component[];
  entries: Entry[];
  mediaFiles: MediaFile[];
  settings: Settings;
  version: string;
  exportedAt: string;
}

// Theme and UI Types
export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

export interface UIConfig {
  theme: Theme;
  sidebarCollapsed: boolean;
  viewMode: 'table' | 'grid';
  itemsPerPage: number;
  showAdvancedFields: boolean;
}
