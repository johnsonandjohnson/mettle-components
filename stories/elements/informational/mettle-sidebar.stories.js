import '../../../src/informational/mettle-sidebar.js'

import { Constants, uuid } from '../../helper/index.js'

export default {
  title: 'Custom Elements/Informational/Mettle-Sidebar',
  argTypes: {
    slot: {
      control: { type: 'text' },
      description: 'Text or HTML used to display.',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },
    position: {
      control: { type: 'select', options: ['left', 'right'] },
      description: 'Set the position of the sidebar based on an element.',
      name: 'data-position',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          detail: 'Left expanding from an element',
          summary: 'left',
        }
      }
    },
    for: {
      description: 'The id of the element the sidebar is associated to.',
      name: 'data-for',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          detail: 'This is a generated ID, you must supply if "main-sidebar" attribute is not used.',
          summary: uuid(),
        }
      }
    },
    width: {
      description: 'The width of the sidebar when expanded.',
      name: 'data-width',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          summary: '10rem',
        }
      }
    },
    mainSidebar: {
      description: 'If specified, the sidebar is used as a main page information panel that is fixed to left or right side.',
      name: 'main-sidebar',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
      }
    },
    open: {
      description: 'If specified, the sidebar is opened.',
      name: 'open',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
      }
    },
    container: {
      description: 'Wrapper div for the slot content. Contains the transition animation css.',
      name: '::part(container)',
      table: {
        category: Constants.CATEGORIES.CSS,
      }
    },
    toggle: {
      description: 'Function to toggle the opened/closed state of the sidebar.',
      name: 'toggle()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    open: {
      description: 'Function to set the sidebar to opened.',
      name: 'open()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    close: {
      description: 'Function to set the sidebar to closed.',
      name: 'close()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    isOpened: {
      description: 'Getter that returns a boolean value of whether the sidebar is open.',
      name: 'isOpened()',
      table: {
        category: Constants.CATEGORIES.GET_SET,
      }
    },
    OPENED: {
      description: 'The event when the sidebar is opened.',
      name: 'OPENED',
      table: {
        category: Constants.CATEGORIES.EVENTS,
        defaultValue: {
          detail: 'Constants with all Event types.',
          summary: '$selected.EVENT_TYPES.OPENED',
        }
      }
    },
    CLOSED: {
      description: 'The event when the sidebar is closed.',
      name: 'CLOSED',
      table: {
        category: Constants.CATEGORIES.EVENTS,
        defaultValue: {
          detail: 'Constants with all Event types.',
          summary: '$selected.EVENT_TYPES.CLOSED',
        }
      }
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Used to provide a sliding side information page for an element',
      },
    },
  },
}

const Template = ({Class = '',  id = `id-${uuid()}`, position, width, slot = '<div>Slot HTML/Text</div>' }) => {
  return `
    <div class="elem" id="${id}">Click on me to open sidebar</div>
    <mettle-sidebar
      class="${Class}"
      data-position="${position}"
      data-width="${width}"
      data-for="${id}"
    >
      ${slot}
    </mettle-sidebar>
    <script>
      const $component = globalThis.document.querySelector('mettle-sidebar')

      globalThis.document.querySelector('div.elem').addEventListener('click', () => {
        $component.toggle()
      })M
    </script>
    
    <style>
      .elem {
        border-style: solid;
        height: 8rem;
      }
    </style>
    `.trim()
}

const args = {
  position: 'left',
  width: '10rem',
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