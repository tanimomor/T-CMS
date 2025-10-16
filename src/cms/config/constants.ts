// CMS Constants and Configuration

export const CMS_CONSTANTS = {
  // Storage keys
  STORAGE_KEYS: {
    CONTENT_TYPES: 'cms_content_types',
    COMPONENTS: 'cms_components',
    ENTRIES: 'cms_entries',
    MEDIA_FILES: 'cms_media_files',
    SETTINGS: 'cms_settings',
    USERS: 'cms_users',
    API_TOKENS: 'cms_api_tokens',
    WEBHOOKS: 'cms_webhooks',
    UI_CONFIG: 'cms_ui_config',
  },

  // Default settings
  DEFAULTS: {
    APP_NAME: 'My CMS',
    DEFAULT_LOCALE: 'en',
    TIMEZONE: 'UTC',
    ITEMS_PER_PAGE: 25,
    AUTO_SAVE_INTERVAL: 30000, // 30 seconds
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain', 'application/msword'],
  },

  // Field validation
  VALIDATION: {
    MAX_TEXT_LENGTH: 1000,
    MAX_LONG_TEXT_LENGTH: 10000,
    MAX_RICH_TEXT_LENGTH: 50000,
    MAX_EMAIL_LENGTH: 254,
    MAX_PASSWORD_LENGTH: 128,
    MIN_PASSWORD_LENGTH: 8,
    MAX_ENUM_VALUES: 50,
    MAX_COMPONENT_INSTANCES: 100,
    MAX_DYNAMIC_ZONE_COMPONENTS: 20,
  },

  // UI Configuration
  UI: {
    SIDEBAR_WIDTH: 280,
    SIDEBAR_COLLAPSED_WIDTH: 60,
    HEADER_HEIGHT: 64,
    FOOTER_HEIGHT: 48,
    MODAL_MAX_WIDTH: 800,
    MODAL_MAX_HEIGHT: 600,
    TOAST_DURATION: 5000,
    DEBOUNCE_DELAY: 300,
  },

  // Status colors
  STATUS_COLORS: {
    draft: 'yellow',
    published: 'green',
    modified: 'orange',
    scheduled: 'blue',
    unpublished: 'gray',
  },

  // Field type categories
  FIELD_CATEGORIES: {
    TEXT: 'text',
    NUMBER: 'number',
    DATE: 'date',
    MEDIA: 'media',
    RELATION: 'relation',
    COMPONENT: 'component',
    ADVANCED: 'advanced',
  },

  // Content type kinds
  CONTENT_TYPE_KINDS: {
    SINGLE: 'single',
    COLLECTION: 'collection',
  },

  // Entry statuses
  ENTRY_STATUSES: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    MODIFIED: 'modified',
    SCHEDULED: 'scheduled',
  },

  // User roles
  USER_ROLES: {
    ADMIN: 'admin',
    EDITOR: 'editor',
    AUTHOR: 'author',
    VIEWER: 'viewer',
  },

  // API token types
  TOKEN_TYPES: {
    READ_ONLY: 'read-only',
    FULL_ACCESS: 'full-access',
  },

  // Relation types
  RELATION_TYPES: {
    ONE_TO_ONE: 'one-to-one',
    ONE_TO_MANY: 'one-to-many',
    MANY_TO_ONE: 'many-to-one',
    MANY_TO_MANY: 'many-to-many',
  },

  // Media types
  MEDIA_TYPES: {
    IMAGE: 'image',
    VIDEO: 'video',
    FILE: 'file',
    ALL: 'all',
  },

  // Component categories
  COMPONENT_CATEGORIES: [
    'Layout',
    'Content',
    'SEO',
    'Navigation',
    'Forms',
    'Media',
    'Social',
    'Custom',
  ],

  // Supported locales
  SUPPORTED_LOCALES: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
  ],

  // Timezones
  COMMON_TIMEZONES: [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Rome',
    'Europe/Madrid',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney',
  ],

  // Export/Import
  EXPORT_VERSION: '1.0.0',
  EXPORT_FORMAT: 'json',

  // Error messages
  ERROR_MESSAGES: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_URL: 'Please enter a valid URL',
    PASSWORD_TOO_SHORT: `Password must be at least ${8} characters`,
    PASSWORD_TOO_LONG: `Password must be less than ${128} characters`,
    TEXT_TOO_LONG: `Text must be less than ${1000} characters`,
    LONG_TEXT_TOO_LONG: `Text must be less than ${10000} characters`,
    RICH_TEXT_TOO_LONG: `Content must be less than ${50000} characters`,
    INVALID_NUMBER: 'Please enter a valid number',
    NUMBER_TOO_SMALL: 'Number is too small',
    NUMBER_TOO_LARGE: 'Number is too large',
    INVALID_DATE: 'Please enter a valid date',
    INVALID_TIME: 'Please enter a valid time',
    INVALID_PATTERN: 'Value does not match required pattern',
    FILE_TOO_LARGE: 'File size exceeds maximum allowed size',
    INVALID_FILE_TYPE: 'File type is not allowed',
    COMPONENT_NOT_FOUND: 'Component not found',
    CONTENT_TYPE_NOT_FOUND: 'Content type not found',
    ENTRY_NOT_FOUND: 'Entry not found',
    MEDIA_NOT_FOUND: 'Media file not found',
    DUPLICATE_NAME: 'Name already exists',
    INVALID_API_ID: 'API ID must contain only lowercase letters, numbers, and hyphens',
    CIRCULAR_DEPENDENCY: 'Circular dependency detected',
    COMPONENT_IN_USE: 'Cannot delete component that is in use',
    CONTENT_TYPE_IN_USE: 'Cannot delete content type that has entries',
  },

  // Success messages
  SUCCESS_MESSAGES: {
    SAVED: 'Changes saved successfully',
    PUBLISHED: 'Content published successfully',
    UNPUBLISHED: 'Content unpublished successfully',
    DELETED: 'Item deleted successfully',
    CREATED: 'Item created successfully',
    UPDATED: 'Item updated successfully',
    DUPLICATED: 'Item duplicated successfully',
    IMPORTED: 'Data imported successfully',
    EXPORTED: 'Data exported successfully',
    UPLOADED: 'File uploaded successfully',
    SETTINGS_SAVED: 'Settings saved successfully',
  },

  // Loading messages
  LOADING_MESSAGES: {
    SAVING: 'Saving...',
    PUBLISHING: 'Publishing...',
    DELETING: 'Deleting...',
    UPLOADING: 'Uploading...',
    LOADING: 'Loading...',
    EXPORTING: 'Exporting...',
    IMPORTING: 'Importing...',
  },
} as const;

// Helper functions
export const getStorageKey = (key: keyof typeof CMS_CONSTANTS.STORAGE_KEYS): string => {
  return CMS_CONSTANTS.STORAGE_KEYS[key];
};

export const getDefaultLocale = (): string => {
  return CMS_CONSTANTS.DEFAULTS.DEFAULT_LOCALE;
};

export const getStatusColor = (status: string): string => {
  return CMS_CONSTANTS.STATUS_COLORS[status as keyof typeof CMS_CONSTANTS.STATUS_COLORS] || 'gray';
};

export const getErrorMessage = (code: keyof typeof CMS_CONSTANTS.ERROR_MESSAGES): string => {
  return CMS_CONSTANTS.ERROR_MESSAGES[code];
};

export const getSuccessMessage = (code: keyof typeof CMS_CONSTANTS.SUCCESS_MESSAGES): string => {
  return CMS_CONSTANTS.SUCCESS_MESSAGES[code];
};

export const getLoadingMessage = (code: keyof typeof CMS_CONSTANTS.LOADING_MESSAGES): string => {
  return CMS_CONSTANTS.LOADING_MESSAGES[code];
};
