import { FieldType } from '@/cms/lib/types';

export interface FieldTypeConfig {
  type: FieldType;
  label: string;
  description: string;
  icon: string;
  category: 'text' | 'number' | 'date' | 'media' | 'relation' | 'component' | 'advanced';
  hasAdvancedSettings: boolean;
  hasValidation: boolean;
  isComplex: boolean;
}

export const FIELD_TYPES: Record<FieldType, FieldTypeConfig> = {
  text: {
    type: 'text',
    label: 'Text',
    description: 'Short text input field',
    icon: 'Type',
    category: 'text',
    hasAdvancedSettings: true,
    hasValidation: true,
    isComplex: false,
  },
  longtext: {
    type: 'longtext',
    label: 'Long Text',
    description: 'Multi-line text area',
    icon: 'AlignLeft',
    category: 'text',
    hasAdvancedSettings: true,
    hasValidation: true,
    isComplex: false,
  },
  richtext: {
    type: 'richtext',
    label: 'Rich Text',
    description: 'WYSIWYG editor with formatting',
    icon: 'FileText',
    category: 'text',
    hasAdvancedSettings: true,
    hasValidation: false,
    isComplex: true,
  },
  number: {
    type: 'number',
    label: 'Number',
    description: 'Integer number input',
    icon: 'Hash',
    category: 'number',
    hasAdvancedSettings: true,
    hasValidation: true,
    isComplex: false,
  },
  decimal: {
    type: 'decimal',
    label: 'Decimal',
    description: 'Decimal number with fixed precision',
    icon: 'Percent',
    category: 'number',
    hasAdvancedSettings: true,
    hasValidation: true,
    isComplex: false,
  },
  float: {
    type: 'float',
    label: 'Float',
    description: 'Floating point number',
    icon: 'TrendingUp',
    category: 'number',
    hasAdvancedSettings: true,
    hasValidation: true,
    isComplex: false,
  },
  date: {
    type: 'date',
    label: 'Date',
    description: 'Date picker (YYYY-MM-DD)',
    icon: 'Calendar',
    category: 'date',
    hasAdvancedSettings: false,
    hasValidation: false,
    isComplex: false,
  },
  datetime: {
    type: 'datetime',
    label: 'Date & Time',
    description: 'Date and time picker',
    icon: 'Clock',
    category: 'date',
    hasAdvancedSettings: false,
    hasValidation: false,
    isComplex: false,
  },
  time: {
    type: 'time',
    label: 'Time',
    description: 'Time picker (HH:MM)',
    icon: 'Timer',
    category: 'date',
    hasAdvancedSettings: false,
    hasValidation: false,
    isComplex: false,
  },
  boolean: {
    type: 'boolean',
    label: 'Boolean',
    description: 'True/False toggle',
    icon: 'ToggleLeft',
    category: 'text',
    hasAdvancedSettings: false,
    hasValidation: false,
    isComplex: false,
  },
  email: {
    type: 'email',
    label: 'Email',
    description: 'Email address input',
    icon: 'Mail',
    category: 'text',
    hasAdvancedSettings: true,
    hasValidation: true,
    isComplex: false,
  },
  password: {
    type: 'password',
    label: 'Password',
    description: 'Password input field',
    icon: 'Lock',
    category: 'text',
    hasAdvancedSettings: true,
    hasValidation: true,
    isComplex: false,
  },
  enumeration: {
    type: 'enumeration',
    label: 'Enumeration',
    description: 'Dropdown with predefined options',
    icon: 'List',
    category: 'text',
    hasAdvancedSettings: true,
    hasValidation: true,
    isComplex: false,
  },
  media: {
    type: 'media',
    label: 'Media',
    description: 'File upload and selection',
    icon: 'Image',
    category: 'media',
    hasAdvancedSettings: true,
    hasValidation: false,
    isComplex: true,
  },
  relation: {
    type: 'relation',
    label: 'Relation',
    description: 'Link to other content entries',
    icon: 'Link',
    category: 'relation',
    hasAdvancedSettings: true,
    hasValidation: false,
    isComplex: true,
  },
  json: {
    type: 'json',
    label: 'JSON',
    description: 'JSON data structure',
    icon: 'Code',
    category: 'advanced',
    hasAdvancedSettings: false,
    hasValidation: true,
    isComplex: true,
  },
  uid: {
    type: 'uid',
    label: 'UID',
    description: 'Unique identifier (slug)',
    icon: 'Hash',
    category: 'text',
    hasAdvancedSettings: true,
    hasValidation: true,
    isComplex: false,
  },
  component: {
    type: 'component',
    label: 'Component',
    description: 'Single reusable component',
    icon: 'Puzzle',
    category: 'component',
    hasAdvancedSettings: true,
    hasValidation: false,
    isComplex: true,
  },
  'repeatable-component': {
    type: 'repeatable-component',
    label: 'Repeatable Component',
    description: 'Multiple instances of a component',
    icon: 'Layers',
    category: 'component',
    hasAdvancedSettings: true,
    hasValidation: false,
    isComplex: true,
  },
  'dynamic-zone': {
    type: 'dynamic-zone',
    label: 'Dynamic Zone',
    description: 'Flexible content blocks',
    icon: 'Layout',
    category: 'component',
    hasAdvancedSettings: true,
    hasValidation: false,
    isComplex: true,
  },
};

export const FIELD_TYPE_CATEGORIES = {
  text: {
    label: 'Text & Content',
    icon: 'Type',
    description: 'Text-based fields for content',
  },
  number: {
    label: 'Numbers',
    icon: 'Hash',
    description: 'Numeric fields',
  },
  date: {
    label: 'Date & Time',
    icon: 'Calendar',
    description: 'Date and time fields',
  },
  media: {
    label: 'Media',
    icon: 'Image',
    description: 'File and media fields',
  },
  relation: {
    label: 'Relations',
    icon: 'Link',
    description: 'Links between content',
  },
  component: {
    label: 'Components',
    icon: 'Puzzle',
    description: 'Reusable components',
  },
  advanced: {
    label: 'Advanced',
    icon: 'Settings',
    description: 'Advanced field types',
  },
};

export const getFieldTypeConfig = (type: FieldType): FieldTypeConfig => {
  return FIELD_TYPES[type];
};

export const getFieldTypesByCategory = (category: string): FieldTypeConfig[] => {
  return Object.values(FIELD_TYPES).filter(config => config.category === category);
};

export const getFieldTypeIcon = (type: FieldType): string => {
  return FIELD_TYPES[type]?.icon || 'Type';
};
