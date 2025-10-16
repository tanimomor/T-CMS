// Component Service
import { Component, FieldConfig, FieldType } from '@/cms/lib/types';
import { useComponentsStore } from '@/cms/lib/stores/components';
import { useContentTypesStore } from '@/cms/lib/stores/content-types';
import { CMS_CONSTANTS } from '@/cms/config/constants';

export class ComponentService {
  private static instance: ComponentService;
  
  private constructor() {}
  
  public static getInstance(): ComponentService {
    if (!ComponentService.instance) {
      ComponentService.instance = new ComponentService();
    }
    return ComponentService.instance;
  }

  // Component CRUD operations
  public createComponent(data: {
    name: string;
    displayName: string;
    description?: string;
    category: string;
    icon?: string;
    isRepeatable: boolean;
    minInstances?: number;
    maxInstances?: number;
    defaultInstances?: number;
  }): Component {
    const store = useComponentsStore.getState();
    
    // Validate component name uniqueness
    const existing = store.getComponentByName(data.name);
    if (existing) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.DUPLICATE_NAME);
    }

    return store.createComponent({
      name: data.name,
      displayName: data.displayName,
      description: data.description,
      category: data.category,
      icon: data.icon,
      isRepeatable: data.isRepeatable,
      minInstances: data.minInstances,
      maxInstances: data.maxInstances,
      defaultInstances: data.defaultInstances,
      fields: [],
    });
  }

  public updateComponent(id: string, updates: Partial<Component>): void {
    const store = useComponentsStore.getState();
    
    // Validate component name uniqueness if being updated
    if (updates.name) {
      const existing = store.getComponentByName(updates.name);
      if (existing && existing.id !== id) {
        throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.DUPLICATE_NAME);
      }
    }

    store.updateComponent(id, updates);
  }

  public deleteComponent(id: string): void {
    const store = useComponentsStore.getState();
    const component = store.getComponent(id);
    
    if (!component) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.COMPONENT_NOT_FOUND);
    }

    // Check if component is in use
    if (component.usageCount > 0) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.COMPONENT_IN_USE);
    }

    store.deleteComponent(id);
  }

  public getComponent(id: string): Component | undefined {
    const store = useComponentsStore.getState();
    return store.getComponent(id);
  }

  public getComponentByName(name: string): Component | undefined {
    const store = useComponentsStore.getState();
    return store.getComponentByName(name);
  }

  public getAllComponents(): Component[] {
    const store = useComponentsStore.getState();
    return store.components;
  }

  public getComponentsByCategory(category: string): Component[] {
    const store = useComponentsStore.getState();
    return store.getComponentsByCategory(category);
  }

  public getRepeatableComponents(): Component[] {
    const store = useComponentsStore.getState();
    return store.getRepeatableComponents();
  }

  public getSingleUseComponents(): Component[] {
    const store = useComponentsStore.getState();
    return store.getSingleUseComponents();
  }

  public searchComponents(query: string): Component[] {
    const store = useComponentsStore.getState();
    return store.searchComponents(query);
  }

  // Field operations
  public addField(componentId: string, field: FieldConfig): void {
    const store = useComponentsStore.getState();
    const component = store.getComponent(componentId);
    
    if (!component) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.COMPONENT_NOT_FOUND);
    }

    // Validate field name uniqueness
    const existingField = component.fields.find(f => f.name === field.name);
    if (existingField) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.DUPLICATE_NAME);
    }

    // Validate field configuration
    this.validateFieldConfig(field, componentId);

    store.addField(componentId, field);
  }

  public updateField(componentId: string, fieldName: string, updates: Partial<FieldConfig>): void {
    const store = useComponentsStore.getState();
    const component = store.getComponent(componentId);
    
    if (!component) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.COMPONENT_NOT_FOUND);
    }

    const field = component.fields.find(f => f.name === fieldName);
    if (!field) {
      throw new Error('Field not found');
    }

    // Validate field configuration if being updated
    if (updates.type || updates.name) {
      this.validateFieldConfig({ ...field, ...updates }, componentId);
    }

    store.updateField(componentId, fieldName, updates);
  }

  public removeField(componentId: string, fieldName: string): void {
    const store = useComponentsStore.getState();
    store.removeField(componentId, fieldName);
  }

  public reorderFields(componentId: string, fieldNames: string[]): void {
    const store = useComponentsStore.getState();
    store.reorderFields(componentId, fieldNames);
  }

  // Usage tracking
  public incrementUsage(componentId: string, contentTypeId: string): void {
    const store = useComponentsStore.getState();
    store.incrementUsage(componentId, contentTypeId);
  }

  public decrementUsage(componentId: string, contentTypeId: string): void {
    const store = useComponentsStore.getState();
    store.decrementUsage(componentId, contentTypeId);
  }

  public getUsageCount(componentId: string): number {
    const store = useComponentsStore.getState();
    return store.getUsageCount(componentId);
  }

  public getUsedIn(componentId: string): string[] {
    const store = useComponentsStore.getState();
    return store.getUsedIn(componentId);
  }

  public getContentTypesUsingComponent(componentId: string): any[] {
    const store = useComponentsStore.getState();
    const usedIn = store.getUsedIn(componentId);
    const contentTypesStore = useContentTypesStore.getState();
    
    return usedIn.map(id => contentTypesStore.getContentType(id)).filter(Boolean);
  }

  // Validation methods
  private validateFieldConfig(field: FieldConfig, componentId: string): void {
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

    // Check for circular dependencies
    this.checkCircularDependency(field, componentId);

    // Type-specific validations
    this.validateFieldTypeSpecific(field);
  }

  private checkCircularDependency(field: FieldConfig, componentId: string): void {
    if (field.type === 'component' || field.type === 'repeatable-component') {
      if (field.componentId === componentId) {
        throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.CIRCULAR_DEPENDENCY);
      }
      
      // Check nested dependencies
      const store = useComponentsStore.getState();
      const targetComponent = store.getComponent(field.componentId!);
      if (targetComponent) {
        this.checkNestedCircularDependency(targetComponent, componentId, new Set());
      }
    }
  }

  private checkNestedCircularDependency(component: Component, targetId: string, visited: Set<string>): void {
    if (visited.has(component.id)) return;
    visited.add(component.id);

    for (const field of component.fields) {
      if (field.type === 'component' || field.type === 'repeatable-component') {
        if (field.componentId === targetId) {
          throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.CIRCULAR_DEPENDENCY);
        }
        
        const store = useComponentsStore.getState();
        const nestedComponent = store.getComponent(field.componentId!);
        if (nestedComponent) {
          this.checkNestedCircularDependency(nestedComponent, targetId, visited);
        }
      }
    }
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
        const store = useComponentsStore.getState();
        const component = store.getComponent(field.componentId);
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
  public getCategories(): string[] {
    const components = this.getAllComponents();
    const categories = new Set(components.map(c => c.category));
    return Array.from(categories).sort();
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

  // Export/Import functionality
  public exportComponent(id: string): any {
    const component = this.getComponent(id);
    if (!component) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.COMPONENT_NOT_FOUND);
    }

    return {
      ...component,
      exportedAt: new Date().toISOString(),
      version: CMS_CONSTANTS.EXPORT_VERSION,
    };
  }

  public importComponent(componentData: any): Component {
    // Validate component data
    if (!componentData.name || !componentData.displayName || !componentData.category) {
      throw new Error('Invalid component data');
    }

    // Check if component already exists
    const existing = this.getComponentByName(componentData.name);
    if (existing) {
      throw new Error(CMS_CONSTANTS.ERROR_MESSAGES.DUPLICATE_NAME);
    }

    // Create new component
    return this.createComponent({
      name: componentData.name,
      displayName: componentData.displayName,
      description: componentData.description,
      category: componentData.category,
      icon: componentData.icon,
      isRepeatable: componentData.isRepeatable || false,
      minInstances: componentData.minInstances,
      maxInstances: componentData.maxInstances,
      defaultInstances: componentData.defaultInstances,
    });
  }

  // Statistics
  public getComponentStats(): {
    total: number;
    repeatable: number;
    singleUse: number;
    totalFields: number;
    averageFieldsPerComponent: number;
    mostUsed: Component | null;
    categories: { [key: string]: number };
  } {
    const components = this.getAllComponents();
    const totalFields = components.reduce((sum, comp) => sum + comp.fields.length, 0);
    const mostUsed = components.reduce((max, comp) => 
      comp.usageCount > (max?.usageCount || 0) ? comp : max, null as Component | null
    );
    
    const categories: { [key: string]: number } = {};
    components.forEach(comp => {
      categories[comp.category] = (categories[comp.category] || 0) + 1;
    });

    return {
      total: components.length,
      repeatable: components.filter(c => c.isRepeatable).length,
      singleUse: components.filter(c => !c.isRepeatable).length,
      totalFields,
      averageFieldsPerComponent: components.length > 0 ? totalFields / components.length : 0,
      mostUsed,
      categories,
    };
  }
}

// Export singleton instance
export const componentService = ComponentService.getInstance();
