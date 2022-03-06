import '../../../src/containers/mettle-virtual-list.js'

import { Constants } from '../../helper/index.js'

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

### How to use

The virtual list while is a custom element can only be updated by JavaScript. Once
you have the element selected you can render your items like so

<pre>
<code>
const $component = globalThis.document.querySelector('mettle-virtual-list')

$component.render({
  listItems: getListItemsSet(500),
  renderRow: () => document.createElement('div'),
  updateRow: (elem, data) => {
    elem.innerHTML = data
  }
})
</code>
</pre>


| param | Type | Description |
|:---------|:---------|
| listItems | Array | The large array of data to display for each row |
| renderRow | Function | The function used to clone each row |
| updateRow(elem, data) | Function | The function used to update each row. The Row and data for that row will be passed in. |


The render and update function can also leverage custom elements, add a class, etc.


<pre>
<code>
const $component = globalThis.document.querySelector('mettle-virtual-list')

$component.render({
  listItems: getListItemsSet(500),
  renderRow: () => {
    const elem = document.createElement('custom-tag')
    elem.classList.add('product-row')
    return elem
  },
  updateRow: (elem, data) => {
    elem.updateModel(data)
  }
})
</code>
</pre>


> Once rendered you have two options to update.

**Continue to use <code>render()</code>**

The render function can take in a single parameter like so as long as the
<code>renderRow</code> and <code>updateRow</code> functions have been previously defined.
It is important to note that when using the dynamic mode it will attempt to
calculate the height of rows where the data is different.

<pre>
<code>
let productsSearch = updatedResultsArray()

$component.render({
  listItems: productsSearch
})
</code>
</pre>

**appendItems() option**
While we recommend to just use the <code>render</code> function, in the case you
only need to append a new item to the current list use the <code>appendItems</code>
function like so

<pre>
<code>
const newItems = getNewListSet()

$component.appendItems(newItems)
</code>
</pre>

### No observed Attributes on <code>data-dynamic</code>

The choice was made to not observe the <code>data-dynamic</code> due to the nature
of the rendering process.  This attribute must be present before using the
render function.

### Class States

When hovering over the rows, a CSS part can be applied.  When a row is clicked,
the CSS part attribute will add <code>selected</code>.

<pre>
<code>
mettle-virtual-list::part(row):hover  {
  background-color: hsl(24, 100%, 50%);
  cursor: pointer;
}

mettle-virtual-list::part(selected) {
  background-color: hsl(60, 100%, 50%);
}

mettle-virtual-list::part(selected):hover  {
  background-color: hsl(233, 72%, 89%);
}
</code>
</pre>

### Event Dispatches

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

### Selected Row Event Bubbling

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

### Virtual List Height

The default behavior is that the virtual list will extend with <code>height: 100%;</code>
based on the parent height.  You can use CSS to override the container height.

<pre>
<code>
/* Override virtual list height of 100% */
mettle-virtual-list::part(container) {
  height: 50vh;
}
</code>
</pre>

> If the parent height is set to zero by default, the virtual list will not appear.

**Using <code>data-fixed-rows</code>**

If there is a number of fixed rows to display use the <code>data-fixed-rows="[number]"<code>
attribute.  It will set the container height to the rows largest height multiped by
the rows set.

> Recommended to not use <code>data-dynamic</code> with <code>data-fixed-rows</code>

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
    dataFixedRows: {
      control: { type: 'null' },
      description: 'Set if you want to display a fixed number of rows.',
      name: 'data-fixed-rows',
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

    partContainer: {
      description: 'Selector for the rows container that determines the view port',
      name: '::part(container)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    partRow: {
      description: 'Selector for the rows',
      name: '::part(row)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    partSelected: {
      description: 'Selector for the selected row, only applied after it is clicked',
      name: '::part(selected)',
      table: {
        category: Constants.CATEGORIES.CSS,
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

    mettle-virtual-list {
      height: 100%;
      width: 100%;
    }

    mettle-virtual-list::part(row)  {
      border-bottom: 1px solid blue;
      padding: 0.4rem;
    }

    mettle-virtual-list::part(row):hover  {
      background-color: hsl(24, 100%, 50%);
      cursor: pointer;
    }

    mettle-virtual-list::part(selected) {
      background-color: hsl(60, 100%, 50%);
    }

    mettle-virtual-list::part(selected):hover  {
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




