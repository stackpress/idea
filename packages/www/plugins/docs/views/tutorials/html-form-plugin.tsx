//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, P, SS, C, Nav } from '../../components/index.js';
import Layout from '../../components/Layout.js';
import Code from '../../components/Code.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('HTML Form Plugin Tutorial');
  const description = _(
    'A comprehensive guide to creating a plugin that generates HTML forms from processed .idea schema definitions'
  );
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content="/images/idea-logo-icon.png" />
      <meta property="og:url" content={request.url.pathname} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content="/images/idea-logo-icon.png" />

      <link rel="icon" type="image/x-icon" href="/icon.png" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  )
}

export function Right() {
  const { _ } = useLanguage();
  return (
    <menu className="px-m-0 px-px-10 px-py-20 px-h-100-40 overflow-auto">
      <h6 className="theme-muted px-fs-14 px-mb-0 px-mt-0 px-pb-10 uppercase">
        {_('On this page')}
      </h6>
      <nav className="px-m-14 px-lh-32">
        <a href="#1-overview" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('1. Overview')}
        </a>
        <a href="#2-prerequisites" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('2. Prerequisites')}
        </a>
        <a href="#3-understanding-the-schema-structure" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('3. Understanding the Schema Structure')}
        </a>
        <a href="#4-create-the-plugin-structure" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('4. Create the Plugin Structure')}
        </a>
        <a href="#5-implement-form-element-generation" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('5. Implement Form Element Generation')}
        </a>
        <a href="#6-implement-form-layout-and-styling" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('6. Implement Form Layout and Styling')}
        </a>
        <a href="#7-generate-complete-html-document" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('7. Generate Complete HTML Document')}
        </a>
        <a href="#8-usage-in-schema" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('8. Usage in Schema')}
        </a>
        <a href="#9-generated-output" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('9. Generated Output')}
        </a>
        <a href="#10-error-handling-and-best-practices" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('10. Error Handling and Best Practices')}
        </a>
      </nav>
    </menu>
  );
}



export function Body() {
  const examples = [
    `// Example processed schema
{
  model: {
    User: {
      mutable: false,
      columns: [
        {
          name: 'name',
          type: 'String',
          required: true,
          multiple: false,
          attributes: {
            field: { input: { type: 'text', placeholder: 'Enter your name' } },
            label: 'Full Name',
            is: { required: true, minLength: 2, maxLength: 50 }
          }
        },
        {
          name: 'email',
          type: 'String',
          required: true,
          multiple: false,
          attributes: {
            field: { input: { type: 'email' } },
            label: 'Email Address',
            is: { required: true, email: true }
          }
        },
        {
          name: 'age',
          type: 'Number',
          required: false,
          multiple: false,
          attributes: {
            field: { number: { min: 18, max: 100 } },
            label: 'Age',
            is: { min: 18, max: 100 }
          }
        },
        {
          name: 'role',
          type: 'UserRole',
          required: true,
          multiple: false,
          attributes: {
            field: { select: true },
            label: 'User Role',
            default: 'USER'
          }
        }
      ]
    }
  },
  enum: {
    UserRole: {
      ADMIN: 'Administrator',
      USER: 'Regular User',
      GUEST: 'Guest User'
    }
  }
}`,
    `import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

interface HTMLFormConfig {
  output: string;
  title?: string;
  theme?: 'bootstrap' | 'tailwind' | 'custom';
  layout?: 'vertical' | 'horizontal' | 'inline';
  includeCSS?: boolean;
  includeJS?: boolean;
  submitUrl?: string;
  method?: 'GET' | 'POST';
}

export default async function htmlFormPlugin(
  props: PluginProps<{ config: HTMLFormConfig }>
) {
  const { config, schema, transformer, cwd } = props;

  // Validate configuration
  if (!config.output) {
    throw new Error('HTML Form Plugin requires "output" configuration');
  }

  // Set defaults
  const options = {
    title: config.title || 'Generated Form',
    theme: config.theme || 'bootstrap',
    layout: config.layout || 'vertical',
    includeCSS: config.includeCSS !== false,
    includeJS: config.includeJS !== false,
    submitUrl: config.submitUrl || '#',
    method: config.method || 'POST',
    ...config
  };

  // Generate HTML content
  const htmlContent = generateHTML(schema, options);

  // Write to output file
  const outputPath = await transformer.loader.absolute(config.output);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, htmlContent, 'utf8');

  console.log(\`✅ HTML form generated: \${outputPath}\`);
}`,
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

function generateCheckboxElement(column: any, checkboxConfig: any, options: any): string {
  const { name, attributes = {} } = column;
  const defaultValue = attributes.default || false;
  const label = checkboxConfig.label || 'Check this box';

  let checkbox = \`<div class="\${getCheckboxWrapperClasses(options.theme)}">\\n\`;
  checkbox += \`    <input type="checkbox" \`;
  checkbox += \`id="\${name}" name="\${name}" \`;
  checkbox += \`class="\${getCheckboxClasses(options.theme)}" \`;
  checkbox += \`value="true" \`;

  if (defaultValue) {
    checkbox += 'checked ';
  }

  checkbox += '/>\\n';
  checkbox += \`    <label for="\${name}" class="\${getCheckboxLabelClasses(options.theme)}">\${escapeHtml(label)}</label>\\n\`;
  checkbox += '  </div>';

  return checkbox;
}

function generateRadioElement(column: any, schema: any, radioConfig: any, options: any): string {
  const { name, type, attributes = {} } = column;
  const defaultValue = attributes.default || '';

  let radio = \`<div class="\${getRadioGroupClasses(options.theme)}">\\n\`;

  // Generate radio options
  if (schema.enum && schema.enum[type]) {
    // Enum-based options
    const enumValues = schema.enum[type];
    for (const [key, value] of Object.entries(enumValues)) {
      const checked = defaultValue === key ? ' checked' : '';
      radio += \`    <div class="\${getRadioWrapperClasses(options.theme)}">\\n\`;
      radio += \`      <input type="radio" \`;
      radio += \`id="\${name}_\${key}" name="\${name}" \`;
      radio += \`class="\${getRadioClasses(options.theme)}" \`;
      radio += \`value="\${key}"\${checked} />\\n\`;
      radio += \`      <label for="\${name}_\${key}" class="\${getRadioLabelClasses(options.theme)}">\${escapeHtml(value)}</label>\\n\`;
      radio += '    </div>\\n';
    }
  } else if (radioConfig.options) {
    // Custom options
    for (const option of radioConfig.options) {
      const value = typeof option === 'string' ? option : option.value;
      const label = typeof option === 'string' ? option : option.label;
      const checked = defaultValue === value ? ' checked' : '';
      radio += \`    <div class="\${getRadioWrapperClasses(options.theme)}">\\n\`;
      radio += \`      <input type="radio" \`;
      radio += \`id="\${name}_\${value}" name="\${name}" \`;
      radio += \`class="\${getRadioClasses(options.theme)}" \`;
      radio += \`value="\${value}"\${checked} />\\n\`;
      radio += \`      <label for="\${name}_\${value}" class="\${getRadioLabelClasses(options.theme)}">\${escapeHtml(label)}</label>\\n\`;
      radio += '    </div>\\n';
    }
  }

  radio += '  </div>';

  return radio;
}

function generateFileElement(column: any, fileConfig: any, options: any): string {
  const { name, required } = column;
  const accept = fileConfig.accept || '';
  const multiple = fileConfig.multiple || false;

  let file = \`<input type="file" \`;
  file += \`id="\${name}" name="\${name}" \`;
  file += \`class="\${getFileClasses(options.theme)}" \`;

  if (accept) {
    file += \`accept="\${accept}" \`;
  }

  if (multiple) {
    file += 'multiple ';
  }

  if (required) {
    file += 'required ';
  }

  file += '/>';

  return file;
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
}`,
    `function wrapFormGroup(element: string, label: string, name: string, required: boolean, validation: any, options: any): string {
  const requiredMark = required ? ' <span class="required">*</span>' : '';
  const helpText = generateHelpText(validation);

  switch (options.theme) {
    case 'bootstrap':
      return wrapBootstrapFormGroup(element, label, name, requiredMark, helpText, options);
    case 'tailwind':
      return wrapTailwindFormGroup(element, label, name, requiredMark, helpText, options);
    default:
      return wrapCustomFormGroup(element, label, name, requiredMark, helpText, options);
  }
}

function wrapBootstrapFormGroup(element: string, label: string, name: string, requiredMark: string, helpText: string, options: any): string {
  let group = '';

  if (options.layout === 'horizontal') {
    group += '  <div class="row mb-3">\\n';
    group += \`    <label for="\${name}" class="col-sm-3 col-form-label">\${escapeHtml(label)}\${requiredMark}</label>\\n\`;
    group += '    <div class="col-sm-9">\\n';
    group += \`      \${element}\\n\`;
    if (helpText) {
      group += \`      <div class="form-text">\${helpText}</div>\\n\`;
    }
    group += '    </div>\\n';
    group += '  </div>\\n';
  } else {
    group += '  <div class="mb-3">\\n';
    group += \`    <label for="\${name}" class="form-label">\${escapeHtml(label)}\${requiredMark}</label>\\n\`;
    group += \`    \${element}\\n\`;
    if (helpText) {
      group += \`    <div class="form-text">\${helpText}</div>\\n\`;
    }
    group += '  </div>\\n';
  }

  return group;
}

function wrapTailwindFormGroup(element: string, label: string, name: string, requiredMark: string, helpText: string, options: any): string {
  let group = '';

  if (options.layout === 'horizontal') {
    group += '  <div class="flex flex-wrap items-center mb-4">\\n';
    group += \`    <label for="\${name}" class="w-full md:w-1/3 mb-2 md:mb-0 text-sm font-medium text-gray-700">\${escapeHtml(label)}\${requiredMark}</label>\\n\`;
    group += '    <div class="w-full md:w-2/3">\\n';
    group += \`      \${element}\\n\`;
    if (helpText) {
      group += \`      <p class="mt-1 text-sm text-gray-500">\${helpText}</p>\\n\`;
    }
    group += '    </div>\\n';
    group += '  </div>\\n';
  } else {
    group += '  <div class="mb-4">\\n';
    group += \`    <label for="\${name}" class="block text-sm font-medium text-gray-700 mb-2">\${escapeHtml(label)}\${requiredMark}</label>\\n\`;
    group += \`    \${element}\\n\`;
    if (helpText) {
      group += \`    <p class="mt-1 text-sm text-gray-500">\${helpText}</p>\\n\`;
    }
    group += '  </div>\\n';
  }

  return group;
}

function wrapCustomFormGroup(element: string, label: string, name: string, requiredMark: string, helpText: string, options: any): string {
  let group = '  <div class="form-group">\\n';
  group += \`    <label for="\${name}">\${escapeHtml(label)}\${requiredMark}</label>\\n\`;
  group += \`    \${element}\\n\`;
  if (helpText) {
    group += \`    <div class="help-text">\${helpText}</div>\\n\`;
  }
  group += '  </div>\\n';

  return group;
}

// CSS class generators for different themes
function getInputClasses(theme: string): string {
  switch (theme) {
    case 'bootstrap':
      return 'form-control';
    case 'tailwind':
      return 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500';
    default:
      return 'form-input';
  }
}

function getSelectClasses(theme: string): string {
  switch (theme) {
    case 'bootstrap':
      return 'form-select';
    case 'tailwind':
      return 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500';
    default:
      return 'form-select';
  }
}

function getTextareaClasses(theme: string): string {
  switch (theme) {
    case 'bootstrap':
      return 'form-control';
    case 'tailwind':
      return 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500';
    default:
      return 'form-textarea';
  }
}

function getCheckboxClasses(theme: string): string {
  switch (theme) {
    case 'bootstrap':
      return 'form-check-input';
    case 'tailwind':
      return 'h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded';
    default:
      return 'form-checkbox';
  }
}

function getRadioClasses(theme: string): string {
  switch (theme) {
    case 'bootstrap':
      return 'form-check-input';
    case 'tailwind':
      return 'h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300';
    default:
      return 'form-radio';
  }
}

function getFileClasses(theme: string): string {
  switch (theme) {
    case 'bootstrap':
      return 'form-control';
    case 'tailwind':
      return 'block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100';
    default:
      return 'form-file';
  }
}`,
    `function generateHTML(schema: any, options: any): string {
  let html = generateHTMLHeader(options);

  // Generate forms for each model
  if (schema.model) {
    for (const [modelName, model] of Object.entries(schema.model)) {
      html += generateFormHTML(modelName, model, schema, options);
      html += '\\n';
    }
  }

  html += generateHTMLFooter(options);

  return html;
}

function generateHTMLHeader(options: any): string {
  let html = '<!DOCTYPE html>\\n';
  html += '<html lang="en">\\n';
  html += '<head>\\n';
  html += '  <meta charset="UTF-8">\\n';
  html += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\\n';
  html += \`  <title>\${escapeHtml(options.title)}</title>\\n\`;

  // Include CSS
  if (options.includeCSS) {
    html += generateCSS(options);
  }

  html += '</head>\\n';
  html += '<body>\\n';
  html += '<div class="container">\\n';
  html += \`  <h1>\${escapeHtml(options.title)}</h1>\\n\`;

  return html;
}

function generateFormHTML(modelName: string, model: any, schema: any, options: any): string {
  let html = \`<div class="form-container">\\n\`;
  html += \`  <h2>\${escapeHtml(modelName)} Form</h2>\\n\`;
  html += \`  <form action="\${options.submitUrl}" method="\${options.method}" class="\${getFormClasses(options.theme)}">\\n\`;

  // Generate form fields
  for (const column of model.columns || []) {
    // Skip hidden fields or system fields
    if (column.attributes?.list?.hide || column.attributes?.view?.hide) {
      continue;
    }

    html += generateFormElement(column, schema, options);
  }

  // Add submit button
  html += generateSubmitButton(options);

  html += '  </form>\\n';
  html += '</div>\\n';

  return html;
}

function generateSubmitButton(options: any): string {
  let button = '  <div class="';

  switch (options.theme) {
    case 'bootstrap':
      button += 'mb-3">\\n';
      button += '    <button type="submit" class="btn btn-primary">Submit</button>\\n';
      button += '    <button type="reset" class="btn btn-secondary ms-2">Reset</button>\\n';
      break;
    case 'tailwind':
      button += 'mt-6">\\n';
      button += '    <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">Submit</button>\\n';
      button += '    <button type="reset" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">Reset</button>\\n';
      break;
    default:
      button += 'form-actions">\\n';
      button += '    <button type="submit" class="btn-primary">Submit</button>\\n';
      button += '    <button type="reset" class="btn-secondary">Reset</button>\\n';
  }

  button += '  </div>\\n';

  return button;
}

function generateHTMLFooter(options: any): string {
  let html = '</div>\\n';

  // Include JavaScript
  if (options.includeJS) {
    html += generateJavaScript(options);
  }

  html += '</body>\\n';
  html += '</html>\\n';

  return html;
}

function generateCSS(options: any): string {
  let css = '';

  switch (options.theme) {
    case 'bootstrap':
      css += '  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">\\n';
      break;
    case 'tailwind':
      css += '  <script src="https://cdn.tailwindcss.com"></script>\\n';
      break;
    default:
      css += '  <style>\\n';
      css += generateCustomCSS();
      css += '  </style>\\n';
  }

  return css;
}

function generateCustomCSS(): string {
  return \`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-container {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    .required {
      color: #e74c3c;
    }

    .form-input,
    .form-select,
    .form-textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
    }

    .form-checkbox,
    .form-radio {
      margin-right: 8px;
    }

    .help-text {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }

    .form-actions {
      margin-top: 30px;
    }

    .btn-primary,
    .btn-secondary {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      margin-right: 10px;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background: #2980b9;
    }

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background: #7f8c8d;
    }
  \`;
}

function generateJavaScript(options: any): string {
  let js = '';

  switch (options.theme) {
    case 'bootstrap':
      js += '  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>\\n';
      break;
  }

  // Add form validation JavaScript
  js += '  <script>\\n';
  js += generateFormValidationJS();
  js += '  </script>\\n';

  return js;
}

function generateFormValidationJS(): string {
  return \`
    // Form validation and enhancement
    document.addEventListener('DOMContentLoaded', function() {
      const forms = document.querySelectorAll('form');

      forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
          if (!validateForm(form)) {
            e.preventDefault();
            return false;
          }
        });
      });

      function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

        inputs.forEach(function(input) {
          if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
          } else {
            clearError(input);
          }
        });

        return isValid;
      }

      function showError(input, message) {
        clearError(input);
        input.classList.add('error');

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';

        input.parentNode.appendChild(errorDiv);
      }

      function clearError(input) {
        input.classList.remove('error');
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
          errorMessage.remove();
        }
      }
    });
  \`;
}

// Utility functions
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function generateHelpText(validation: any): string {
  const hints: string[] = [];

  if (validation.minLength) {
    hints.push(\`Minimum \${validation.minLength} characters\`);
  }
  if (validation.maxLength) {
    hints.push(\`Maximum \${validation.maxLength} characters\`);
  }
  if (validation.min) {
    hints.push(\`Minimum value: \${validation.min}\`);
  }
  if (validation.max) {
    hints.push(\`Maximum value: \${validation.max}\`);
  }
  if (validation.pattern) {
    hints.push('Must match the required format');
  }

  return hints.length > 0 ? hints.join('. ') : '';
}

function getFormClasses(theme: string): string {
  switch (theme) {
    case 'bootstrap':
      return 'needs-validation';
    case 'tailwind':
      return 'space-y-4';
    default:
      return 'form';
  }
}

function getCheckboxWrapperClasses(theme: string): string {
  switch (theme) {
    case 'bootstrap':
      return 'form-check';
    case 'tailwind':
      return 'flex items-center';
    default:
      return 'checkbox-wrapper';
  }
}

function getCheckboxLabelClasses(theme: string): string {
  switch (theme) {
    case 'bootstrap':
      return 'form-check-label';
    case 'tailwind':
      return 'ml-2 text-sm text-gray-700';
    default:
      return 'checkbox-label';
  }
}

function getRadioGroupClasses(theme: string): string {
  switch (theme) {
    case 'bootstrap':
      return '';
    case 'tailwind':
      return 'space-y-2';
    default:
      return 'radio-group';
  }
}

function getRadioWrapperClasses(theme: string): string {
  switch (theme) {
    case 'bootstrap':
      return 'form-check';
    case 'tailwind':
      return 'flex items-center';
    default:
      return 'radio-wrapper';
  }
}

function getRadioLabelClasses(theme: string): string {
  switch (theme) {
    case 'bootstrap':
      return 'form-check-label';
    case 'tailwind':
      return 'ml-2 text-sm text-gray-700';
    default:
      return 'radio-label';
  }
}`,
    `// schema.idea
plugin "./plugins/html-form-plugin.js" {
  output "./forms/user-form.html"
  title "User Registration Form"
  theme "bootstrap"
  layout "vertical"
  includeCSS true
  includeJS true
  submitUrl "/api/users"
  method "POST"
}

model User {
  name String @label("Full Name") @field.input(Text) @is.required @is.minLength(2) @is.maxLength(50)
  email String @label("Email Address") @field.input(Email) @is.required @is.email
  age Number @label("Age") @field.number @is.min(18) @is.max(100)
  role UserRole @label("User Role") @field.select @default("USER")
  bio String @label("Biography") @field.textarea @is.maxLength(500)
  active Boolean @label("Active Account") @field.checkbox @default(true)
  created Date @label("Registration Date") @field.date @default("now()")
}

enum UserRole {
  ADMIN "Administrator"
  USER "Regular User"
  GUEST "Guest User"
}`,
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Registration Form</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container">
  <h1>User Registration Form</h1>
  <div class="form-container">
    <h2>User Form</h2>
    <form action="/api/users" method="POST" class="needs-validation">
      <div class="mb-3">
        <label for="name" class="form-label">Full Name <span class="required">*</span></label>
        <input type="text" id="name" name="name" class="form-control" required minlength="2" maxlength="50" />
        <div class="form-text">Minimum 2 characters. Maximum 50 characters</div>
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email Address <span class="required">*</span></label>
        <input type="email" id="email" name="email" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="age" class="form-label">Age</label>
        <input type="number" id="age" name="age" class="form-control" min="18" max="100" />
        <div class="form-text">Minimum value: 18. Maximum value: 100</div>
      </div>

      <div class="mb-3">
        <label for="role" class="form-label">User Role <span class="required">*</span></label>
        <select id="role" name="role" class="form-select" required>
          <option value="ADMIN">Administrator</option>
          <option value="USER" selected>Regular User</option>
          <option value="GUEST">Guest User</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="bio" class="form-label">Biography</label>
        <textarea id="bio" name="bio" class="form-control" rows="4" cols="50" maxlength="500"></textarea>
        <div class="form-text">Maximum 500 characters</div>
      </div>

      <div class="form-check">
        <input type="checkbox" id="active" name="active" class="form-check-input" value="true" checked />
        <label for="active" class="form-check-label">Active Account</label>
      </div>

      <div class="mb-3">
        <button type="submit" class="btn btn-primary">Submit</button>
        <button type="reset" class="btn btn-secondary ms-2">Reset</button>
      </div>
    </form>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
// Form validation and enhancement
document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('form');

  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      if (!validateForm(form)) {
        e.preventDefault();
        return false;
      }
    });
  });

  function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    inputs.forEach(function(input) {
      if (!input.value.trim()) {
        showError(input, 'This field is required');
        isValid = false;
      } else {
        clearError(input);
      }
    });

    return isValid;
  }

  function showError(input, message) {
    clearError(input);
    input.classList.add('error');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';

    input.parentNode.appendChild(errorDiv);
  }

  function clearError(input) {
    input.classList.remove('error');
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }
});
</script>
</body>
</html>`,
    `export default async function htmlFormPlugin(props: PluginProps<{}>) {
  const { config, schema, transformer, cwd } = props;

  try {
    // Validate configuration
    validateConfig(config);

    // Validate schema has models
    if (!schema.model || Object.keys(schema.model).length === 0) {
      console.warn('⚠️  No models found in schema. Skipping HTML form generation.');
      return;
    }

    // Generate HTML
    const htmlContent = generateHTML(schema, config);

    // Ensure output directory exists
    const outputPath = await transformer.loader.absolute(config.output);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Write file
    await fs.writeFile(outputPath, htmlContent, 'utf8');

    console.log(\`✅ HTML form generated: \${outputPath}\`);
    console.log(\`📊 Generated forms for \${Object.keys(schema.model).length} model(s)\`);

  } catch (error) {
    console.error(\`❌ HTML Form Plugin failed: \${error.message}\`);
    throw error;
  }
}

function validateConfig(config: any): void {
  if (!config.output) {
    throw new Error('HTML Form Plugin requires "output" configuration');
  }

  if (config.theme && !['bootstrap', 'tailwind', 'custom'].includes(config.theme)) {
    throw new Error(\`Unsupported theme: \${config.theme}\`);
  }

  if (config.layout && !['vertical', 'horizontal', 'inline'].includes(config.layout)) {
    throw new Error(\`Unsupported layout: \${config.layout}\`);
  }

  if (config.method && !['GET', 'POST'].includes(config.method)) {
    throw new Error(\`Unsupported HTTP method: \${config.method}\`);
  }
}`
  ];

  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Tutorial: Creating an HTML Form Plugin</H1>
      <P>
        This tutorial will guide you through creating a plugin that generates HTML forms from a processed <C>.idea</C> schema. You'll learn how to parse schema models, generate appropriate form elements, handle validation, and create responsive forms with multiple CSS framework support.
      </P>

      <section id="1-overview">
        <H2>1. Overview</H2>
        <P>
          This section provides an overview of what the HTML Form Plugin accomplishes and its key features. The plugin transforms schema definitions into fully functional HTML forms with proper validation, styling, and accessibility features.
        </P>
        <P>
          The HTML Form Plugin will:
        </P>
        <ul>
          <li>Parse schema models and their columns</li>
          <li>Generate HTML form elements based on field types and attributes</li>
          <li>Include validation attributes and constraints</li>
          <li>Create responsive, accessible forms with proper styling</li>
          <li>Support different form layouts and themes</li>
        </ul>
      </section>

      <section id="2-prerequisites">
        <H2>2. Prerequisites</H2>
        <P>
          Before starting this tutorial, ensure you have the necessary knowledge and tools to successfully implement the HTML Form Plugin. These prerequisites will help you understand the concepts and follow along with the implementation.
        </P>
        <ul>
          <li>Basic understanding of <SS>TypeScript/JavaScript</SS></li>
          <li>Familiarity with HTML forms and CSS</li>
          <li>Understanding of the <C>idea-transformer</C> plugin system</li>
        </ul>
      </section>

      <section id="3-understanding-the-schema-structure">
        <H2>3. Understanding the Schema Structure</H2>
        <P>
          Understanding how schema attributes map to form elements is crucial for creating effective form generation. This section explains the processed schema structure and how different field types and attributes translate into HTML form elements.
        </P>
        <P>
          Before creating the plugin, let's understand how schema attributes map to form elements:
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[0]}
        </Code>
      </section>

      <section id="4-create-the-plugin-structure">
        <H2>4. Create the Plugin Structure</H2>
        <P>
          The plugin structure provides the foundation for the HTML form generator. This section covers the main plugin function, configuration interface, and the basic workflow for processing schemas and generating HTML output.
        </P>
        <P>
          Create a new file <C>html-form-plugin.js</C>:
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[1]}
        </Code>
      </section>

      <section id="5-implement-form-element-generation">
        <H2>5. Implement Form Element Generation</H2>
        <P>
          Form element generation is the core functionality of the plugin. This section demonstrates how to create functions that generate different types of HTML form elements based on schema column definitions, including inputs, textareas, selects, checkboxes, radio buttons, and file inputs.
        </P>
        <P>
          Create functions to generate different form elements:
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[2]}
        </Code>
      </section>

      <section id="6-implement-form-layout-and-styling">
        <H2>6. Implement Form Layout and Styling</H2>
        <P>
          Form layout and styling ensure that generated forms are visually appealing and work well with different CSS frameworks. This section covers how to implement support for Bootstrap, Tailwind CSS, and custom styling, along with different layout options like vertical, horizontal, and inline forms.
        </P>
        <P>
          Create functions for different themes and layouts:
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[3]}
        </Code>
      </section>

      <section id="7-generate-complete-html-document">
        <H2>7. Generate Complete HTML Document</H2>
        <P>
          Generating a complete HTML document involves combining all form elements into a properly structured HTML page. This section shows how to create the HTML structure, include necessary CSS and JavaScript files, and generate forms for multiple models within a single document.
        </P>
        <P>
          Implement the main HTML generation function:
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[4]}
        </Code>
      </section>

      <section id="8-usage-in-schema">
        <H2>8. Usage in Schema</H2>
        <P>
          This section demonstrates how to configure and use the HTML Form Plugin within your <C>.idea</C> schema files. You'll learn about the available configuration options and how to set up your schema to generate the desired form output.
        </P>
        <P>
          To use this plugin in your schema file:
        </P>
        <Code copy language='idea' className='bg-black text-white'>
          {examples[5]}
        </Code>
      </section>

      <section id="9-generated-output">
        <H2>9. Generated Output</H2>
        <P>
          The generated output section shows examples of the HTML code that the plugin produces. This helps you understand what to expect from the plugin and how the various configuration options affect the final output.
        </P>
        <P>
          The plugin will generate HTML like this:
        </P>
        <Code copy language='html' className='bg-black text-white'>
          {examples[6]}
        </Code>
      </section>

      <section id="10-error-handling-and-best-practices">
        <H2>10. Error Handling and Best Practices</H2>
        <P>
          Proper error handling and following best practices ensure that your plugin is robust and reliable. This section covers validation techniques, error reporting, and recommended patterns for plugin development.
        </P>
        <P>
          Add proper error handling and validation:
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[7]}
        </Code>
      </section>

      <Nav
        prev={{ text: 'MySQL Table Plugin', href: '/docs/tutorials/mysql-table-plugin' }}
        next={{ text: 'Markdown Documentation Plugin', href: '/docs/tutorials/markdown-documentation-plugin' }}
      />
    </main>
  );
}

export default function Page(props: ServerPageProps<ServerConfigProps>) {
  const { data, session, request, response } = props;
  return (
    <Layout
      data={data}
      session={session}
      request={request}
      response={response}
      right={<Right />}
    >
      <Body />
    </Layout>
  );
}
