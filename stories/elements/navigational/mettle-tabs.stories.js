import '../../../src/navigational/mettle-tabs.js'
import './mettle-tabs.css'

import { Constants, generateParagraph } from '../../helper/index.js'


export default {
  title: 'Custom Elements/Navigational/Mettle-Tabs',
  argTypes: {
    navigation: {
      description: 'Navigation title',
      name: 'slot="navigation"',
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
      description: 'Wrapper div for the title tabs.',
      name: '::part(navigation)',
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
