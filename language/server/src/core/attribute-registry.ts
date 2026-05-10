import { ATTRIBUTE_NAMES, COLUMN_ATTRIBUTE_NAMES, DECLARATION_ATTRIBUTE_NAMES } from '../shared/constants';

export type AttributeSpec = {
  name: string;
  targets: Array<'type' | 'model' | 'column' | 'prop' | 'plugin'>;
  documentation: string;
  snippet: string;
};

/**
 * A short heuristic description is enough for hover and completion detail.
 * The goal here is to explain the intent category, not to replicate the
 * whole Stackpress documentation set inside the extension.
 */
function docs(name: string) {
  if (name.startsWith('field.')) {
    return 'Configures the generated field UI for this property.';
  }
  if (name.startsWith('list.')) {
    return 'Controls how the property appears in list output.';
  }
  if (name.startsWith('view.')) {
    return 'Controls how the property appears in detail views.';
  }
  if (name.startsWith('is.')) {
    return 'Adds a validation rule to this property.';
  }
  return 'Idea attribute.';
}

/**
 * The registry is intentionally curated instead of inferred from documents.
 * Stable completion is more useful than guessing from whatever file happens
 * to be open.
 */
export const ATTRIBUTE_REGISTRY: AttributeSpec[] = ATTRIBUTE_NAMES.map(name => ({
  name,
  targets: COLUMN_ATTRIBUTE_NAMES.includes(name)
    ? ['column']
    : DECLARATION_ATTRIBUTE_NAMES.includes(name)
      ? ['type', 'model']
      : ['column', 'type', 'model', 'prop', 'plugin'],
  documentation: docs(name),
  snippet: name.includes('.') ? `@${name}` : `@${name}($1)`
}));
