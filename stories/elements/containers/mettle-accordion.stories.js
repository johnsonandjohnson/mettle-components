import '../../../src/containers/mettle-accordion.js'
import './accordion.css'

import { Constants, generateParagraph } from '../../helper/index.js'


export default {
  title: 'Custom Elements/Containers/Mettle-Accordion',
  argTypes: {
    paragraphs: {
      control: { type: 'select', options: ['1', '2', '3'] },
    },
    collapseAll: {
      description: 'Close all accordions',
      name: 'collapseAll()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    openAll: {
      description: 'Open all accordions',
      name: 'openAll()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Enhance the native semantic HTML using details/summary. Useful when you want to toggle between hiding and showing content.',
      },
    },
  },
}

const Template = ({Class = '', paragraphs = 1}) => {
  let sections = ''
  paragraphs = ~~paragraphs
  for (let i = 0; i < paragraphs; i++) {
    sections += `
    <details>
      <summary>
        Show Details ${i+1}
      </summary>
      <p>${generateParagraph()}</p>
    </details>
    `.trim()
  }
  return `
<mettle-accordion class="${Class}">
  ${sections}
</mettle-accordion>`.trim()
}

const args = {
  paragraphs: 1,
}

export const Default = Template.bind({})
Default.args = {
  ...args
}
Default.parameters = {
  docs: {
    source: {
      code: Template(Default.args)
    },
  },
}

const TemplateStyle = (args) => {
  return `
  ${Template(args)}

  <style>
    mettle-accordion.styled details {
      background-color: #359;
      border-radius: 8px;
      box-shadow: 0 0 3px 0 #333;
      color: #fff;
      margin-bottom: 1rem;
      width: 50rem;
    }

    mettle-accordion.styled details[open] > summary {
      border-bottom: 1px solid #fff;
    }

    mettle-accordion.styled summary {
      border: 0;
      border-radius: 5px;
      list-style-type: none;
      margin: 0.5rem 0;
      outline: none;
      padding: 0.5rem 0.5rem;
      user-select: none;
    }

    mettle-accordion.styled summary::marker {
      display: none;
    }

    mettle-accordion.styled summary::after {
      content: '\\2303';
      display: block;
      float: right;
      font-size: 1rem;
      font-weight: 900;
      margin-right: 1rem;
      transform: rotate(90deg);
      transition: 0.2s ease-in-out transform;
    }

    mettle-accordion.styled details[open] summary::after {
      transform: rotate(180deg);
    }

    mettle-accordion.styled p {
      padding: 0 0.5rem;
    }
  </style>
  `.trim()
}

export const Style = Template.bind({})
Style.args = {
  ...args,
  Class: 'styled'
}
Style.parameters = {
  docs: {
    description: {
      story: 'CSS Style used in the demo',
    },
    source: {
      code: TemplateStyle(Style.args)
    },
  },
}



const TemplateScript = (args) => {
  return `
  ${Template(args)}

  <button class="open">Open</button>
  <button class="close">Close</button>

  <script>
    const $component = globalThis.document.querySelector('mettle-accordion.${args.Class}')

    globalThis.document.querySelector('button.open').addEventListener('click', ()=> {
      $component.openAll()
    })

    globalThis.document.querySelector('button.close').addEventListener('click', ()=> {
      $component.collapseAll()
    })
  </script>
  `.trim()
}

export const Script = TemplateScript.bind({})
Script.args = {
  ...args,
  Class: 'styled'
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
