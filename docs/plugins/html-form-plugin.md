# Tutorial: Creating an HTML Form Plugin

This tutorial will guide you through creating a plugin that generates HTML forms from a processed `.idea` schema.

## Overview

The HTML Form Plugin will:
- Parse schema models and their columns
- Generate HTML form elements based on field types and attributes
- Include validation attributes and constraints
- Create responsive, accessible forms with proper styling
- Support different form layouts and themes

## Prerequisites

- Basic understanding of TypeScript/JavaScript
- Familiarity with HTML forms and CSS
- Understanding of the `idea-transformer` plugin system

## Step 1: Understanding the Schema Structure

Before creating the plugin, let's understand how schema attributes map to form elements:

```typescript
// Example processed schema
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
}
```

## Step 2: Create the Plugin Structure

Create a new file `html-form-plugin.js`:

```typescript
import type { PluginProps } from '@stackpress/idea-transformer/types';
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
  
  console.log(`✅ HTML form generated: ${outputPath}`);
}
```

## Step 3: Implement Form Element Generation

Create functions to generate different form elements:

```typescript
function generateFormElement(column: any, schema: any, options: any): string {
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
  
  let input = `<input type="${inputType}" `;
  input += `id="${name}" name="${name}" `;
  input += `class="${getInputClasses(options.theme)}" `;
  
  if (placeholder) {
    input += `placeholder="${escapeHtml(placeholder)}" `;
  }
  
  if (defaultValue) {
    input += `value="${escapeHtml(defaultValue)}" `;
  }
  
  if (required) {
    input += 'required ';
  }
  
  // Add validation attributes
  if (validation.minLength) {
    input += `minlength="${validation.minLength}" `;
  }
  if (validation.maxLength) {
    input += `maxlength="${validation.maxLength}" `;
  }
  if (validation.pattern) {
    input += `pattern="${validation.pattern}" `;
  }
  if (validation.min) {
    input += `min="${validation.min}" `;
  }
  if (validation.max) {
    input += `max="${validation.max}" `;
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
  
  let textarea = `<textarea `;
  textarea += `id="${name}" name="${name}" `;
  textarea += `class="${getTextareaClasses(options.theme)}" `;
  textarea += `rows="${rows}" cols="${cols}" `;
  
  if (placeholder) {
    textarea += `placeholder="${escapeHtml(placeholder)}" `;
  }
  
  if (required) {
    textarea += 'required ';
  }
  
  // Add validation attributes
  if (validation.minLength) {
    textarea += `minlength="${validation.minLength}" `;
  }
  if (validation.maxLength) {
    textarea += `maxlength="${validation.maxLength}" `;
  }
  
  textarea += `>${escapeHtml(defaultValue)}</textarea>`;
  
  return textarea;
}

function generateSelectElement(column: any, schema: any, selectConfig: any, options: any): string {
  const { name, type, required, attributes = {} } = column;
  const defaultValue = attributes.default || '';
  
  let select = `<select `;
  select += `id="${name}" name="${name}" `;
  select += `class="${getSelectClasses(options.theme)}" `;
  
  if (required) {
    select += 'required ';
  }
  
  select += '>\n';
  
  // Add empty option if not required
  if (!required) {
    select += '    <option value="">-- Select an option --</option>\n';
  }
  
  // Generate options
  if (schema.enum && schema.enum[type]) {
    // Enum-based options
    const enumValues = schema.enum[type];
    for (const [key, value] of Object.entries(enumValues)) {
      const selected = defaultValue === key ? ' selected' : '';
      select += `    <option value="${key}"${selected}>${escapeHtml(value)}</option>\n`;
    }
  } else if (selectConfig.options) {
    // Custom options
    for (const option of selectConfig.options) {
      const value = typeof option === 'string' ? option : option.value;
      const label = typeof option === 'string' ? option : option.label;
      const selected = defaultValue === value ? ' selected' : '';
      select += `    <option value="${value}"${selected}>${escapeHtml(label)}</option>\n`;
    }
  }
  
  select += '  </select>';
  
  return select;
}

function generateCheckboxElement(column: any, checkboxConfig: any, options: any): string {
  const { name, attributes = {} } = column;
  const defaultValue = attributes.default || false;
  const label = checkboxConfig.label || 'Check this box';
  
  let checkbox = `<div class="${getCheckboxWrapperClasses(options.theme)}">\n`;
  checkbox += `    <input type="checkbox" `;
  checkbox += `id="${name}" name="${name}" `;
  checkbox += `class="${getCheckboxClasses(options.theme)}" `;
  checkbox += `value="true" `;
  
  if (defaultValue) {
    checkbox += 'checked ';
  }
  
  checkbox += '/>\n';
  checkbox += `    <label for="${name}" class="${getCheckboxLabelClasses(options.theme)}">${escapeHtml(label)}</label>\n`;
  checkbox += '  </div>';
  
  return checkbox;
}

function generateRadioElement(column: any, schema: any, radioConfig: any, options: any): string {
  const { name, type, attributes = {} } = column;
  const defaultValue = attributes.default || '';
  
  let radio = `<div class="${getRadioGroupClasses(options.theme)}">\n`;
  
  // Generate radio options
  if (schema.enum && schema.enum[type]) {
    // Enum-based options
    const enumValues = schema.enum[type];
    for (const [key, value] of Object.entries(enumValues)) {
      const checked = defaultValue === key ? ' checked' : '';
      radio += `    <div class="${getRadioWrapperClasses(options.theme)}">\n`;
      radio += `      <input type="radio" `;
      radio += `id="${name}_${key}" name="${name}" `;
      radio += `class="${getRadioClasses(options.theme)}" `;
      radio += `value="${key}"${checked} />\n`;
      radio += `      <label for="${name}_${key}" class="${getRadioLabelClasses(options.theme)}">${escapeHtml(value)}</label>\n`;
      radio += '    </div>\n';
    }
  } else if (radioConfig.options) {
    // Custom options
    for (const option of radioConfig.options) {
      const value = typeof option === 'string' ? option : option.value;
      const label = typeof option === 'string' ? option : option.label;
      const checked = defaultValue === value ? ' checked' : '';
      radio += `    <div class="${getRadioWrapperClasses(options.theme)}">\n`;
      radio += `      <input type="radio" `;
      radio += `id="${name}_${value}" name="${name}" `;
      radio += `class="${getRadioClasses(options.theme)}" `;
      radio += `value="${value}"${checked} />\n`;
      radio += `      <label for="${name}_${value}" class="${getRadioLabelClasses(options.theme)}">${escapeHtml(label)}</label>\n`;
      radio += '    </div>\n';
    }
  }
  
  radio += '  </div>';
  
  return radio;
}

function generateFileElement(column: any, fileConfig: any, options: any): string {
  const { name, required } = column;
  const accept = fileConfig.accept || '';
  const multiple = fileConfig.multiple || false;
  
  let file = `<input type="file" `;
  file += `id="${name}" name="${name}" `;
  file += `class="${getFileClasses(options.theme)}" `;
  
  if (accept) {
    file += `accept="${accept}" `;
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
}
```

## Step 4: Implement Form Layout and Styling

Create functions for different themes and layouts:

```typescript
function wrapFormGroup(element: string, label: string, name: string, required: boolean, validation: any, options: any): string {
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
    group += '  <div class="row mb-3">\n';
    group += `    <label for="${name}" class="col-sm-3 col-form-label">${escapeHtml(label)}${requiredMark}</label>\n`;
    group += '    <div class="col-sm-9">\n';
    group += `      ${element}\n`;
    if (helpText) {
      group += `      <div class="form-text">${helpText}</div>\n`;
    }
    group += '    </div>\n';
    group += '  </div>\n';
  } else {
    group += '  <div class="mb-3">\n';
    group += `    <label for="${name}" class="form-label">${escapeHtml(label)}${requiredMark}</label>\n`;
    group += `    ${element}\n`;
    if (helpText) {
      group += `    <div class="form-text">${helpText}</div>\n`;
    }
    group += '  </div>\n';
  }
  
  return group;
}

function wrapTailwindFormGroup(element: string, label: string, name: string, requiredMark: string, helpText: string, options: any): string {
  let group = '';
  
  if (options.layout === 'horizontal') {
    group += '  <div class="flex flex-wrap items-center mb-4">\n';
    group += `    <label for="${name}" class="w-full md:w-1/3 mb-2 md:mb-0 text-sm font-medium text-gray-700">${escapeHtml(label)}${requiredMark}</label>\n`;
    group += '    <div class="w-full md:w-2/3">\n';
    group += `      ${element}\n`;
    if (helpText) {
      group += `      <p class="mt-1 text-sm text-gray-500">${helpText}</p>\n`;
    }
    group += '    </div>\n';
    group += '  </div>\n';
  } else {
    group += '  <div class="mb-4">\n';
    group += `    <label for="${name}" class="block text-sm font-medium text-gray-700 mb-2">${escapeHtml(label)}${requiredMark}</label>\n`;
    group += `    ${element}\n`;
    if (helpText) {
      group += `    <p class="mt-1 text-sm text-gray-500">${helpText}</p>\n`;
    }
    group += '  </div>\n';
  }
  
  return group;
}

function wrapCustomFormGroup(element: string, label: string, name: string, requiredMark: string, helpText: string, options: any): string {
  let group = '  <div class="form-group">\n';
  group += `    <label for="${name}">${escapeHtml(label)}${requiredMark}</label>\n`;
  group += `    ${element}\n`;
  if (helpText) {
    group += `    <div class="help-text">${helpText}</div>\n`;
  }
  group += '  </div>\n';
  
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
}
```

## Step 5: Generate Complete HTML Document

Implement the main HTML generation function:

```typescript
function generateHTML(schema: any, options: any): string {
  let html = generateHTMLHeader(options);
  
  // Generate forms for each model
  if (schema.model) {
    for (const [modelName, model] of Object.entries(schema.model)) {
      html += generateFormHTML(modelName, model, schema, options);
      html += '\n';
    }
  }
  
  html += generateHTMLFooter(options);
  
  return html;
}

function generateHTMLHeader(options: any): string {
  let html = '<!DOCTYPE html>\n';
  html += '<html lang="en">\n';
  html += '<head>\n';
  html += '  <meta charset="UTF-8">\n';
  html += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
  html += `  <title>${escapeHtml(options.title)}</title>\n`;
  
  // Include CSS
  if (options.includeCSS) {
    html += generateCSS(options);
  }
  
  html += '</head>\n';
  html += '<body>\n';
  html += '<div class="container">\n';
  html += `  <h1>${escapeHtml(options.title)}</h1>\n`;
  
  return html;
}

function generateFormHTML(modelName: string, model: any, schema: any, options: any): string {
  let html = `<div class="form-container">\n`;
  html += `  <h2>${escapeHtml(modelName)} Form</h2>\n`;
  html += `  <form action="${options.submitUrl}" method="${options.method}" class="${getFormClasses(options.theme)}">\n`;
  
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
  
  html += '  </form>\n';
  html += '</div>\n';
  
  return html;
}

function generateSubmitButton(options: any): string {
  let button = '  <div class="';
  
  switch (options.theme) {
    case 'bootstrap':
      button += 'mb-3">\n';
      button += '    <button type="submit" class="btn btn-primary">Submit</button>\n';
      button += '    <button type="reset" class="btn btn-secondary ms-2">Reset</button>\n';
      break;
    case 'tailwind':
      button += 'mt-6">\n';
      button += '    <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">Submit</button>\n';
      button += '    <button type="reset" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">Reset</button>\n';
      break;
    default:
      button += 'form-actions">\n';
      button += '    <button type="submit" class="btn-primary">Submit</button>\n';
      button += '    <button type="reset" class="btn-secondary">Reset</button>\n';
  }
  
  button += '  </div>\n';
  
  return button;
}

function generateHTMLFooter(options: any): string {
  let html = '</div>\n';
  
  // Include JavaScript
  if (options.includeJS) {
    html += generateJavaScript(options);
  }
  
  html += '</body>\n';
  html += '</html>\n';
  
  return html;
}

function generateCSS(options: any): string {
  let css = '';
  
  switch (options.theme) {
    case 'bootstrap':
      css += '  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">\n';
      break;
    case 'tailwind':
      css += '  <script src="https://cdn.tailwindcss.com"></script>\n';
      break;
    default:
      css += '  <style>\n';
      css += generateCustomCSS();
      css += '  </style>\n';
  }
  
  return css;
}

function generateCustomCSS(): string {
  return `
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
  `;
}

function generateJavaScript(options: any): string {
  let js = '';
  
  switch (options.theme) {
    case 'bootstrap':
      js += '  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>\n';
      break;
  }
  
  // Add form validation JavaScript
  js += '  <script>\n';
  js += generateFormValidationJS();
  js += '  </script>\n';
  
  return js;
}

function generateFormValidationJS(): string {
  return `
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
  `;
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
    hints.push(`Minimum ${validation.minLength} characters`);
  }
  if (validation.maxLength) {
    hints.push(`Maximum ${validation.maxLength} characters`);
  }
  if (validation.min) {
    hints.push(`Minimum value: ${validation.min}`);
  }
  if (validation.max) {
    hints.push(`Maximum value: ${validation.max}`);
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
}
```

## Step 6: Usage in Schema

To use this plugin in your schema file:

```ts
// schema.idea
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
}
```

## Step 7: Generated Output

The plugin will generate HTML like this:

```html
<!DOCTYPE html>
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
</html>
```

## Step 8: Error Handling and Best Practices

Add proper error handling and validation:

```typescript
export default async function htmlFormPlugin(props: PluginProps<{}>) {
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
    
    console.log(`✅ HTML form generated: ${outputPath}`);
    console.log(`📊 Generated forms for ${Object.keys(schema.model).length} model(s)`);
    
  } catch (error) {
    console.error(`❌ HTML Form Plugin failed: ${error.message}`);
    throw error;
  }
}

function validateConfig(config: any): void {
  if (!config.output) {
    throw new Error('HTML Form Plugin requires "output" configuration');
  }
  
  if (config.theme && !['bootstrap', 'tailwind', 'custom'].includes(config.theme)) {
    throw new Error(`Unsupported theme: ${config.theme}`);
  }
  
  if (config.layout && !['vertical', 'horizontal', 'inline'].includes(config.layout)) {
    throw new Error(`Unsupported layout: ${config.layout}`);
  }
  
  if (config.method && !['GET', 'POST'].includes(config.method)) {
    throw new Error(`Unsupported HTTP method: ${config.method}`);
  }
}
```

## Conclusion

This HTML Form Plugin demonstrates how to:
- Parse schema models and generate appropriate form elements
- Support multiple CSS frameworks (Bootstrap, Tailwind, Custom)
- Handle different form layouts and validation
- Generate accessible, responsive forms
- Include client-side validation and enhancement

The plugin is flexible and can be extended to support additional form features like:
- File upload handling
- Multi-step forms
- Dynamic field dependencies
- Custom validation rules
- Integration with form libraries
