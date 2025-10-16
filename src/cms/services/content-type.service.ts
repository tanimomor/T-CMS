// Content Type Service
import { ContentType, FieldConfig, FieldType } from '@/cms/lib/types';
import { useContentTypesStore } from '@/cms/lib/stores/content-types';
import { useComponentsStore } from '@/cms/lib/stores/components';
import { CMS_CONSTANTS } from '@/cms/config/constants';

export class ContentTypeService {
  private static instance: ContentTypeService;
  
  private constructor() {}
  
  public static getInstance(): ContentTypeService {
    if (!ContentTypeService.instance) {
      ContentTypeService.instance = new ContentTypeService();
    }
    return ContentTypeService.instance;
  }

  // Content Type CRUD operations
  public createContentType(data: {
    name: string;
    displayName: string;
    description?: string;
    kind: 'single' | 'collection';
    apiId?: string;
    draftAndPublish?: boolean;
    i18n?: boolean;
  }): ContentType {
    const store = useContentTypesStore.getState();
    
    // Validate API ID uniqueness
    const apiId = data.apiId || this.generateApiId(data.displayName);
    const existing = store.getContentTypeByApiId(apiId);
    if (existing) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.DUPLICATE_NAME);
    }

    return store.createContentType({
      name: data.name,
      displayName: data.displayName,
      description: data.description,
      kind: data.kind,
      apiId,
      draftAndPublish: data.draftAndPublish ?? true,
      i18n: data.i18n ?? false,
      fields: [],
    });
  }

  public updateContentType(id: string, updates: Partial<ContentType>): void {
    const store = useContentTypesStore.getState();
    
    // Validate API ID uniqueness if being updated
    if (updates.apiId) {
      const existing = store.getContentTypeByApiId(updates.apiId);
      if (existing && existing.id !== id) {
        throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.DUPLICATE_NAME);
      }
    }

    store.updateContentType(id, updates);
  }

  public deleteContentType(id: string): void {
    const store = useContentTypesStore.getState();
    const contentType = store.getContentType(id);
    
    if (!contentType) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.CONTENT_TYPE_NOT_FOUND);
    }

    // Check if content type has entries
    if (contentType.entryCount > 0) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.CONTENT_TYPE_IN_USE);
    }

    store.deleteContentType(id);
  }

  public getContentType(id: string): ContentType | undefined {
    const store = useContentTypesStore.getState();
    return store.getContentType(id);
  }

  public getContentTypeByApiId(apiId: string): ContentType | undefined {
    const store = useContentTypesStore.getState();
    return store.getContentTypeByApiId(apiId);
  }

  public getAllContentTypes(): ContentType[] {
    const store = useContentTypesStore.getState();
    return store.contentTypes;
  }

  public getSingleTypes(): ContentType[] {
    const store = useContentTypesStore.getState();
    return store.getSingleTypes();
  }

  public getCollectionTypes(): ContentType[] {
    const store = useContentTypesStore.getState();
    return store.getCollectionTypes();
  }

  // Field operations
  public addField(contentTypeId: string, field: FieldConfig): void {
    const store = useContentTypesStore.getState();
    const contentType = store.getContentType(contentTypeId);
    
    if (!contentType) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.CONTENT_TYPE_NOT_FOUND);
    }

    // Validate field name uniqueness
    const existingField = contentType.fields.find(f => f.name === field.name);
    if (existingField) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.DUPLICATE_NAME);
    }

    // Validate field configuration
    this.validateFieldConfig(field);

    store.addField(contentTypeId, field);
  }

  public updateField(contentTypeId: string, fieldName: string, updates: Partial<FieldConfig>): void {
    const store = useContentTypesStore.getState();
    const contentType = store.getContentType(contentTypeId);
    
    if (!contentType) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.CONTENT_TYPE_NOT_FOUND);
    }

    const field = contentType.fields.find(f => f.name === fieldName);
    if (!field) {
      throw new Error('Field not found');
    }

    // Validate field configuration if being updated
    if (updates.type || updates.name) {
      this.validateFieldConfig({ ...field, ...updates });
    }

    store.updateField(contentTypeId, fieldName, updates);
  }

  public removeField(contentTypeId: string, fieldName: string): void {
    const store = useContentTypesStore.getState();
    store.removeField(contentTypeId, fieldName);
  }

  public reorderFields(contentTypeId: string, fieldNames: string[]): void {
    const store = useContentTypesStore.getState();
    store.reorderFields(contentTypeId, fieldNames);
  }

  // Validation methods
  private validateFieldConfig(field: FieldConfig): void {
    // Validate field name
    if (!field.name || field.name.trim() === '') {
      throw new Error('Field name is required');
    }

    // Validate field name format
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(field.name)) {
      throw new Error('Field name must start with a letter and contain only letters, numbers, and underscores');
    }

    // Validate field type
    if (!field.type) {
      throw new Error('Field type is required');
    }

    // Type-specific validations
    this.validateFieldTypeSpecific(field);
  }

  private validateFieldTypeSpecific(field: FieldConfig): void {
    switch (field.type) {
      case 'enumeration':
        if (!field.enumerationValues || field.enumerationValues.length === 0) {
          throw new Error('Enumeration values are required');
        }
        break;
      
      case 'relation':
        if (!field.relationTarget) {
          throw new Error('Relation target is required');
        }
        if (!field.relationType) {
          throw new Error('Relation type is required');
        }
        break;
      
      case 'component':
      case 'repeatable-component':
        if (!field.componentId) {
          throw new Error('Component ID is required');
        }
        // Validate component exists
        const componentsStore = useComponentsStore.getState();
        const component = componentsStore.getComponent(field.componentId);
        if (!component) {
          throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.COMPONENT_NOT_FOUND);
        }
        break;
      
      case 'dynamic-zone':
        if (!field.allowedComponents || field.allowedComponents.length === 0) {
          throw new Error('Allowed components are required for dynamic zones');
        }
        break;
      
      case 'uid':
        if (!field.uidTarget) {
          throw new Error('UID target field is required');
        }
        break;
    }
  }

  // Utility methods
  private generateApiId(displayName: string): string {
    return displayName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  public validateApiId(apiId: string): boolean {
    return /^[a-z][a-z0-9-]*[a-z0-9]$/.test(apiId);
  }

  public getFieldTypes(): FieldType[] {
    return [
      'text', 'longtext', 'richtext', 'number', 'decimal', 'float',
      'date', 'datetime', 'time', 'boolean', 'email', 'password',
      'enumeration', 'media', 'relation', 'json', 'uid',
      'component', 'repeatable-component', 'dynamic-zone'
    ];
  }

  public getDefaultFieldConfig(type: FieldType): Partial<FieldConfig> {
    const defaults: Record<FieldType, Partial<FieldConfig>> = {
      text: { required: false, maxLength: 255 },
      longtext: { required: false, maxLength: 1000 },
      richtext: { required: false },
      number: { required: false },
      decimal: { required: false },
      float: { required: false },
      date: { required: false },
      datetime: { required: false },
      time: { required: false },
      boolean: { required: false, defaultValue: false },
      email: { required: false },
      password: { required: false },
      enumeration: { required: false, enumerationValues: [] },
      media: { required: false, multiple: false, mediaType: 'all' },
      relation: { required: false, relationType: 'one-to-many' },
      json: { required: false },
      uid: { required: false },
      component: { required: false },
      'repeatable-component': { required: false },
      'dynamic-zone': { required: false, allowedComponents: [] },
    };

    return defaults[type] || {};
  }

  // Statistics
  public getContentTypeStats(): {
    total: number;
    singleTypes: number;
    collectionTypes: number;
    totalFields: number;
    averageFieldsPerType: number;
  } {
    const contentTypes = this.getAllContentTypes();
    const totalFields = contentTypes.reduce((sum, ct) => sum + ct.fields.length, 0);
    
    return {
      total: contentTypes.length,
      singleTypes: contentTypes.filter(ct => ct.kind === 'single').length,
      collectionTypes: contentTypes.filter(ct => ct.kind === 'collection').length,
      totalFields,
      averageFieldsPerType: contentTypes.length > 0 ? totalFields / contentTypes.length : 0,
    };
  }
}

// Export singleton instance
export const contentTypeService = ContentTypeService.getInstance();
