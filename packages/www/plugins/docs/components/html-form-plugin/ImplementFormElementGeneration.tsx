//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//--------------------------------------------------------------------//

const formElementExample =
  `function generateFormElement(column: any, schema: any, options: any): string {
  const { name, type, required, attributes = {} } = column;
  const fieldConfig = attributes.field || {};
  const label = attributes.label || name;
  const validation = attributes.is || {};

  // Determine form element type
  let element = '';

  if (fieldConfig.input) {
    element = generateInputElement(column, fieldConfig.input, options);
  } else if (fieldConfig.textarea) {
    element = generateTextareaElement(column, fieldConfig.textarea, options);
  } else if (fieldConfig.select) {
    element = generateSelectElement(column, schema, fieldConfig.select, options);
  } else if (fieldConfig.checkbox) {
    element = generateCheckboxElement(column, fieldConfig.checkbox, options);
  } else if (fieldConfig.radio) {
    element = generateRadioElement(column, schema, fieldConfig.radio, options);
  } else if (fieldConfig.file) {
    element = generateFileElement(column, fieldConfig.file, options);
  } else {
    // Auto-detect based on type and attributes
    element = autoGenerateElement(column, schema, options);
  }

  // Wrap in form group
  return wrapFormGroup(element, label, name, required, validation, options);
}

function generateInputElement(column: any, inputConfig: any, options: any): string {
  const { name, required, attributes = {} } = column;
  const validation = attributes.is || {};

  const inputType = inputConfig.type || 'text';
  const placeholder = inputConfig.placeholder || '';
  const defaultValue = attributes.default || '';

  let input = \`<input type="\${inputType}" \`;
  input += \`id="\${name}" name="\${name}" \`;
  input += \`class="\${getInputClasses(options.theme)}" \`;

  if (placeholder) {
    input += \`placeholder="\${escapeHtml(placeholder)}" \`;
  }

  if (defaultValue) {
    input += \`value="\${escapeHtml(defaultValue)}" \`;
  }

  if (required) {
    input += 'required ';
  }

  // Add validation attributes
  if (validation.minLength) {
    input += \`minlength="\${validation.minLength}" \`;
  }
  if (validation.maxLength) {
    input += \`maxlength="\${validation.maxLength}" \`;
  }
  if (validation.pattern) {
    input += \`pattern="\${validation.pattern}" \`;
  }
  if (validation.min) {
    input += \`min="\${validation.min}" \`;
  }
  if (validation.max) {
    input += \`max="\${validation.max}" \`;
  }

  input += '/>';

  return input;
}

function generateTextareaElement(column: any, textareaConfig: any, options: any): string {
  const { name, required, attributes = {} } = column;
  const validation = attributes.is || {};
  const defaultValue = attributes.default || '';

  const rows = textareaConfig.rows || 4;
  const cols = textareaConfig.cols || 50;
  const placeholder = textareaConfig.placeholder || '';

  let textarea = \`<textarea \`;
  textarea += \`id="\${name}" name="\${name}" \`;
  textarea += \`class="\${getTextareaClasses(options.theme)}" \`;
  textarea += \`rows="\${rows}" cols="\${cols}" \`;

  if (placeholder) {
    textarea += \`placeholder="\${escapeHtml(placeholder)}" \`;
  }

  if (required) {
    textarea += 'required ';
  }

  // Add validation attributes
  if (validation.minLength) {
    textarea += \`minlength="\${validation.minLength}" \`;
  }
  if (validation.maxLength) {
    textarea += \`maxlength="\${validation.maxLength}" \`;
  }

  textarea += \`>\${escapeHtml(defaultValue)}</textarea>\`;

  return textarea;
}

function generateSelectElement(column: any, schema: any, selectConfig: any, options: any): string {
  const { name, type, required, attributes = {} } = column;
  const defaultValue = attributes.default || '';

  let select = \`<select \`;
  select += \`id="\${name}" name="\${name}" \`;
  select += \`class="\${getSelectClasses(options.theme)}" \`;

  if (required) {
    select += 'required ';
  }

  select += '>\\n';

  // Add empty option if not required
  if (!required) {
    select += '    <option value="">-- Select an option --</option>\\n';
  }

  // Generate options
  if (schema.enum && schema.enum[type]) {
    // Enum-based options
    const enumValues = schema.enum[type];
    for (const [key, value] of Object.entries(enumValues)) {
      const selected = defaultValue === key ? ' selected' : '';
      select += \`    <option value="\${key}"\${selected}>\${escapeHtml(value)}</option>\\n\`;
    }
  } else if (selectConfig.options) {
    // Custom options
    for (const option of selectConfig.options) {
      const value = typeof option === 'string' ? option : option.value;
      const label = typeof option === 'string' ? option : option.label;
      const selected = defaultValue === value ? ' selected' : '';
      select += \`    <option value="\${value}"\${selected}>\${escapeHtml(label)}</option>\\n\`;
    }
  }

  select += '  </select>';

  return select;
}

function autoGenerateElement(column: any, schema: any, options: any): string {
  const { type, attributes = {} } = column;

  // Auto-detect based on type
  switch (type) {
    case 'String':
      if (attributes.email) {
        return generateInputElement(column, { type: 'email' }, options);
      }
      if (attributes.password) {
        return generateInputElement(column, { type: 'password' }, options);
      }
      if (attributes.url) {
        return generateInputElement(column, { type: 'url' }, options);
      }
      if (attributes.text || attributes.textarea) {
        return generateTextareaElement(column, {}, options);
      }
      return generateInputElement(column, { type: 'text' }, options);

    case 'Number':
      return generateInputElement(column, { type: 'number' }, options);

    case 'Boolean':
      return generateCheckboxElement(column, {}, options);

    case 'Date':
      if (attributes.time) {
        return generateInputElement(column, { type: 'datetime-local' }, options);
      }
      return generateInputElement(column, { type: 'date' }, options);

    default:
      // Check if it's an enum type
      if (schema.enum && schema.enum[type]) {
        return generateSelectElement(column, schema, {}, options);
      }

      // Default to text input
      return generateInputElement(column, { type: 'text' }, options);
  }
}`;

//--------------------------------------------------------------------//

export default function ImplementFormElementGeneration() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Implement Form Element Generation Section Content */}
      <section id="implement-form-element-generation">
        <H1>{_('5. Implement Form Element Generation')}</H1>
        <P>
          <Translate>
            Form element generation is the core functionality of the
            plugin. This section demonstrates how to create functions
            that generate different types of HTML form elements based
            on schema column definitions, including inputs, textareas,
            selects, checkboxes, radio buttons, and file inputs.
          </Translate>
        </P>
        <P>
          <Translate>
            Create functions to generate different form elements:
          </Translate>
        </P>
        <Code copy language="typescript" className="bg-black text-white">
          {formElementExample}
        </Code>
      </section>
    </>
  );
}