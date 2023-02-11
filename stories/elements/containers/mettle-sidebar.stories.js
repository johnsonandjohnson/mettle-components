import '../../../src/containers/mettle-sidebar.js'
import './sidebar.css'

import { Constants, uuid } from '../../helper/index.js'

const DocsDescriptionMDX = `
<span className="tip">1.11.0</span>

**Single Import**
<pre class="coder">import '@johnsonandjohnson/mettle-components/src/containers/mettle-sidebar.js'</pre>

**Source Code**
<pre class="coder"><a href="https://github.com/johnsonandjohnson/mettle-components/blob/main/src/containers/mettle-sidebar.js" target="_blank">https://github.com/johnsonandjohnson/mettle-components/blob/main/src/containers/mettle-sidebar.js</a></pre>


Used to provide a sliding side information panel for an element.

### How does it work

The sidebar takes a <code>data-for</code> attribute which must be an id of an element on the page.
The sidebar is then attached to this specified element and is sized accordingly to fit within the element and move with the element as well.
If the specified id is for a body tag, the sidebar acts as a fixed informational panel which is sized to
fit the whole page's height and doesn't scroll with the page.
`.trim()

export default {
  title: 'Custom Elements/Containers/Mettle-Sidebar',
  component: 'Mettle-Sidebar',
  argTypes: {
    slot: {
      control: { type: 'null' },
      description: 'Text or HTML that is displayed within the component. Add a css width to this element that matches the width of the sidebar to prevent text from moving when opening/closing the component.',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },
    position: {
      control: { type: 'null' },
      description: 'Set the position [left, right] of the sidebar based on an element. Component updates accordingly if attribute is changed.',
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
      description: 'The id of the element the sidebar is associated to. Component updates accordingly if this attribute is changed to id of other element. If attribute is changed to id that doesn\'t exist, component is removed from DOM. If attribute is associated with id from a body tag, the component turns into a main-page informational panel that is fixed to the screen.',
      name: 'data-for',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          detail: 'This is a generated ID, you must supply it.',
          summary: uuid(),
        }
      }
    },
    width: {
      control: { type: 'null'},
      description: 'The width of the sidebar when expanded. Component updates accordingly if attribute is changed.',
      name: 'data-width',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          summary: '10rem',
        }
      }
    },
    open: {
      description: 'If specified, the sidebar is opened. Can be used to control opening/closing of the component.',
      name: 'data-open',
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
        category: Constants.CATEGORIES.METHODS,
      }
    },
    OPENED: {
      description: 'The event when the sidebar is opened.',
      name: 'opened',
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
      name: 'closed',
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
        component: DocsDescriptionMDX
      },
    },
  },
}

const Template = ({Class = 'template',  id = `id-${uuid()}`, position, width, slot = 'Slot HTML/Text' }) => {
  return `
    <div class="elem" id="${id}">Click to open sidebar</div>
    <mettle-sidebar
      class="${Class}"
      data-position="${position}"
      data-width="${width}"
      data-for="${id}"
    >
      <div class="slot">${slot}</div>
    </mettle-sidebar>
    <script>
      const $component = globalThis.document.querySelector('mettle-sidebar')

      globalThis.document.querySelector('div.elem').addEventListener('click', () => {
        $component.toggle()
      })
    </script>

    <style>
      .slot {
        width: 8rem;
      }
    </style>
    `.trim()
}

const NonJSTemplate = ({Class = '',  id = `id-${uuid()}`, position, width, slot = 'Slot HTML/Text' }) => {
  return `
    <div class="elemScript" id="${id}">Element that sidebar is attached to</div>
    <mettle-sidebar
      class="${Class}"
      data-position="${position}"
      data-width="${width}"
      data-for="${id}"
    >
      <div class="slot">${slot}</div>
    </mettle-sidebar>

    <style>
      .slot {
        width: 8rem;
      }
    </style>
    `.trim()
}

const args = {
  position: 'left',
  width: '8rem',
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
  layout: 'centered',
}

const TemplateScript = (args) => {
  return `
  <div class="contain">
    <button class="open">open()</button>
    <button class="close">close()</button>
    <button class="toggle">toggle()</button>

  </div>
  ${NonJSTemplate(args)}

  <script>
    const $JScomponent = globalThis.document.querySelector('mettle-sidebar')

    globalThis.document.querySelector('button.open').addEventListener('click', () => {
      $JScomponent.open()
    })
    globalThis.document.querySelector('button.close').addEventListener('click', () => {
      $JScomponent.close()
    })
    globalThis.document.querySelector('button.toggle').addEventListener('click', () => {
      $JScomponent.toggle()
    })
  </script>
  `.trim()
}

export const Script = TemplateScript.bind({})
Script.args = {
  ...args
}
Script.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'Javascript sample on how to use the methods',
    },
    source: {
      code: TemplateScript(Script.args)
    },
  },
  layout: 'fullscreen',
}

const attributeTemplate = ({Class = '',  id1 = `id-${uuid()}`, id2 = `id-${uuid()}`, position, width, slot = 'Slotted HTML/Elements' }) => {
  return `
  <button class="switch">Switch Sidebar data-for</button>
  <button class="toggleElem">Toggle Sidebar</button>

  <div class="containerAttribute">
    <div class="elemAttribute" id="${id1}">First Element</div>
    <div class="elemAttribute" id="${id2}">Second Element</div>
  <div>
  <mettle-sidebar
    class="${Class}"
    data-position="${position}"
    data-width="${width}"
    data-for="${id1}"
  >
    <div class="slot">${slot}</div>
  </mettle-sidebar>

  <style>
    .slot {
      width: 10rem;
    }
  </style>

  <script>
    const $switchingComponent = globalThis.document.querySelector('mettle-sidebar')

    globalThis.document.querySelector('button.switch').addEventListener('click', () => {
      if ($switchingComponent.getAttribute('data-for') === '${id1}') {
        $switchingComponent.setAttribute('data-for', '${id2}')
      } else {
        $switchingComponent.setAttribute('data-for', '${id1}')
      }

    })
    globalThis.document.querySelector('button.toggleElem').addEventListener('click', () => {
      $switchingComponent.toggle()
    })
  </script>
  `.trim()
}

export const attribute = attributeTemplate.bind({})
attribute.args = {
  position: 'right',
  width: '6rem'
}
attribute.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'Story showcasing the different options and use cases of the sidebar\'s attributes. The <code>data-position</code> attribute can be set to \'right\' to have the sidebar open from the right of an element. The <code>data-width</code> attribute can be changed to control the width of the sidebar when it is opened. The <code>data-for</code> attribute can be changed to a different element\'s id to change which element the sidebar is attached to.',
    },
    source: {
      code: attributeTemplate(attribute.args)
    },
  },
  layout: 'fullscreen',
}

const styleTemplate = ({Class = '',  id = `id-${uuid()}`, position, width, slot = 'Slotted HTML/Elements' }) => {
  return `
    <button class="styleToggle">toggle()</button>

    <div class="elemStyle" id="${id}">Click to open sidebar</div>
    <mettle-sidebar
      class="${Class}"
      data-position="${position}"
      data-width="${width}"
      data-for="${id}"
    >
      <div class="slot">${slot}</div>
    </mettle-sidebar>


    <style>
      .slot {
        width: 8rem;
      }
      ::part(container) {
        transition: width .2s ease-in-out;
        background-color: #616161;
        color: white;
      }
    </style>

    <script>
      const $largeComponent = globalThis.document.querySelector('mettle-sidebar')

      globalThis.document.querySelector('button.styleToggle').addEventListener('click', () => {
        $largeComponent.toggle()
      })
    </script>
  `.trim()
}

export const style = styleTemplate.bind({})
style.args = {
  ...args
}
style.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'CSS Style demo. Using <code>::part(container)</code> the transition can be changed along with z-index and any other styling for the slotted element.',
    },
    source: {
      code: styleTemplate(style.args)
    },
  },
  layout: 'fullscreen',
}
