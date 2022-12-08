import '../../../src/controls/mettle-sort-header.js'
import './sort-header.css'

import { Constants } from '../../helper/index.js'

const DocsDescriptionMDX = `
**Single Import**
<pre class="coder">import '@johnsonandjohnson/mettle-components/src/controls/mettle-sort-header.js'</pre>


Used as a sort controller where the controls emit event listeners.  Will keep track of which header is to be sorted and in what direction, ascending or descending.

`.trim()

export default {
  title: 'Custom Elements/Controls/Mettle-Sort-Header',
  argTypes: {
    slot: {
      control: { type: null },
      description: 'HTML used to display headers with applied sorting attributes.',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },
    dataKey: {
      control: { type: null },
      description: 'Attributes that is used in the slots to identify the key to sort by.',
      name: 'data-key',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
      }
    },
    SORT: {
      description: 'The main event when a header sort status changes',
      name: 'SORT',
      table: {
        category: Constants.CATEGORIES.EVENTS,
        defaultValue: {
          detail: 'Constants with all Event types.',
          summary: '$selector.EVENT_TYPES.SORT',
        }
      },
    },
    SORT_ORDER: {
      description: 'A constant with the possible values for sort order.',
      name: 'SORT_ORDER',
      table: {
        category: Constants.CATEGORIES.GET_SET,
        defaultValue: {
          detail: 'This is a get only.',
          summary: '$selector.SORT_ORDER.ASCENDING | $selector.SORT_ORDER.DESCENDING',
        }
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

const Template = () => {
  return `
  <mettle-sort-header>
    <div class="container">
      <div class="row">
        <div class="col" data-key="ID">ID</div>
        <div class="col" data-key="title">Title</div>
        <div class="col" data-key="region">Region</div>
        <div class="col" data-key="dateCreated">Date</div>
      </div>
    </div>
  </mettle-sort-header>

  <style>
    [data-key] {
      cursor: pointer;
    }

    [data-sort="desc"].active::after {
      content: ' \\2191';
      color: initial;
    }

    [data-sort="asc"].active::after {
      content: ' \\2193';
      color: initial;
    }
  </style>
`.trim()
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



const TemplateScript = (args) => {
  return `
  <p><strong>Interact with the component to see the results of the event listener</strong></p>

  ${Template(args)}

  <textarea></textarea>

  <script>
    const $component = globalThis.document.querySelector('mettle-sort-header')
    const $textarea = globalThis.document.querySelector('textarea')

    $component.addEventListener($component.EVENT_TYPES.SORT, evt => {
      const details = evt.detail
      $textarea.value = JSON.stringify(details)
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
      story: 'JavaScript sample on how to handle the event listener',
    },
    source: {
      code: TemplateScript(Script.args)
    },
  },
  layout: 'padded',
}

