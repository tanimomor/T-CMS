import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, Locale, ApiToken, Webhook, UIConfig } from '@/cms/lib/types';
import { CMS_CONSTANTS } from '@/cms/config/constants';

interface SettingsState {
  settings: Settings;
  apiTokens: ApiToken[];
  webhooks: Webhook[];
  uiConfig: UIConfig;
  isLoading: boolean;
  error: string | null;
}

interface SettingsActions {
  // Settings operations
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
  
  // Locale operations
  addLocale: (locale: Locale) => void;
  removeLocale: (localeCode: string) => void;
  updateLocale: (localeCode: string, updates: Partial<Locale>) => void;
  setDefaultLocale: (localeCode: string) => void;
  
  // API Token operations
  createApiToken: (token: Omit<ApiToken, 'id' | 'token' | 'createdAt'>) => ApiToken;
  updateApiToken: (id: string, updates: Partial<ApiToken>) => void;
  deleteApiToken: (id: string) => void;
  getApiToken: (id: string) => ApiToken | undefined;
  regenerateToken: (id: string) => string;
  
  // Webhook operations
  createWebhook: (webhook: Omit<Webhook, 'id' | 'createdAt'>) => Webhook;
  updateWebhook: (id: string, updates: Partial<Webhook>) => void;
  deleteWebhook: (id: string) => void;
  getWebhook: (id: string) => Webhook | undefined;
  toggleWebhook: (id: string) => void;
  
  // UI Config operations
  updateUIConfig: (updates: Partial<UIConfig>) => void;
  resetUIConfig: () => void;
  
  // Utility functions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Getters
  getActiveLocales: () => Locale[];
  getDefaultLocale: () => Locale | undefined;
  getActiveApiTokens: () => ApiToken[];
  getActiveWebhooks: () => Webhook[];
  isI18nEnabled: () => boolean;
  isDraftAndPublishEnabled: () => boolean;
}

const generateId = () => Math.random().toString(36).substr(2, 9);
const generateToken = () => Math.random().toString(36).substr(2, 32);

const defaultSettings: Settings = {
  appName: CMS_CONSTANTS.DEFAULTS.APP_NAME,
  description: '',
  defaultLocale: CMS_CONSTANTS.DEFAULTS.DEFAULT_LOCALE,
  locales: [
    {
      code: CMS_CONSTANTS.DEFAULTS.DEFAULT_LOCALE,
      name: 'English',
      isDefault: true,
    },
  ],
  timezone: CMS_CONSTANTS.DEFAULTS.TIMEZONE,
  i18nEnabled: false,
  draftAndPublishEnabled: true,
};

const defaultUIConfig: UIConfig = {
  theme: {
    primaryColor: '#7c3aed',
    secondaryColor: '#6366f1',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderColor: '#e5e7eb',
  },
  sidebarCollapsed: false,
  viewMode: 'table',
  itemsPerPage: CMS_CONSTANTS.DEFAULTS.ITEMS_PER_PAGE,
  showAdvancedFields: false,
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      apiTokens: [],
      webhooks: [],
      uiConfig: defaultUIConfig,
      isLoading: false,
      error: null,

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      resetSettings: () => {
        set({ settings: defaultSettings });
      },

      addLocale: (locale) => {
        set((state) => ({
          settings: {
            ...state.settings,
            locales: [...state.settings.locales, locale],
          },
        }));
      },

      removeLocale: (localeCode) => {
        set((state) => {
          const locales = state.settings.locales.filter((locale) => locale.code !== localeCode);
          const defaultLocale = locales.find((locale) => locale.isDefault) || locales[0];
          
          return {
            settings: {
              ...state.settings,
              locales,
              defaultLocale: defaultLocale?.code || CMS_CONSTANTS.DEFAULTS.DEFAULT_LOCALE,
            },
          };
        });
      },

      updateLocale: (localeCode, updates) => {
        set((state) => ({
          settings: {
            ...state.settings,
            locales: state.settings.locales.map((locale) =>
              locale.code === localeCode ? { ...locale, ...updates } : locale
            ),
          },
        }));
      },

      setDefaultLocale: (localeCode) => {
        set((state) => ({
          settings: {
            ...state.settings,
            locales: state.settings.locales.map((locale) => ({
              ...locale,
              isDefault: locale.code === localeCode,
            })),
            defaultLocale: localeCode,
          },
        }));
      },

      createApiToken: (tokenData) => {
        const id = generateId();
        const token = generateToken();
        
        const newToken: ApiToken = {
          ...tokenData,
          id,
          token,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          apiTokens: [...state.apiTokens, newToken],
        }));

        return newToken;
      },

      updateApiToken: (id, updates) => {
        set((state) => ({
          apiTokens: state.apiTokens.map((token) =>
            token.id === id ? { ...token, ...updates } : token
          ),
        }));
      },

      deleteApiToken: (id) => {
        set((state) => ({
          apiTokens: state.apiTokens.filter((token) => token.id !== id),
        }));
      },

      getApiToken: (id) => {
        return get().apiTokens.find((token) => token.id === id);
      },

      regenerateToken: (id) => {
        const newToken = generateToken();
        get().updateApiToken(id, { token: newToken });
        return newToken;
      },

      createWebhook: (webhookData) => {
        const id = generateId();
        
        const newWebhook: Webhook = {
          ...webhookData,
          id,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          webhooks: [...state.webhooks, newWebhook],
        }));

        return newWebhook;
      },

      updateWebhook: (id, updates) => {
        set((state) => ({
          webhooks: state.webhooks.map((webhook) =>
            webhook.id === id ? { ...webhook, ...updates } : webhook
          ),
        }));
      },

      deleteWebhook: (id) => {
        set((state) => ({
          webhooks: state.webhooks.filter((webhook) => webhook.id !== id),
        }));
      },

      getWebhook: (id) => {
        return get().webhooks.find((webhook) => webhook.id === id);
      },

      toggleWebhook: (id) => {
        set((state) => ({
          webhooks: state.webhooks.map((webhook) =>
            webhook.id === id ? { ...webhook, isActive: !webhook.isActive } : webhook
          ),
        }));
      },

      updateUIConfig: (updates) => {
        set((state) => ({
          uiConfig: { ...state.uiConfig, ...updates },
        }));
      },

      resetUIConfig: () => {
        set({ uiConfig: defaultUIConfig });
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      getActiveLocales: () => {
        return get().settings.locales;
      },

      getDefaultLocale: () => {
        return get().settings.locales.find((locale) => locale.isDefault);
      },

      getActiveApiTokens: () => {
        return get().apiTokens.filter((token) => 
          !token.expiresAt || new Date(token.expiresAt) > new Date()
        );
      },

      getActiveWebhooks: () => {
        return get().webhooks.filter((webhook) => webhook.isActive);
      },

      isI18nEnabled: () => {
        return get().settings.i18nEnabled;
      },

      isDraftAndPublishEnabled: () => {
        return get().settings.draftAndPublishEnabled;
      },
    }),
    {
      name: CMS_CONSTANTS.STORAGE_KEYS.SETTINGS,
      version: 1,
    }
  )
);
