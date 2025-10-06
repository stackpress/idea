//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//----------------------------------------------------------------------

const htmlGenerationExample = 
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
}`

//----------------------------------------------------------------------

export default function GenerateCompleteHtmlDocument() {
  //hooks
  const { _ } = useLanguage();
  
  return (
    <>
      {/* Generate Complete HTML Document Section Content */}
      <section id="generate-complete-html-document">
      <H1>{_('7. Generate Complete HTML Document')}</H1>
      <P>
        <Translate>
          Generating a complete HTML document involves combining all 
          form elements into a properly structured HTML page. This 
          section shows how to create the HTML structure, include 
          necessary CSS and JavaScript files, and generate forms for 
          multiple models within a single document.
        </Translate>
      </P>
      <P>
        <Translate>
          Implement the main HTML generation function:
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {htmlGenerationExample}
      </Code>
      </section>
    </>
  );
}