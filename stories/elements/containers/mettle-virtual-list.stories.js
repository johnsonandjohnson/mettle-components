import '../../../src/containers/mettle-virtual-list.js'

import { Constants, generateHTMLParagraphs, getRandomInt } from '../../helper/index.js'

import './virtual-list.css'

const DocsDescriptionMDX = `
Mettle virtual list is used to display a large list of items.  Only items in
the view port will be rendered.

### How does it work
The virtual list takes in the list array, a render function and an update function.
The Virtual list will determine which item in the list has the most data and will
render it in the DOM to find the height.  It will use that height as a base height for
all items in the array. This will also help determine how big the list will be to
properly adjust the scroll height.

If the list is set to dynamic, each item height will
be determined and saved before rendering.  For list that are fairly large,
this process will slow down the browser and is not recommend.


<img src="./virtual-list.svg" alt="Virtual List" />


**No observed Attributes on data-dynamic**

The choice was made to not observe the <code>data-dynamic</code> due to the nature
of the rendering process.  This attribute must be present before using the
render function.

**Class States**

When hovering over the rows, a CSS class is applied on mouse and click events.

<pre>
<code>
mettle-virtual-list .hovered {
  background-color: hsl(24, 100%, 50%);
  cursor: pointer;
}

mettle-virtual-list .selected {
  background-color: hsl(60, 100%, 50%);
}

mettle-virtual-list .hovered.selected {
  background-color: hsl(233, 72%, 89%);
}
</code>
</pre>

**Event Dispatches**

Clicking a row will cause the <code>SELECTED</code> and <code>UNSELECTED</code> events to trigger.

The event detail will return the following.

| key | Value |
|:---------|:---------|
| evt.detail.**elem** | The element selected |
| evt.detail.**index** | The list item index |
| evt.detail.**itemData** | The list item data |

<pre>
<code>
const $component = globalThis.document.querySelector('mettle-virtual-list')

$component.addEventListener($component.EVENT_TYPES.SELECTED, evt => {
  const { elem, index, itemData } = evt.detail
})

$component.addEventListener($component.EVENT_TYPES.UNSELECTED, evt => {
  const { elem, index, itemData } = evt.detail
})
</code>
</pre>

**Selected Row Event Bubbling**

If you have a row with a clickable element, be sure to prevent the event from bubbling
so the row is not being selected and un-selected.

<pre>
<code>
const $rowBtn = globalThis.document.querySelector('button.row-btn')

$rowBtn.addEventListener('click', evt => {
  evt.stopPropagation()
})
</code>
</pre>

> Use the <code>stopPropagation()</code> to prevent this.

##See code samples below
`

export default {
  title: 'Custom Elements/Containers/Mettle-Virtual-List',
  argTypes: {
    dataDynamic: {
      control: { type: 'null' },
      description: 'Set if you want to display the rows with variable heights.',
      name: 'data-dynamic',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          summary: 'false',
        }
      }
    },

    render: {
      description: 'Function to render the virtual list',
      name: 'async render({ listItems, renderRow, updateRow })',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    appendItems: {
      description: 'Function to add to list items for rendering',
      name: 'appendItems(listItems)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    SELECTED: {
      description: 'The event when a row is clicked on',
      name: 'SELECTED',
      table: {
        category: Constants.CATEGORIES.EVENTS,
        defaultValue: {
          detail: 'Constants with all Event types.',
          summary: '$selector.EVENT_TYPES.SELECTED',
        },
        type: {
          detail: 'Event String',
          summary: 'Const'
        }
      },
    },
    UNSELECTED: {
      description: 'The event when a row is clicked on again to unselect it',
      name: 'UNSELECTED',
      table: {
        category: Constants.CATEGORIES.EVENTS,
        defaultValue: {
          detail: 'Constants with all Event types.',
          summary: '$selector.EVENT_TYPES.UNSELECTED',
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
        component: DocsDescriptionMDX
      },
    },
  },
}

const Template = ({dataDynamic = false}) => {
  const isDynamic = dataDynamic ? 'data-dynamic' : ''
  console.log(dataDynamic)
  return `
    <div class="v-flex">
      <mettle-virtual-list ${isDynamic}></mettle-virtual-list>
    </div>
    <script>
      (() => {
        const $component = globalThis.document.querySelector('mettle-virtual-list')

        $component.render({
          listItems: getListItemsSet(500),
          renderRow: () => {
            const elem = document.createElement('div')
            elem.classList.add('v-row')
            return elem
          },
          updateRow: (elem, data) => {
            elem.innerHTML = data
          }
        })
      })()

    function generateString(length) {
      const chars ='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
      const charsLength = chars.length
      length = Math.ceil(Math.random() * length)
      const result = [...new Array(length)].map(() => chars.charAt(Math.floor(Math.random() * charsLength)))
      return result.join(' ')
    }

    function getListItemsSet(min=1) {
      return [...new Array(min)].map((element, index) => \`<big>\${(index+1)}</big> <small>\${generateString(200)}</small>\`)
    }
  </script>

  <style>
    .v-flex {
      display: flex;
      flex-grow: 1;
      height: 100vh;
    }

    .v-row {
      border-bottom: 1px solid blue;
      padding: 0.4rem;
    }

    mettle-virtual-list {
      height: 100%;
      width: 100%;
    }

    mettle-virtual-list .hovered {
      background-color: hsl(24, 100%, 50%);
      cursor: pointer;
    }

    mettle-virtual-list .selected {
      background-color: hsl(60, 100%, 50%);
    }

    mettle-virtual-list .hovered.selected {
      background-color: hsl(233, 72%, 89%);
    }
  </style>
  `.trim()
}

const args = {
  dataDynamic: true,
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
    }
  },
  layout: 'fullscreen',
}




