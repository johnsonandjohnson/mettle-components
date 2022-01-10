

import { Constants } from '../helper/index.js'

const DocsDescriptionMDX = `
HTML Marker allows a user to update an HTML template literal efficiently without having to re-render the DOM(Document Object Model).
This allows the page to render more effectively. Due to some limitations not all template features that are native are supported.

### How does it work

HTML Marker will take a HTML template literal in the form of a string. It will find all literal properties and mark a reference
in the HTML using HTML comments.  Once the data model is updated, it will only update the template literal values.

`
export default {
  title: 'Services/HTML Marker',
  argTypes: {
    render: {
      control: {
        type: null
      },
      description: 'Function to take in the DOM place holder and setup the string literal.',
      name: 'render(target, templateString, [initialModel])',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    updateModel: {
      control: {
        type: null
      },
      description: 'Function that will update the DOM with the new data model values.',
      name: 'updateModel(dataModel)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    addBooleanAttribute: {
      control: {
        type: null
      },
      description: 'Function that will update the HTML Boolean list with the new value in the case a boolean attribute value is missing.',
      name: 'addBooleanAttribute(boolAttr)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    addDecorator: {
      description: 'Function to add template literal functions that can be used to update a model data before rendering.',
      name: 'addDecorator(name, func)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    $_arrayMarker: {
      control: {
        type: null
      },
      description: 'Decorator used to track array values',
      name: '$_arrayMarker("ArrayModelName", "ArrayTemplateName")',
      table: {
        category: Constants.CATEGORIES.DECORATORS,
      }
    },
    $_removeHTML: {
      control: {
        type: null
      },
      description: 'Decorator used to remove HTML from the data model',
      name: '$_removeHTML(ModelData)',
      table: {
        category: Constants.CATEGORIES.DECORATORS,
      }
    },
    $_allowHTML: {
      control: {
        type: null
      },
      description: 'Decorator used to render and display the HTML from the data model',
      name: '$_allowHTML(ModelData)',
      table: {
        category: Constants.CATEGORIES.DECORATORS,
      }
    },
  },
  parameters: {
    docs: {
      description: {
        component: DocsDescriptionMDX
      },
      source: {
        state: 'open',
      },
    },
  },
}

const Template = () => {
  return `<div id="render"></div>

  <script type="module">
    import HtmlMarker from './html-marker.js'

    (async () => {
      const htmlMarker = new HtmlMarker()
      const htmlString = '<p id="\${id}">This is the value for test: \${test}</p><p>This is the removed HTML Value: \${$_removeHTML(test)}</p><p>This is the allow HTML value: \${$_allowHTML(test)}</p> <p>List Items: \${itemsLength}</p> <ul>\${$_arrayMarker("items", "arrTemplate")}</ul>'
      const div = document.querySelector('#render')

      let model = {
        id: new Date().getTime(),
        items: [
          {val:'<em>1</em>'},
          {val:'2&k'}, {val:'3'},
          {val:'4'},
          {val:'5'}
        ],
        test: '<strong>this is a test</strong>',
        arrTemplate: (items, i) => \`<li>\\\${items\${i}.val}</li>\`
      }
      model.itemsLength = model.items.length
      await htmlMarker.render(div, htmlString, model)

      window.setInterval(() => {
        model = Object.assign(model, { test: \`<strong>\${new Date().getTime()}</strong>\` })
        htmlMarker.updateModel(model)
      }, 1000)
    })()
  </script>`.trim()
}



const args = {}

export const Default = Template.bind({})
Default.args = {
  ...args
}


Default.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'Sample of HTML Marker.',
    },
    source: {
      code: Template(Default.args)
    },
  },
  layout: 'fullscreen',
}


const TemplateCustomDecorator = () => {
  return `<div id="render"></div>

  <script type="module">
    import HtmlMarker from './html-marker.js'

    (async () => {
      const htmlMarker = new HtmlMarker()
      htmlMarker.addDecorator('ListFormat', (input) => {
        const formatter = new Intl.ListFormat()
        return formatter.format(input)
      })
      const htmlString = '<p>The List of vehicles are: \${ListFormat(vehicles)}</p>'
      const div = document.querySelector('#render')

      let model = {
        vehicles: ['Motorcycle', 'Bus', 'Car']
      }
      await htmlMarker.render(div, htmlString, model)

      window.setInterval(() => {
        model.vehicles.sort((a, b) => 0.5 - Math.random())
        htmlMarker.updateModel(model)
      }, 3000)
    })()
  </script>`.trim()
}

export const CustomDecorator = TemplateCustomDecorator.bind({})
CustomDecorator.args = {
  ...args
}


CustomDecorator.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'Sample of how to add and use a custom decorator.  Decorators will take the model value and display',
    },
    source: {
      code: TemplateCustomDecorator(CustomDecorator.args)
    },
  },
  layout: 'padded',
}





const TemplateBoolean = () => {
  return `<div id="render"></div>

  <script type="module">
    import HtmlMarker from './html-marker.js'

    (async () => {
      const htmlMarker = new HtmlMarker()
      const htmlString = '<button disabled="\${disabled}">Random Disabled</button>'
      const div = document.querySelector('#render')

      let model = {
        disabled: 'disabled'
      }
      await htmlMarker.render(div, htmlString, model)

      window.setInterval(() => {
        model.disabled = (Math.random() >= 0.5) ? 'disabled' : ''
        htmlMarker.updateModel(model)
      }, 1000)
    })()
  </script>`.trim()
}

export const BooleanMarker = TemplateBoolean.bind({})
BooleanMarker.args = {
  ...args
}


BooleanMarker.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'Sample of how to set a boolean value.  Set boolean values as you would in HTML. hidden="hidden", open="open", readonly="readonly" etc.  If the Boolean value is empty it will remove it.',
    },
    source: {
      code: TemplateBoolean(BooleanMarker.args)
    },
  },
  layout: 'padded',
}


const TemplateAttribute = () => {
  return `<div id="render2"></div>

  <script type="module">
    import HtmlMarker from './html-marker.js'

    (async () => {
      const htmlMarker = new HtmlMarker()
      const htmlString = '<p data-custom="prefix_\${custom}_suffix" class="bold \${color}">Random class</p>'
      const div = document.querySelector('#render2')

      let model = {
        color: 'red',
        custom: 'test'
      }
      await htmlMarker.render(div, htmlString, model)

      window.setInterval(() => {
        model.color = (Math.random() >= 0.5) ? 'red' : 'green'
        model.custom = new Date().getTime()
        htmlMarker.updateModel(model)
      }, 1000)
    })()
  </script>`.trim()
}

export const AttributeMarker = TemplateAttribute.bind({})
AttributeMarker.args = {
  ...args
}


AttributeMarker.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'Sample of how to set an attribute value.',
    },
    source: {
      code: TemplateAttribute(AttributeMarker.args)
    },
  },
  layout: 'padded',
}
