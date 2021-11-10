import '../../../src/informational/mettle-tool-tip.js'

import { Constants, uuid } from '../../helper/index.js'

import './tool-tip.css'

export default {
  title: 'Custom Elements/Informational/Mettle-Tool-Tip',
  argTypes: {
    slot: {
      control: { type: 'text' },
      description: 'Text or HTML used to display.',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },
    position: {
      control: { type: 'select', options: ['left', 'right', 'top', 'bottom'] },
      description: 'Set the position of the tool-tip based on an element.',
      name: 'data-position',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          detail: 'Right centered from an element',
          summary: 'right',
        }
      }
    },
    for: {
      description: 'The id of the element the tool-tip is associated to.',
      name: 'data-for',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          detail: 'This is a generated ID, you must supply the ID',
          summary: uuid(),
        }
      },
    },
    hover: {
      control: { type: 'boolean' },
      description: 'Set if you want to hover on mouse over.',
      name: 'data-hover',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
          defaultValue: {
          summary: 'true',
        }
      }
    },
    tip: {
      description: 'Wrapper div for the slot content.',
      name: '::part(tip)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    arrow: {
      description: 'Arrow that can be styled',
      name: '::part(arrow)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    isShowing: {
      description: 'Function returns a boolean value of the display state',
      name: 'isShowing()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    show: {
      description: 'Function to set the state to display',
      name: 'show()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    hide: {
      description: 'Function to remove the state from displaying',
      name: 'hide()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Used to provide context when hovering over an element.',
      },
    },
  },
}

const Template = ({Class = '', hover, id = `id-${uuid()}`, position, slot = '<p>Slot HTML/Text</p>' }) => {
  return `<span id="${id}">Hover or tap me for tip</span>
  <mettle-tool-tip
    class="${Class}""
    data-hover="${hover}"
    data-position="${position}"
    data-for="${id}">${slot}</mettle-tool-tip>`.trim()
}

const args = {
  hover: 'true',
  position: 'left',
}

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

/*
export const Right = Template.bind({});
Right.args = {
  ...args,
  position: 'right',
}
Right.parameters = {
  docs: {
    description: {
      story: 'This is the default **Tool-Tip**',
    },
    source: {
      code: Template(Right.args)
    }
  },
}
*/


const TemplateStyle = (args) => {
  return `
  ${Template(args)}

  <style>
    mettle-tool-tip.styled::part(tip),
    mettle-tool-tip.styled::part(arrow) {
      background-color: #eee;
      color: #212121;
    }
  </style>
  `.trim()
}

export const Style = Template.bind({})
Style.args = {
  ...args,
  Class: 'styled'
}
Style.parameters = {
  docs: {
    description: {
      story: 'CSS Style demo',
    },
    source: {
      code: TemplateStyle(Style.args)
    },
  },
}


const TemplateScript = (args) => {
  return `
  ${Template(args)}

  <button class="show">show()</button>
  <button class="hide">hide()</button>

  <script>
    const $component = globalThis.document.querySelector('mettle-tool-tip')

    globalThis.document.querySelector('button.show').addEventListener('click', ()=> {
      $component.show()
    })

    globalThis.document.querySelector('button.hide').addEventListener('click', ()=> {
      $component.hide()
    })
  </script>
  `.trim()
}

export const Script = TemplateScript.bind({})
Script.args = {
  ...args,
}
Script.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'JavaScript sample on how to use the methods',
    },
    source: {
      code: TemplateScript(Script.args)
    },
  },
}
