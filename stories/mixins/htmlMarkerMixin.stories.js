

import { Constants } from '../helper/index.js'

const DocsDescriptionMDX = `
**Single Import**
<pre class="coder">import { HTMLMarkerMixin } from '@johnsonandjohnson/mettle-components/mixins'</pre>

**Source Code**
<pre class="coder"><a href="https://github.com/johnsonandjohnson/mettle-components/blob/main/src/mixins/html-marker.mixin.js" target="_blank">https://github.com/johnsonandjohnson/mettle-components/blob/main/src/mixins/html-marker.mixin.js</a></pre>

HTML Marker Mixin allows a user to update an HTML template literal efficiently without having to re-render the DOM(Document Object Model).
It uses the HTML Marker class and requires some code integration with the custom element.

<h3>How to mix</h3>

This mixin at minium needs the render function to apply the HTML and markers needed
for the component.  This should happen when the component is attached to the dom and
will need to be an async function so the render function is completed before use.

<p><strong>Do use async</strong></p>
<p>
When a custom element is attached to the dom it will execute the <code>connectedCallback()</code>
function. Normally this is where you will also want to make your dom selections but
wait for he HTMLMarker class to finishing rendering.</p>

<pre class="coder">
      async connectedCallback() {
        await this[MixinDefs.HTMLMarker].render(this, HTML)
        $form = this.querySelector('form')
        $form.addEventListener()
      }
</pre>


<p><strong>A default data model override is encouraged</strong></p>
<p>
The default data model is not needed to render the HTML Marker but it will
help the developer know the variables needed or used in the HTML. This is also
available to have the rendered HTML start with data or a reset. You can override
the function like so.</p>

<pre class="coder">
      get MixinDefs.DefaultDataModel]() {
        return Object.assign(Object.create(null), {
          name: 'Ben',
          location: 'Boston',
        })
      }
<pre>



<p><strong>This wont work</strong></p>

<p>Remember that while the functions and properties are inherited,
using <code>this.MixinDefs</code> will not work on function definitions
but will work if used within a function.</p>

<pre class="coder">
      get [this.MixinDefs.DefaultDataModel]() {
        return {...}
      }

      updateModel(dataModel) {
        this[this.MixinDefs.updateDataModel](dataModel)
      }
<pre>


<p>Instead define a constant variable that the function override
definition can use.  Also include the default model with the render function</p>

<pre class="coder">
      const BASE = HTMLMarkerMixin(globalThis.HTMLElement)
      const MixinDefs = BASE.MixinDefs

      get [MixinDefs.DefaultDataModel]() {
        return {...}
      }

      async connectedCallback() {
        await this[MixinDefs.HTMLMarker].render(this, HTML, this[MixinDefs.DefaultDataModel])
      }
<pre>

<p><strong>Updating the data model</strong></p>

<p>The data model is updated using the <code>Object.assign</code> function then
passed to the <code>updateModel()</code> function on the HTMLMarker class.
use the <code>MixinDefs.updateDataModel()</code> function to make the update.
The updated data is best served from a service where it is managed if possible</p>

<pre class="coder">
      async connectedCallback() {
        await this[MixinDefs.HTMLMarker].render(this, HTML, this[MixinDefs.DefaultDataModel])

          UserService.subscribe({
            next: (userData) => {
              this[MixinDefs.onModelUpdate]({
                name: userData.fullName,
                location: userData.city,
              })
            }
          })
      }
<pre>

<p>If the data has been mutated for the UI then something more simple can be done</p>

<pre class="coder">
      async connectedCallback() {
        await this[MixinDefs.HTMLMarker].render(this, HTML, this[MixinDefs.DefaultDataModel])

          UserService.subscribe({
            next:this[MixinDefs.onModelUpdate].bind(this)
          })
      }
<pre>


<h3>Not Recommended</h3>

<p>It is not recommended to use the data model as a source of truth.  A service
is better suited to handle the data.  Keep the data model as a one way update.</p>

<pre class="coder">
      notRecommendSave() {
        // safeCopy makes sure data is not referenced
        const dataCopy = safeCopy(this[MixinDefs.DataModel])
        UserService.save(dataCopy)
      }
<pre>

<p>It is not recommended to override the update model to mutate the data model.
This should be handled in a service where single source of truth is consistent. </p>

<pre class="coder">
      [MixinDefs.onModelUpdate]() {
        /* better to do this in a service */
        this[MixinDefs.DataModel].isEasternTime = UserService.Data.some((user) => user.timezone.isEST === true)
        super[MixinDefs.onModelUpdate]()
      }
<pre>

<h3>Unit Testing</h3>

<p>
When the <code>connectedCallback()</code> is async that can skew unit testing.  The
trick is to give the dom a bit of time to finish executing the <code>connectedCallback()</code>
function before testing.  Calling the <code>connectedCallback()</code> using an await
can work but it not recommended.  It can cause unknown side effects to run the
<code>connectedCallback()</code> function twice during testing.
</p>

<p>Use a wait function like the example before so the component has enough time
to attach to the dom. This example uses karma/jasmine since it runs the test
on an actual browser.</p>

<pre class="coder">
      const wait = ms => new Promise(r => setTimeout(r, ms))
      const ELEM_TAG_NAME = 'user-info'

      describe(ELEM_TAG_NAME, () => {

        let $el
        const elemTag = ELEM_TAG_NAME

        before(async () => {
          $el = globalThis.document.createElement(ELEM_TAG_NAME)
          globalThis.document.body.appendChild($el)
          //await $el.connectedCallback()
          await wait(500)
        })

        after(() => {
          $el.remove()
          $el = null
        })

        describe('interface', () => {

          it('should be defined', async () => {
            expect($el).toBeDefined()
            expect(globalThis.customElements.get(ELEM_TAG_NAME)).toBeDefined()
          })

          it('should be an Element node ', async () => {
            expect($el.nodeType).toEqual(Node.ELEMENT_NODE)
          })

        })

        describe('component', () => {

          it('should have a table with data', () => {
            const $table = $el.querySelector('table')
            expect($table).not.toBeNull()
          })

        })

      })
<pre>


`.trim()

export default {
  title: 'Mixins/HTML Marker Mixin',
  argTypes: {
    MixinDefs: {
      control: {
        type: null
      },
      description: 'Getter that will return an object of Symbols used as namespaces.',
      name: 'MixinDefs',
      table: {
        category: Constants.CATEGORIES.GET_SET,
      }
    },
    'MixinDefs.DefaultDataModel': {
      control: {
        type: null
      },
      description: 'The Default JSON data model.',
      name: 'MixinDefs.DefaultDataModel',
      table: {
        category: Constants.CATEGORIES.GET_SET,
        defaultValue: {
          summary: '{}',
        }
      }
    },
    'MixinDefs.DataModel': {
      control: {
        type: null
      },
      description: 'The JSON data model that will be used to update the HTMLMarker template literal(s).',
      name: 'MixinDefs.DataModel',
      table: {
        category: Constants.CATEGORIES.GET_SET,
        defaultValue: {
          summary: 'MixinDefs.DefaultDataModel',
        }
      }
    },
    'MixinDefs.resetDataModel': {
      control: {
        type: null
      },
      description: 'Function that set all the template literal(s) to the DefaultDataModel.',
      name: 'MixinDefs.resetDataModel()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    'MixinDefs.onModelUpdate': {
      description: 'Function to add template literal functions that can be used to update a model data before rendering.',
      name: 'MixinDefs.onModelUpdate()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    'MixinDefs.updateDataModel': {
      description: 'Function to update the data model and the template literals.',
      name: 'MixinDefs.updateDataModel(DataModelUpdate)',
      table: {
        category: Constants.CATEGORIES.METHODS,
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
  return `
  <p>
    <label for="name">Name</label> <input id="name" />
    <button id="model">Update</button>
  </p>

  <user-table></user-table>

  <script type="module">
    import HTMLMarkerMixin from './mixins/html-marker.mixin.js'

    const HTML = \`
        <table border="1" cellpadding="10">
          <tr>
            <th>Name</th>
            <th>Location</th>
          </tr>
          <tr>
            <td>\\\${name}</td>
            <td>\\\${location}</td>
        </tr>
      </table>
    \`
    const BASE = HTMLMarkerMixin(globalThis.HTMLElement)
    const TAG_NAME = 'user-table'
    const MixinDefs = BASE.MixinDefs

    if (!window.customElements.get(TAG_NAME)) {
      window.customElements.define(TAG_NAME, class extends BASE {
        constructor() {
          super('')
        }
        async connectedCallback() {
          await this[MixinDefs.HTMLMarker].render(this, HTML, this[MixinDefs.DefaultDataModel])
        }

        updateModel(dataModel) {
          this[MixinDefs.updateDataModel](dataModel)
        }

        get [MixinDefs.DefaultDataModel]() {
          return Object.assign(Object.create(null), {
            name: 'Ben',
            location: 'Boston',
          })
        }
      })
    }

    const $btn = document.querySelector('#model')
    const $nameInput = document.querySelector('#name')
    const $userTable = document.querySelector('user-table')

    $btn.addEventListener('click', () => {
      if($nameInput.value.length) {
        $userTable.updateModel({
          name: $nameInput.value
        })
      }
    })

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
      story: 'Default Sample Code.',
    },
    source: {
      code: Template(Default.args)
    },
  },
  layout: 'fullscreen',
}
