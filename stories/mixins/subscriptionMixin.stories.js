

import { Constants } from '../helper/index.js'

const DocsDescriptionMDX = `
**Single Import**
<pre class="coder">import { SubscriptionMixin } from '@johnsonandjohnson/mettle-components/mixins'</pre>

**Source Code**
<pre class="coder"><a href="https://github.com/johnsonandjohnson/mettle-components/blob/main/src/mixins/subscription.mixin.js" target="_blank">https://github.com/johnsonandjohnson/mettle-components/blob/main/src/mixins/subscription.mixin.js</a></pre>

<p>The Subscription mixin will take an array of registered observables and execute the
<code>unsubscribe()</code> function if the component is removed from the dom.</p>

> This is necessary to avoid memory leaks.


### How to mix

<p>This mixin just needs the <code>MixinDefs.Subscription</code> property appended with
all the Observables that the component is registered too.
</p>

<pre class="coder">
      connectedCallback() {
        this[this.MixinDefs.Subscription].push(
          UpdateService.subscribe({
            next: this.handleUpdate.bind(this)
          })
        )

        this[this.MixinDefs.Subscription].push(
          UserService.subscribe({
            next: this.handleUserUpdate.bind(this)
          })
        )
      }
</pre>

<p>Alternative approach</p>

<pre class="coder">
      connectedCallback() {
        this[this.MixinDefs.Subscription] = [
          UpdateService.subscribe({
            next: this.handleUpdate.bind(this)
          }),
          UserService.subscribe({
            next: this.handleUserUpdate.bind(this)
          }),
        ]
      }
</pre>


<h3>Override disconnectedCallback()</h3>

<p>This mixin uses the <code>disconnectedCallback()</code> function.  Be sure to
call the <code>super.disconnectedCallback()</code> function to ensure any stacked mixins
will execute.</p>

<pre class="coder">
      disconnectedCallback() {
        if (super.disconnectedCallback) {
          super.disconnectedCallback()
        }
        ...your logic here
      }
</pre>

`.trim()

export default {
  title: 'Mixins/Subscription Mixin',
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
    'MixinDefs.Subscription': {
      control: {
        type: null
      },
      description: 'The array of all added observables.',
      name: 'MixinDefs.Subscription',
      table: {
        category: Constants.CATEGORIES.GET_SET,
        defaultValue: {
          summary: '[]',
        }
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
  <p>Subscription Count: <span id="count"></span></p>
  <update-table></update-table>
  <button id="remove">Remove Table</button>

  <script type="module">
    import SubscriptionMixin from './mixins/subscription.mixin.js'
    import Observable from './services/observable.js'

    const HTML = '<p>Last Update: <span></span></p>'
    const BASE = SubscriptionMixin(globalThis.HTMLElement)
    const TAG_NAME = 'update-table'

    class UpdateService extends Observable {
      constructor() {
        super()
      }

      getUpdates() {
        globalThis.clearInterval(this.timeout)
        this.timeout = setInterval(() => {
          this.notify({
            lastUpdate: new Date().toLocaleString()
          })
        }, 1000)
      }
    }

    const updateService = new UpdateService()
    const $spanCount = document.querySelector('#count')
    document.querySelector('#remove').addEventListener('click', () => {
      document.querySelector('update-table').remove()
    })
    updateService.subscribe({
      next: () => {
        $spanCount.innerHTML = updateService.observers.size
      }
    })
    if (!window.customElements.get(TAG_NAME)) {
      window.customElements.define(TAG_NAME, class extends BASE {
        constructor() {
          super('')
        }

        connectedCallback() {
          this.innerHTML = HTML
          this.$span = this.querySelector('span')

          this[this.MixinDefs.Subscription].push(
            updateService.subscribe({
              next: this.handleUpdate.bind(this)
            })
          )
          updateService.getUpdates()
        }

        handleUpdate(payload) {
          this.$span.innerHTML = payload?.lastUpdate
        }

      })
    }


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
