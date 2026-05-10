/**
 * These are the only true keywords at the top level of an Idea document.
 * Keeping the list centralized avoids completion drift between the parser
 * vocabulary and the language server suggestions.
 */
export const IDEA_KEYWORDS = ['use', 'plugin', 'enum', 'prop', 'type', 'model'];

/**
 * Built-in types stay in a small allowlist so completion can prioritize
 * the common primitives without rejecting arbitrary capitalized types.
 */
export const BUILTIN_TYPES = [
  'String',
  'Text',
  'Boolean',
  'Number',
  'Integer',
  'Int',
  'Float',
  'Date',
  'Object',
  'Json'
];

/**
 * Column attributes drive most of the editing experience, so they are
 * tracked separately from declaration-level attributes.
 */
export const COLUMN_ATTRIBUTE_NAMES = [
  'id',
  'label',
  'default',
  'searchable',
  'filterable',
  'sortable',
  'unsigned',
  'insigned',
  'field.input',
  'field.password',
  'field.text',
  'field.textarea',
  'field.markdown',
  'field.select',
  'field.switch',
  'field.number',
  'list.hide',
  'list.text',
  'list.number',
  'list.date',
  'list.image',
  'list.price',
  'view.hide',
  'view.text',
  'view.number',
  'view.date',
  'view.image',
  'view.price',
  'view.yesno',
  'is.required',
  'is.option',
  'is.gt',
  'is.gte',
  'is.lt',
  'is.lte',
  'is.cgt',
  'is.clt',
  'min',
  'max',
  'step'
];

/**
 * Declaration attributes apply to models and types before the opening brace.
 */
export const DECLARATION_ATTRIBUTE_NAMES = [
  'label',
  'icon',
  'suggested'
];

/**
 * Completion and hover operate on the union of every known attribute.
 */
export const ATTRIBUTE_NAMES = [
  ...new Set([...DECLARATION_ATTRIBUTE_NAMES, ...COLUMN_ATTRIBUTE_NAMES])
];
