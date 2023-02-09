import '../../../src/navigational/mettle-tabs.js'
import './mettle-tabs.css'

import { Constants, generateParagraph } from '../../helper/index.js'

const DocsDescriptionMDX = `
**Single Import**
<pre class="coder">import '@johnsonandjohnson/mettle-components/src/navigational/mettle-tabs.js'</pre>

**Source Code**
<pre class="coder"><a href="https://github.com/johnsonandjohnson/mettle-components/blob/main/src/navigational/mettle-tabs.js" target="_blank">https://github.com/johnsonandjohnson/mettle-components/blob/main/src/navigational/mettle-tabs.js</a></pre>

Tabs are used to display different content in a compact section.
`.trim()

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
    navigationSlot: {
      description: 'Slot for all tab navigation. Where the slot="navigation" elements are inserted.',
      name: '::part(navigation-slot)',
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
    panelSlot: {
      description: 'Slot for all the panels. Where the unnamed slot elements are inserted.',
      name: '::part(panel-slot)',
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
    selected: {
      control: {
        type: null
      },
      description: 'Set a tab to the active tab. Note this will trigger the TAB selected event.',
      name: '$selector.selected',
      table: {
        category: Constants.CATEGORIES.GET_SET,
        type: {
          detail: 'Tab Index starting from 0',
          summary: 'Number'
        }
      },
      type: {
        required: false
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
        },
        type: {
          detail: 'Event String',
          summary: 'Const'
        }
      },
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
      width: 100%;
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

    mettle-tabs.styled > div:not([slot]) {
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
      width: 100%;
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

    mettle-tabs.styled > div:not([slot]) {
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


const TemplatePreSelected = ({Class = ''}) => {
  return `
  <mettle-tabs class="${Class}">
  <div slot="navigation">Tab1 &nbsp;&nbsp;</div>
  <div slot="navigation" aria-selected="true">Tab2 &nbsp;&nbsp;</div>
  <div slot="navigation">Tab3 &nbsp;&nbsp;</div>

  <div>${generateParagraph()}</div>
  <div>${generateParagraph()}</div>
  <div>${generateParagraph()}</div>
</mettle-tabs>`.trim()
}

export const PreSelected = TemplatePreSelected.bind({})
PreSelected.args = {
  ...args,
  Class: 'styled',
}

const PreSelectedMDX = `
Sample of a pre-selected tab with the <code>aria-selected="true"</code> attribute.
`.trim()

PreSelected.parameters = {
  docs: {
    description: {
      story: PreSelectedMDX,
    },
    source: {
      code: TemplatePreSelected(PreSelected.args)
    },
  },
}


const TemplateStyle3 = (args) => {
  return `
  ${Template(args)}

  <style>
    /** Add with the Styled CSS **/
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



const TemplateTabIgnored = ({Class = ''}) => {
  return `
  <mettle-tabs class="${Class}">
    <div slot="navigation">Tab1 &nbsp;&nbsp;</div>
    <div slot="navigation">Tab2 &nbsp;&nbsp;</div>
    <div slot="navigation" data-ignore>&nbsp;&nbsp;</div>
    <div slot="navigation">Tab3 &nbsp;&nbsp;</div>
    <div slot="navigation">Tab4 &nbsp;&nbsp;</div>

    <div>${generateParagraph()}</div>
    <div>${generateParagraph()}</div>
    <div>${generateParagraph()}</div>
    <div>${generateParagraph()}</div>
  </mettle-tabs>

  <style>
    /** Add with the Styled CSS **/

    mettle-tabs.ignore [data-ignore] {
      flex-grow: 1;
    }

    mettle-tabs.ignore::part(navigation) {
      width: 100%;
    }

    mettle-tabs.ignore::part(navigation-tab-group) {
      display: flex;
      flex-grow: 1;
    }
    mettle-tabs.ignore::part(navigation-slot) {
      flex-grow: 1;
    }

    mettle-tabs.ignore::part(panel-container) {
      border-top-right-radius: 0;
    }
  </style>
`.trim()
}

export const TabIgnored = TemplateTabIgnored.bind({})
TabIgnored.args = {
  ...args,
  Class: 'styled ignore',
}

const TabIgnoredMDX = `
Sample of a ignored tab with the <code>data-ignore</code> attribute.
`.trim()

TabIgnored.parameters = {
  docs: {
    description: {
      story: TabIgnoredMDX,
    },
    source: {
      code: TemplateTabIgnored(TabIgnored.args)
    },
  },
}


const TemplateTabNavigation = ({Class = ''}) => {
  return `
  <mettle-tabs class="${Class}">

    <div slot="beforeNavigation" class="title">My site title</div>

    <div slot="navigation">Tab1 &nbsp;&nbsp;</div>
    <div slot="navigation">Tab2 &nbsp;&nbsp;</div>
    <div slot="navigation">Tab3 &nbsp;&nbsp;</div>
    <div slot="navigation">Tab4 &nbsp;&nbsp;</div>

    <div slot="afterNavigation" class="end-nav">
      <div>About US</div>
      <div>Blog</div>
      <div>Pricing</div>
    </div>

    <div>${generateParagraph()}</div>
    <div>${generateParagraph()}</div>
    <div>${generateParagraph()}</div>
    <div>${generateParagraph()}</div>
  </mettle-tabs>

  <style>
    /** Add with the Styled CSS **/

    .title {
      align-items: center;
      display: flex;
      font-family: sans-serif;
      font-size: 1rem;
      justify-content: center;
      padding-left: 1rem;
      text-transform: capitalize;
    }

    .end-nav {
      align-items: center;
      display: flex;
      justify-content: space-around;
      margin-right: 1rem;
    }

    .end-nav div {
      cursor: pointer;
      padding-right: 1rem;
    }

    .end-nav div:hover {
      text-decoration: underline;
    }

    mettle-tabs.nav::part(navigation) {
      justify-content: space-between;
    }

    mettle-tabs.nav::part(panel-container) {
      width: initial;
    }
  </style>
`.trim()
}

export const TabNavigation = TemplateTabNavigation.bind({})
TabNavigation.args = {
  ...args,
  Class: 'styled nav',
}

const TabNavigationMDX = `
Sample of a content left and right of the navigation tabs.
Added <code>slot="beforeNavigation"</code> and <code>slot="afterNavigation"</code>.
`.trim()

TabNavigation.parameters = {
  docs: {
    description: {
      story: TabNavigationMDX,
    },
    source: {
      code: TemplateTabNavigation(TabNavigation.args)
    },
  },
}


const TemplateScript = (args) => {
  return `
  <p><strong>Interact with the component to see the results of the event listener</strong></p>

  ${Template(args)}

  <textarea></textarea>

  <script>
    (() => {
      const $component = globalThis.document.querySelector('mettle-tabs.${args.Class}')
      const $textarea = globalThis.document.querySelector('textarea')

      $component.addEventListener($component.EVENT_TYPES.TAB, evt => {
        const details = evt.detail
        $textarea.value = JSON.stringify(details)
      })
    })()
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


const TemplatePreventTab = (args) => {
  return `
  <p><strong>Interact with the component to see tab 3 is prevented</strong></p>

  ${Template(args)}

  <textarea></textarea>

  <script>
    (() => {
      const $component = globalThis.document.querySelector('mettle-tabs.${args.Class}')
      const $textarea = globalThis.document.querySelector('textarea')

      $component.addEventListener($component.EVENT_TYPES.TAB, evt => {
        const details = evt.detail
        $textarea.value = JSON.stringify(details)
        // Prevent tab 3 from being selected
        if(details.selectedIndex === 2) {
          $component.selected = details.previousSelectedIndex
        }
      })
    })()
  </script>
  `.trim()
}

export const PreventTabScript = TemplatePreventTab.bind({})
PreventTabScript.args = {
  ...args,
  Class: 'js'
}

const PreventTabScriptMDX = `
JavaScript sample on how to use the event listener to prevent a tab selection.
**Note that the index counter starts at zero(0).**
`.trim()

PreventTabScript.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: PreventTabScriptMDX,
    },
    source: {
      code: TemplatePreventTab(PreventTabScript.args)
    },
  },
  layout: 'padded',
}
