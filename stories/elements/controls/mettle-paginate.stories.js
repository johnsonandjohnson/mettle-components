import '../../../src/controls/mettle-paginate.js'
import './paginate.css'

import { Constants } from '../../helper/index.js'

export default {
  title: 'Custom Elements/Controls/Mettle-Paginate',
  argTypes: {
    pageSizes: {
      control: { type: 'text' },
      description: 'A comma delimited list of numbers to display.',
      name: 'data-page-sizes',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          detail: 'This is a comma delimited list, you must supply the list.',
          summary: 10,
        }
      },
    },
    totalItems: {
      control: { min: 1, type: 'number' },
      description: 'The total numbers of items in the list.',
      name: 'data-total-items',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
      },
    },
    slotPageSize: {
      control: { type: 'text' },
      description: 'Page of text',
      name: 'slot="pageSize"',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },
    slotOf: {
      control: { type: 'text' },
      description: 'of text',
      name: 'slot="of"',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },
    slotPageJump: {
      control: { type: 'text' },
      description: 'page jump text',
      name: 'slot="pageJump"',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },
    slotPrevious: {
      control: { type: 'text' },
      description: 'previous text',
      name: 'slot="previous"',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },
    slotNext: {
      control: { type: 'text' },
      description: 'next text',
      name: 'slot="next"',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },
    controller: {
      description: 'The general wrapper',
      name: '::part(controller)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    pageSize: {
      description: 'The page size wrapper',
      name: '::part(pageSize)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    pageSizeSelect: {
      description: 'The select dropdown',
      name: '::part(pageSizeSelect)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    pageNav: {
      description: 'The page navigation wrapper',
      name: '::part(pageNav)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    pageNav: {
      description: 'The previous navigation wrapper',
      name: '::part(previous)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    pageNavMid: {
      description: 'The mid section navigation wrapper',
      name: '::part(pageNavMid)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    partOf: {
      description: 'The of section navigation wrapper',
      name: '::part(of)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    partNext: {
      description: 'The next section navigation wrapper',
      name: '::part(next)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    pageJump: {
      description: 'The page jump section wrapper',
      name: '::part(pageJump)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    pageJumpInput: {
      description: 'The page jump input controller',
      name: '::part(pageJumpInput)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    pageJumpList: {
      description: 'The page jump input datalist',
      name: '::part(pageJumpList)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    PAGINATION: {
      description: 'The main event when the controller value changes',
      name: 'PAGINATION',
      table: {
        category: Constants.CATEGORIES.EVENTS,
        defaultValue: {
          detail: 'Constants with all Event types.',
          summary: '$selector.EVENT_TYPES.PAGINATION',
        }

      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Used as a pagination controller where the controls emit event listeners.',
      },
    },
  },
}

const Template = ({className = '', pageSizes = '10,50,100,500,1000', totalItems = '9803', slotPageSize = '', slotOf = '', slotPageJump = '', slotPrevious = '', slotNext = ''}) => {
  return `
  <mettle-paginate class="${className}" data-page-sizes="${pageSizes}" data-total-items="${totalItems}">
  ${slotPageSize ? `<span slot="pageSize">${slotPageSize}</span>` : ''}
  ${slotOf ? `<span slot="of">${slotOf}</span>` : ''}
  ${slotPageJump ? `<span slot="pageJump">${slotPageJump}</span>` : ''}
  ${slotPrevious ? `<span slot="previous" class="pagination-prev">${slotPrevious}</span>` : ''}
  ${slotNext ? `<span slot="next" class="pagination-next">${slotNext}</span>` : ''}
  </mettle-paginate>
`.trim()
}

const args = {}

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



const TemplateStyle = (args) => {
  return `
  ${Template(args)}

  <style>
    mettle-paginate.sample::part(controller) {
      align-items: center;
      background-color: var(--surface);
      color: var(--on-surface);
      display: flex;
      font-size: 1.1rem;
      justify-content: left;
      padding: 1rem;
      padding-left: 3rem;
    }

    mettle-paginate.sample::part(pageSizeSelect) {
      border: 1px solid var(--border-color);
      font-size: 1.1rem;
      padding: 0.2rem;
    }

    mettle-paginate.sample::part(pageJumpInput) {
      border: 1px solid var(--border-color);
      width: 80px;
      font-size: 1.1rem;
      padding: 0.2rem;
    }

    mettle-paginate.sample::part(pageNavMid) {
      grid-area: paginateCount;
    }

    mettle-paginate.sample::part(pageNav) {
      align-items: center;
      border: 0 solid transparent;
      border-radius: 4px;
      display: grid;
      grid-template-areas: 'paginateCount . .';
      grid-template-columns: auto auto auto;
      margin-left: 1rem;
      margin-right: 2rem;
      padding: 0;
    }

    mettle-paginate.sample::part(previous),
    mettle-paginate.sample::part(next) {
      background-color: var(--on-primary);
      border: 1px solid var(--border-color);
      box-sizing: content-box;
      cursor: pointer;
      font-size: 1.2rem;
      height: 28px;
      outline: none;
      margin: 0;
    }

    mettle-paginate.sample::part(previous) {
      border-radius: 2px 0 0 2px;
      border-right: 1px solid var(--border-color);
      margin-left: 1rem;
    }

    mettle-paginate.sample::part(next) {
      border-left: 0 solid transparent;
      border-radius: 0 2px 2px 0;
      margin-right: 0;
    }

    mettle-paginate.sample .pagination-prev svg-icon svg {
      transform: translateX(0%) translateY(2px)  rotate(90deg);
    }

    mettle-paginate.sample .pagination-next svg-icon svg {
      transform: translateX(0%) translateY(-2px)  rotate(270deg);
    }

    mettle-paginate.sample[data-previous-disabled] .pagination-prev svg-icon svg,
    mettle-paginate.sample[data-next-disabled] .pagination-next svg-icon svg {
      fill: var(--button-disabled);
    }

    mettle-paginate.sample::part(previous):hover,
    mettle-paginate.sample::part(next):hover {
      background-color: var(--row-selected);
    }

    mettle-paginate.sample::part(disabled),
    mettle-paginate.sample::part(disabled):hover {
      background-color: var(--on-secondary);
      cursor: not-allowed;
    }
  </style>
  `.trim()
}

export const Style = Template.bind({})
Style.args = {
  className: 'sample',
  ...args
}
Style.parameters = {
  docs: {
    description: {
      story: 'Alternative CSS Style',
    },
    source: {
      code: TemplateStyle(Style.args)
    },
  },
}



const TemplateScript = (args) => {
  return `
  <p><strong>Interact with the component to see the results of the event listener</strong></p>

  ${Template(args)}

  <textarea></textarea>

  <script>
    const $component = globalThis.document.querySelector('mettle-paginate.${args.className}')
    const $textarea = globalThis.document.querySelector('textarea')

    $component.addEventListener($component.EVENT_TYPES.PAGINATION, evt => {
      const details = evt.detail
      $textarea.value = JSON.stringify(details)
    })

  </script>
  `.trim()
}

export const Script = TemplateScript.bind({})
Script.args = {
  ...args,
  className: 'js'
}
Script.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'JavaScript sample on how to handle the event listener',
    },
    source: {
      code: TemplateScript(Script.args)
    },
  },
}
