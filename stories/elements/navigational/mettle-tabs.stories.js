import '../../../src/navigational/mettle-tabs.js'
import './mettle-tabs.css'

import { Constants, generateParagraph } from '../../helper/index.js'


export default {
  title: 'Custom Elements/Navigational/Mettle-Tabs',
  argTypes: {
    navigation: {
      description: 'Navigation tab',
      name: 'slot="navigation"',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },
    beforeNavigation: {
      description: 'Before navigation tab group',
      name: 'slot="beforeNavigation"',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },
    afterNavigation: {
      description: 'After navigation tab group',
      name: 'slot="afterNavigation"',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },
    panel: {
      description: 'Panel content',
      name: 'slot',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },
    tabNavigation: {
      description: 'Wrapper div for the tab navigation.',
      name: '::part(navigation)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    tabNavigationGroup: {
      description: 'Wrapper div for the tab navigation slots.',
      name: '::part(navigation-tab-group)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    panelContainer: {
      description: 'Wrapper div for panel tabs.',
      name: '::part(panel-container)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    panelTab: {
      description: 'Wrapper div for the panels slot.',
      name: '::part(panel-tab)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    ariaSelected: {
      control: { type: null },
      description: 'The selected tab.',
      name: 'aria-selected',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
      },
    },
    dataIgnore: {
      control: { type: null },
      description: 'Ignore a navigation slot. Used to break up tab slots.',
      name: 'data-ignore',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
      },
    },
    TAB: {
      description: 'The main event when a tab is clicked on',
      name: 'TAB',
      table: {
        category: Constants.CATEGORIES.EVENTS,
        defaultValue: {
          detail: 'Constants with all Event types.',
          summary: '$selector.EVENT_TYPES.TAB',
        }

      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Tabs are used to display different content in a compact section.',
      },
    },
  },
}

const Template = ({Class = ''}) => {
  return `
  <mettle-tabs class="${Class}">
  <div slot="navigation">Tab1 &nbsp;&nbsp;</div>
  <div slot="navigation">Tab2 &nbsp;&nbsp;</div>
  <div slot="navigation">Tab3 &nbsp;&nbsp;</div>

  <div>${generateParagraph()}</div>
  <div>${generateParagraph()}</div>
  <div>${generateParagraph()}</div>
</mettle-tabs>`.trim()
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
    source: {
      code: Template(Default.args)
    },
  },
}

const TemplateStyle = (args) => {
  return `
  ${Template(args)}

  <style>
    mettle-tabs.styled::part(panel-container) {
      width: 50rem;
      height: 200px;
      background: rgba(0, 0, 0, 1);
      color: var(--on-surface, white);
      border-top-right-radius: 5px;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }

    mettle-tabs.styled::part(navigation-slot) {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }

    mettle-tabs.styled div:not([slot="navigation"]),
    mettle-tabs.styled p {
      padding: 1rem;
      background: var(--surface, rgba(0, 0, 0, 0.5));
      color: var(--on-surface, white);
      margin: 0;
    }

    mettle-tabs.styled [aria-selected] {
      padding: 1rem;
      border: none;
      outline: none;
      background: var(--surface, rgba(0, 0, 0, 0.5));
      color: var(--on-surface, white);
      font-weight: bold;
    }

    mettle-tabs.styled div[aria-selected="true"] {
      background: rgba(0, 0, 0, 1);
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
      story: 'Tabs with CSS Style. (Adding a "styled" class)',
    },
    source: {
      code: TemplateStyle(Style.args)
    },
  },
}


const TemplateStyle2 = (args) => {
  return `
  ${Template(args)}

  <style>
    mettle-tabs.styled::part(panel-container) {
      width: 50rem;
      height: 200px;
      background: rgba(0, 0, 0, 1);
      color: var(--on-surface, white);
      border-top-right-radius: 5px;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }

    mettle-tabs.styled::part(navigation-slot) {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }

    mettle-tabs.styled div:not([slot="navigation"]),
    mettle-tabs.styled p {
      padding: 1rem;
      background: var(--surface, rgba(0, 0, 0, 0.5));
      color: var(--on-surface, white);
      margin: 0;
    }

    mettle-tabs.styled [aria-selected] {
      padding: 1rem;
      border: none;
      outline: none;
      background: var(--surface, rgba(0, 0, 0, 0.5));
      color: var(--on-surface, white);
      font-weight: bold;
    }

    mettle-tabs.styled div[aria-selected="true"] {
      background: rgba(0, 0, 0, 1);
    }

    mettle-tabs.styled.side {
      display: grid;
      grid-template-columns: auto 1fr;
    }

    mettle-tabs.styled.side::part(navigation-slot) {
      flex-direction: column;
    }

    mettle-tabs.styled.side::part(panel-container) {
      border-radius: 0;
      height: 100%;
    }

    mettle-tabs.styled.side::part(navigation-slot) {
      border-radius: 0;
    }
  </style>
  `.trim()
}

const TemplateStyle3 = (args) => {
  return `
  ${Template(args)}

  <style>
    mettle-tabs.animate::part(panel-tab) {
      transition: transform 0.3s;
    }
  </style>
  `.trim()
}

export const SideTabsStyle = Template.bind({})
SideTabsStyle.args = {
  ...args,
  Class: 'styled side'
}
SideTabsStyle.parameters = {
  docs: {
    description: {
      story: 'Tabs with alternative CSS Style. (Adding a "styled side" class)',
    },
    source: {
      code: TemplateStyle2(SideTabsStyle.args)
    },
  },
}


export const TabAnimationStyle = Template.bind({})
TabAnimationStyle.args = {
  ...args,
  Class: 'styled animate'
}
TabAnimationStyle.parameters = {
  docs: {
    description: {
      story: 'Tabs with animation',
    },
    source: {
      code: TemplateStyle3(TabAnimationStyle.args)
    },
  },
}


const TemplateScript = (args) => {
  return `
  <p><strong>Interact with the component to see the results of the event listener</strong></p>

  ${Template(args)}

  <textarea></textarea>

  <script>
    const $component = globalThis.document.querySelector('mettle-tabs.${args.Class}')
    const $textarea = globalThis.document.querySelector('textarea')

    $component.addEventListener($component.EVENT_TYPES.TAB, evt => {
      const details = evt.detail
      $textarea.value = JSON.stringify(details)
    })

  </script>
  `.trim()
}

export const Script = TemplateScript.bind({})
Script.args = {
  ...args,
  Class: 'js'
}
Script.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'JavaScript sample on how to handle the event listener',
    },
    source: {
      code: TemplateScript(Script.args)
    },
  },
  layout: 'padded',
}


// prevent tab click
// Navigation header style
// pre-selected tab
