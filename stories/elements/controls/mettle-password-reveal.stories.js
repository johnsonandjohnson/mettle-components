import '../../../src/controls/mettle-password-reveal.js'
import './passwordReveal.css'

import { Constants, uuid } from '../../helper/index.js'

export default {
  title: 'Custom Elements/Controls/Mettle-Password-Reveal',
  argTypes: {
    slot: {
      control: { type: 'text' },
      description: 'Text or HTML used to display.',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },
    for: {
      description: 'The id of the element it is associated to.',
      name: 'data-for',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          detail: 'This is a generated ID, you must supply the ID',
          summary: uuid(),
        }
      },
    },
    container: {
      description: 'Wrapper div for the content.',
      name: '::part(container)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    checkbox: {
      description: 'Checkbox that can be styled',
      name: '::part(checkbox)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    label: {
      description: 'Label text that can be styled',
      name: '::part(label)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Used to toggle the type of a input element from hidden and text.',
      },
    },
  },
}

const Template = ({className = '', id = `id-${uuid()}`, slot = '<span>Show Password</span>' }) => {
  return `<input value="revealed" id="${id}" />
  <mettle-password-reveal
    class="${className}"
    data-for="${id}">${slot}</mettle-password-reveal>`.trim()
}

const args = {}

export const Default = Template.bind({})
Default.args = {
  ...args
}
Default.parameters = {
  docs: {
    source: {
      code: Template(Default.args)
    }
  },
}



const TemplateStyle = () => {
  return `
  .sample::part(container) {
    background-color: #eee;
    border: 1px solid rgb(192, 192, 192);
    display: inline;
    padding: 0.4rem;
  }

  .sample::part(label) {
    cursor: pointer;
    font-weight: bold;
  }
  `.trim()
}

export const Style = Template.bind({})
Style.args = {
  className: 'sample',
  ...args
}
Style.parameters = {
  docs: {
    description: {
      story: 'CSS Style used in the demo',
    },
    source: {
      code: TemplateStyle()
    },
  },
}
