

import { Constants } from '../helper/index.js'

const DocsDescriptionMDX = `
<span className="tip">1.13.0</span>

**Single Import**
<pre class="coder">import { OnRemoveMixin } from '@johnsonandjohnson/mettle-components/mixins'</pre>

**Source Code**
<pre class="coder"><a href="https://github.com/johnsonandjohnson/mettle-components/blob/main/src/mixins/on-remove.mixin.js" target="_blank">https://github.com/johnsonandjohnson/mettle-components/blob/main/src/mixins/on-remove.mixin.js</a></pre>

<p>The onRemove mixin will execute a callback function when an observed
element is removed from the dom.</p>

<h3>How to mix</h3>

<p>This mixin just needs the <code>MixinDefs.onRemove</code> function called.
</p>

<pre class="coder">
      connectedCallback() {
        this[this.MixinDefs.onRemove](element, onDetachCallback)
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
  title: 'Mixins/On Remove Mixin',
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
    'MixinDefs.onRemove': {
      control: {
        type: null
      },
      description: 'The function to observe an element and execute a callback when removed from the dom.',
      name: 'MixinDefs.onRemove(element, onDetachCallback)',
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
  <remove-status data-for="remove"></remove-status>
  <button id="remove">Remove Me</button>

  <script type="module">
    import OnRemoveMixin from './mixins/on-remove.mixin.js'

    const BASE = OnRemoveMixin(globalThis.HTMLElement)
    const TAG_NAME = 'remove-status'

    const $removeBtn = document.querySelector('#remove')
    $removeBtn.addEventListener('click', $removeBtn.remove.bind($removeBtn))

    if (!window.customElements.get(TAG_NAME)) {
      window.customElements.define(TAG_NAME, class extends BASE {
        constructor() {
          super('')
        }

        connectedCallback() {
          this.innerHTML = '<p>Status: <span>Connected to Button</span></p>'
          this.$span = this.querySelector('span')
          const ID = this.getAttribute('data-for')
          const $elem = document.getElementById(ID)
          this[this.MixinDefs.onRemove]($elem, this.handleUpdate.bind(this))
        }

        handleUpdate() {
          this.$span.innerHTML = 'Button removed'
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




const TemplateRemoveSelf = () => {
  return `
  <remove-me data-for="remove"></remove-me>
  <button id="remove">Remove Me</button>

  <script type="module">
    import OnRemoveMixin from './mixins/on-remove.mixin.js'

    const BASE = OnRemoveMixin(globalThis.HTMLElement)
    const TAG_NAME = 'remove-me'

    const $removeBtn = document.querySelector('#remove')
    $removeBtn.addEventListener('click', $removeBtn.remove.bind($removeBtn))

    if (!window.customElements.get(TAG_NAME)) {
      window.customElements.define(TAG_NAME, class extends BASE {
        constructor() {
          super('')
        }

        connectedCallback() {
          this.innerHTML = '<p>I will be removed when the button is clicked</p>'
          const ID = this.getAttribute('data-for')
          const $elem = document.getElementById(ID)
          this[this.MixinDefs.onRemove]($elem, this.remove.bind(this))
        }

      })
    }
  </script>`.trim()
}

export const RemoveSelf = TemplateRemoveSelf.bind({})
RemoveSelf.args = {
  ...args
}


RemoveSelf.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'Sample of how to remove the element when the observed element is removed.',
    },
    source: {
      code: TemplateRemoveSelf(RemoveSelf.args)
    },
  },
  layout: 'padded',
}
