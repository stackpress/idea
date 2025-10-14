//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//-----------------------------------------------------------------

const generatedOutputExample =
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
</html>`;

//-----------------------------------------------------------------

export default function GeneratedOutput() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Generated Output Section Content */}
      <section id="generated-output">
        <H1>{_('9. Generated Output')}</H1>
        <P>
          <Translate>
            The generated output section shows examples of the HTML code
            that the plugin produces. This helps you understand what to
            expect from the plugin and how the various configuration
            options affect the final output.
          </Translate>
        </P>
        <P>
          <Translate>
            The plugin will generate HTML like this:
          </Translate>
        </P>
        <Code copy language="html" className="bg-black text-white">
          {generatedOutputExample}
        </Code>
      </section>
    </>
  );
}