import '../../../src/informational/mettle-field-validation.js'
import './mettle-field-validation.css'

import { Constants } from '../../helper/index.js'


const DocsDescriptionMDX = `
**Single Import**
<pre class="coder">import '@johnsonandjohnson/mettle-components/src/informational/mettle-field-validation.js'</pre>

This field validation displays error messages associated to the form field. It references the validationMessage from the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation" target="_blank">Validation API</a>
`.trim()

export default {
  title: 'Custom Elements/Informational/Mettle-Field-Validation',
  argTypes: {
    Class: {
      control: { type: null },
    },
    validation: {
      control: { type: null },
      description: 'Wrapper div for the validation message.',
      name: '::part(validation)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    fieldName: {
      description: 'The name of the field element it is associated to.',
      name: 'data-field-name',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          detail: 'This is a unique field name, you must supply the field name.',
        }
      },
    },
    handleInvalidField: {
      description: 'Function that checks and displays a validation message if present.',
      name: 'handleInvalidField()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    resetField: {
      description: 'Function that removes the displayed validation message if present.',
      name: 'resetField()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
  },
  parameters: {
    docs: {
      description: {
        component: DocsDescriptionMDX,
      },
    },
  },
}

const Template = ({Class = ''}) => {
  return `

    <label>Required Field*</label> <br />
    <input type="text" name="description" required="required" />
    <mettle-field-validation data-field-name="description" class="${Class}"></mettle-field-validation>
    <script type="module">

      function validateField(field) {
        field.setCustomValidity('')
        const invalidMsg = validateRequired(field)
        field.setCustomValidity(invalidMsg)
        field.checkValidity()
      }

      function validateRequired(input) {
        return (input.hasAttribute('required') && !input.value.trim().length) ?
          (input.tagName.toLowerCase() === 'select' ? 'Please select one of these options.' : 'Please fill out this field.') : ''
      }

      const field = document.querySelector('input[name="description"]')
      field.addEventListener('input', validateField.bind(this, field))
      field.addEventListener('blur', () => {
        field.classList.add('dirty')
      })

    </script>
  `.trim()
}

const args = {
  Class: '',
}

export const Default = Template.bind({})
Default.args = {
  ...args
}
Default.parameters = {
  docs: {
    inlineStories: false,
    source: {
      code: Template(Default.args)
    },
  },
}

const TemplateStyle = (args) => {
  return `
  ${Template(args)}

  <style>
    mettle-field-validation.error::part(validation) {
      color: red;
      padding: 0 0 0.2rem 0;
    }
  </style>
  `.trim()
}

export const Style = Template.bind({})
Style.args = {
  ...args,
  Class: 'error'
}
Style.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'Validation Message with CSS Style. (Adding a "error" class)',
    },
    source: {
      code: TemplateStyle(Style.args)
    },
  },
}

