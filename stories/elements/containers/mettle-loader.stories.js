import '../../../src/containers/mettle-loader.js'
import '../../../src/informational/mettle-skeleton.js'
import './loader.css'
import { Constants, generateHTMLParagraphs } from '../../helper/index.js'


const DocsDescriptionMDX = `
**Single Import**
<pre class="coder">import '@johnsonandjohnson/mettle-components/src/containers/mettle-loader.js'</pre>

**Source Code**
<pre class="coder"><a href="https://github.com/johnsonandjohnson/mettle-components/blob/main/src/containers/mettle-loader.js" target="_blank">https://github.com/johnsonandjohnson/mettle-components/blob/main/src/containers/mettle-loader.js</a></pre>


Useful when you want to toggle between hiding and showing content.

`.trim()

export default {
  title: 'Custom Elements/Containers/Mettle-Loader',
  argTypes: {
    dataLoading: {
      control: { type: 'boolean' },
      description: 'Set if you want to display the content as loading.',
      name: 'data-loading',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          summary: 'false',
        }
      }
    },
    dataInanimate: {
      control: { type: 'boolean' },
      description: 'Set if you want to stop the animation on the loader.',
      name: 'data-inanimate',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          summary: 'false',
        }
      }
    },
    dataSize: {
      control: { type: 'select', options: ['fit', 'small', 'medium', 'large'] },
      description: 'Set if you want to have a pre-determined size as the content is loading.',
      name: 'data-size',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          summary: 'fit',
        }
      }
    },
    slot: {
      control: { type: 'text' },
      description: 'Text or HTML used to display.',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },
    slotLoader: {
      control: { type: 'text' },
      description: 'Text or HTML used to display.',
      name: 'name="loader"',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },
    content: {
      description: 'Main content area can be styled',
      name: '::part(content)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    loader: {
      description: 'Loader content area can be styled',
      name: '::part(loader)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    isLoading: {
      description: 'Function returns a boolean value of the loading state',
      name: 'isLoading()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    loading: {
      description: 'Function to set the state to loading',
      name: 'loading()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    done: {
      description: 'Function to remove the state from loading',
      name: 'done()',
      table: {
        category: Constants.CATEGORIES.METHODS,
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

const Template = ({Class = '', dataInanimate = false, dataLoading = true, dataSize = '', slotLoader = '', slot = '<p>Slot HTML/Text</p>' }) => {
  return `<mettle-loader
    class="${Class}"
    data-size="${dataSize}"
    data-inanimate="${dataInanimate}"
    data-loading="${dataLoading.toString()}">
    ${slot}
    ${slotLoader}
    </mettle-loader>`.trim()
}

const args = {

}

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

export const LargeContent = Template.bind({})
LargeContent.args = {
  ...args,
  dataSize: 'large',
  slot: generateHTMLParagraphs(20)
}
LargeContent.parameters = {
  docs: {
    source: {
      code: Template(LargeContent.args)
    }
  },
}


export const SlotLoader = Template.bind({})
SlotLoader.args = {
  ...args,
  Class: 'test',
  dataSize: 'small',
  slotLoader: svgLoader(),
  slot: '',
}
SlotLoader.parameters = {
  docs: {
    description: {
      story: 'The loader can be replaced with a custom one.',
    },
    source: {
      code: customStyle() + '\n' + Template(SlotLoader.args)
    }
  },
}


export const SkeletonLoader = Template.bind({})
SkeletonLoader.args = {
  ...args,
  dataSize: 'medium',
  slotLoader: skeletonLoader(),
  slot: '',
}
SkeletonLoader.parameters = {
  docs: {
    description: {
      story: 'The loader can be replaced with a the Skeleton-Loader.',
    },
    source: {
      code: Template(SkeletonLoader.args)
    }
  },
}

function svgLoader() {
  return `
  <div class="svg-loader" slot="loader">
    <svg version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
      <circle stroke="none" cx="6" cy="50" r="6">
        <animate
          attributeName="opacity"
          dur="1s"
          values="0;1;0"
          repeatCount="indefinite"
          begin="0.1"/>
      </circle>
      <circle stroke="none" cx="26" cy="50" r="6">
        <animate
          attributeName="opacity"
          dur="1s"
          values="0;1;0"
          repeatCount="indefinite"
          begin="0.2"/>
      </circle>
      <circle stroke="none" cx="46" cy="50" r="6">
        <animate
          attributeName="opacity"
          dur="1s"
          values="0;1;0"
          repeatCount="indefinite"
          begin="0.3"/>
      </circle>
    </svg>
  </div>
  `.trim()
}


function skeletonLoader() {
  return `
    <mettle-skeleton data-color="lightgray" slot="loader">
      <area shape="rect" coords="90,15,300,30" />
      <area shape="rect" coords="10,100,600,40" />
      <area shape="rect" coords="10,150,600,40" />
      <area shape="rect" coords="10,200,600,40" />
      <area shape="rect" coords="10,250,600,40" />
      <area shape="circle" coords="10,0,30" />
    </mettle-skeleton>
  `.trim()
}

function customStyle() {
  return `
  <style>
  mettle-loader.test {
    --hue-color: 250;
  }

  mettle-loader.test::part(content) {
    min-height: 100px;
  }

  .svg-loader {
    align-items: center;
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .svg-loader svg {
    display:inline-block;
    height: 100px;
    fill: #222;
    width: 100px;
  }
</style>`.trim()
}



const TemplateScript = (args) => {
  return `
  ${Template(args)}

  <button class="loading">Loading()</button>
  <button class="done">Done()</button>

  <script>
    const $component = globalThis.document.querySelector('mettle-loader.${args.Class}')

    globalThis.document.querySelector('button.loading').addEventListener('click', ()=> {
      $component.loading()
    })

    globalThis.document.querySelector('button.done').addEventListener('click', ()=> {
      $component.done()
    })
  </script>
  `.trim()
}

export const Script = TemplateScript.bind({})
Script.args = {
  ...args,
  Class: 'js'
}
Script.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'JavaScript sample on how to use the methods',
    },
    source: {
      code: TemplateScript(Script.args)
    },
  },
}
