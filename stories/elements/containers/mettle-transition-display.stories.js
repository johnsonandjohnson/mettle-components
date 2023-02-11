import '../../../src/containers/mettle-transition-display.js'

import { Constants } from '../../helper/index.js'

const DocsDescriptionMDX = `
<span className="tip">1.10.0</span>

**Single Import**
<pre class="coder">import '@johnsonandjohnson/mettle-components/src/containers/mettle-transition-display.js'</pre>

**Source Code**
<pre class="coder"><a href="https://github.com/johnsonandjohnson/mettle-components/blob/main/src/containers/mettle-transition-display.js" target="_blank">https://github.com/johnsonandjohnson/mettle-components/blob/main/src/containers/mettle-transition-display.js</a></pre>

Mettle transition display is used to display a HTML with scoped CSS.  This pairs well
as a route display for single page applications.

### How does it work

The transition display will take a string with a <code>&lt;template&gt;</code> to display the
HTML with a CSS transition in between.  The default transition is <code>opacity</code>
with a start value of 0 and ending value of 1.

## CSS Transitions

Note that CSS transitions can run at a cost of layout re-rendering or re-painting the page.
Is is recommended to use these these transitions that are not costly to the browser.

| Type | Value |
|:---------|:---------|
| Opacity | opacity: 0 to 1 |
| Translate | transform: translate(axis...) |
| Rotate | transform: translate(&lt;number&gt;deg) |
| Scale | transform: scale(&lt;number&gt;) |

<pre class="coder">
Sample to set other transitions

&lt;mettle-transition-display
  data-type="transform"
  data-start="scale(.5)"
  data-end="scale(1)"
  &gt;&lt;/mettle-transition-display&gt;
</pre>

## Adding HTML

In order to add HTML use the <code>async insertContent()</code> function.  It expects a
string with a <code>&lt;template&gt;&lt;/template&gt;</code> tag and optionally a
<code>&lt;style&gt;&lt;/style&gt;</code> for scoped CSS.

> Styles can still be applied from outside the component to the HTML

<pre class="coder">
const $component = globalThis.document.querySelector('mettle-virtual-list')

await $component.insertContent('&lt;template&gt;&lt;p&gt;Display 1&lt;/p&gt;&lt;/template&gt;&lt;style&gt;p { color: red; }&lt;/style&gt;')
</pre>

The Scoped styled work by replacing all selectors with the <code>::slotted()</code>
CSS selector and placing the HTML as a <code>slot</code>

## Container Style

You can style the shadow root container using CSS parts

<pre class="coder">
/\\* shadowRoot container \\*/
mettle-transition-display::part(container) {
  border: 1px solid black;
  background-color: wheat;
  height: 50vh;
}
</pre>

##See code samples below
`.trim()

export default {
  title: 'Custom Elements/Containers/Mettle-Transition-Display',
  argTypes: {
    dataType: {
      control: { type: 'null' },
      description: 'Set the CSS transition type.',
      name: 'data-type',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          summary: 'opacity',
        }
      }
    },
    dataStart: {
      control: { type: 'null' },
      description: 'Set the starting value for the transition.',
      name: 'data-start',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          summary: '0',
        }
      }
    },
    dataEnd: {
      control: { type: 'null' },
      description: 'Set the ending value for the transition.',
      name: 'data-end',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          summary: '1',
        }
      }
    },
    dataEnable: {
      control: { type: 'null' },
      description: 'Set to false to disable transition.',
      name: 'data-enable',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          summary: 'true',
        }
      }
    },

    insertContent: {
      description: 'Function to render the display with a <template> and optional <style> string.',
      name: 'async insertContent(content)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    addElementToContent: {
      description: 'Function to that utilizes insertAdjacentElement',
      name: 'addElementToContent(element, position = "beforeend")',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },

    partContainer: {
      description: 'The main display wrapper',
      name: '::part(container)',
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

const Template = () => {
  return `
    <p>Styles in the display are not leaked out</p>
    <button class="display1">Display 1</button>
    <button class="display2">Display 2</button>
    <mettle-transition-display></mettle-transition-display>
    <script>
    (() => {
      const $component = document.querySelector('mettle-transition-display')
      const $btn1 = document.querySelector('.display1')
      const $btn2 = document.querySelector('.display2')

      const HtmlCache = new Map()
      HtmlCache.set('display1.html', '<template><p>Display 1</p><h1>testing</h1></template><style>p { color: red; }</style>')
      HtmlCache.set('display2.html', '<template><p>Display 2</p><h1 class="test">testing</h1></template><style>p { color: blue; }  .test {background-color: silver;}</style>')

      $component.insertContent(HtmlCache.get('display1.html'))

      $btn1.addEventListener('click', () => {
        $component.insertContent(HtmlCache.get('display1.html'))
      })
      $btn2.addEventListener('click', () => {
        $component.insertContent(HtmlCache.get('display2.html'))
      })
    })()
    </script>

    <style>
      mettle-transition-display::part(container) {
        border: 1px solid black;
        background-color: wheat;
        height: 10rem;
      }

      p {
        font-weight: bold;
      }
    </style>
  `.trim()
}

const args = {
  dataType: 'opacity',
  dataStart: '0',
  dataEnd: '1',
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



const TemplateTransition = ({dataType, dataStart, dataEnd}) => {
  return `
    <p>The transform used with scale</p>
    <button class="display1">Display 1</button>
    <button class="display2">Display 2</button>
    <mettle-transition-display
    data-type="${dataType}"
    data-start="${dataStart}"
    data-end="${dataEnd}"
    >
    </mettle-transition-display>
    <script>
    (() => {
      const $component = document.querySelector('mettle-transition-display')
      const $btn1 = document.querySelector('.display1')
      const $btn2 = document.querySelector('.display2')

      const HtmlCache = new Map()
      HtmlCache.set('display1.html', '<template><p>Display 1</p><h1>testing</h1></template><style>p { color: red; }</style>')
      HtmlCache.set('display2.html', '<template><p>Display 2</p><h1 class="test">testing</h1></template><style>p { color: blue; }  .test {background-color: silver;}</style>')

      $component.insertContent(HtmlCache.get('display1.html'))

      $btn1.addEventListener('click', () => {
        $component.insertContent(HtmlCache.get('display1.html'))
      })
      $btn2.addEventListener('click', () => {
        $component.insertContent(HtmlCache.get('display2.html'))
      })
    })()
    </script>

    <style>
      mettle-transition-display::part(container) {
        border: 1px solid black;
        background-color: wheat;
        height: 10rem;
      }

      p {
        font-weight: bold;
      }
    </style>
  `.trim()
}

const TabNavigationMDX = `
Sample of a using <code>transform</code> for animations.
`.trim()

export const Transition = TemplateTransition.bind({})
Transition.args = {
  ...args,
  dataType: 'transform',
  dataStart: 'scale(.5)',
  dataEnd: 'scale(1)',
}
Transition.parameters = {
  docs: {
    description: {
      story: TabNavigationMDX,
    },
    inlineStories: false,
    source: {
      code: TemplateTransition(Transition.args)
    }
  },
  layout: 'fullscreen',
}
