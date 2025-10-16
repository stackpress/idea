//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//--------------------------------------------------------------------//

const formLayoutExample =
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
}`;

//--------------------------------------------------------------------//

export default function ImplementFormLayoutAndStyling() {
  //hooks
  const { _ } = useLanguage();
  
  return (
    <>
      {/* Implement Form Layout and Styling Section Content */}
      <section id="implement-form-layout-and-styling">
        <H1>{_('6. Implement Form Layout and Styling')}</H1>
        <P>
          <Translate>
            Form layout and styling ensure that generated forms are
            visually appealing and work well with different CSS
            frameworks. This section covers how to implement support
            for Bootstrap, Tailwind CSS, and custom styling, along with
            different layout options like vertical, horizontal, and
            inline forms.
          </Translate>
        </P>
        <P>
          <Translate>
            Create functions for different themes and layouts:
          </Translate>
        </P>
        <Code copy language="typescript" className="bg-black text-white">
          {formLayoutExample}
        </Code>
      </section>
    </>
  );
}