import '../../../src/navigational/mettle-drop-down.js'
import './mettle-drop-down.css'
import { Constants, uuid } from '../../helper/index.js'

const DocsDescriptionMDX = `
**Single Import**
<pre class="coder">import '@johnsonandjohnson/mettle-components/src/navigational/mettle-drop-down.js'</pre>

Tabs are used to display different content in a compact section. Sub-menus are currently not supported
`.trim()

export default {
  title: 'Custom Elements/Navigational/Mettle-Drop-Down',
  argTypes: {
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
    /*dataParent: {
      description: 'The id of the parent element it is associated to. Treats this as a child menu.',
      name: 'data-parent',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          detail: 'This is a generated ID, you must supply the ID',
          summary: uuid(),
        }
      },
    },*/
    dataUserAction: {
      control: { type: 'select', options: ['auxclick', 'click', 'mouse'] },
      description: 'The user action event used to open the menu.',
      name: 'data-user-action',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          detail: 'If omitted defaults to click',
          summary: 'click',
        }
      },
    },
    dataPosition: {
      control: { type: 'select', options: ['bottom', 'left', 'right'] },
      description: 'The set position to open the menu.',
      name: 'data-position',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          detail: 'If omitted defaults to bottom',
          summary: 'bottom',
        }
      },
    },
    dataDistanceX: {
      control: { type: 'number'},
      description: 'The horizontal position offset number.',
      name: 'data-distance-x',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          detail: 'If omitted defaults to zero',
          summary: '0',
        }
      },
    },
    dataDistanceY: {
      control: { type: 'number'},
      description: 'The vertical position offset number.',
      name: 'data-distance-Y',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          detail: 'If omitted defaults to zero',
          summary: '0',
        }
      },
    },
    slot: {
      description: 'Menu slot',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },
    isShowing: {
      description: 'Function returns a boolean value of the display state',
      name: 'isShowing()',
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

const Template = ({dataUserAction = '', dataPosition = '', dataDistanceX = '', dataDistanceY = '', ClassName = ''}) => {
  const uid = uuid()
  return `
  <span class="menuNav" id="${uid}"> *** </span>
   <mettle-drop-down
   class="${ClassName}"
  data-for="${uid}"
  data-user-action="${dataUserAction}"
  data-position="${dataPosition}"
  data-distance-x="${dataDistanceX}"
  data-distance-y="${dataDistanceY}"
  `.trim() + `>
    <ul class="menu">
      <li>menu item 1</li>
      <li>menu item 2</li>
      <li>menu item 3</li>
    </ul>
  </mettle-drop-down>`.trim()
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
    },
  },
}

const TemplateStyle = (args) => {
  return `
  ${Template(args)}

  <style>
    mettle-drop-down.styled {
      opacity: 0;
      transition: opacity 0.3s;
    }

    mettle-drop-down.styled[data-open] {
      opacity: 1;
    }
  </style>
  `.trim()
}

export const Style = Template.bind({})
Style.args = {
  ClassName: 'styled',
  ...args,
}
Style.parameters = {
  docs: {
    description: {
      story: 'Drop-down with CSS Style. Has a transition when toggling.',
    },
    source: {
      code: TemplateStyle(Style.args)
    },
  },
}

