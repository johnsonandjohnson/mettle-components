/**
 * To hide a section, just use css parts with display:none
 */
const CONTROLLERS = {
  NEXT: 'next',
  PAGEJUMP: 'pagejump',
  PAGESIZE: 'pagesize',
  PREVIOUS: 'previous',
}

const EVENT_TYPES = {
  PAGINATION: 'pagination'
}

const DEFAULT_PAGE_SIZES = 10

const TAG_NAME = 'mettle-paginate'
if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends HTMLElement {

    constructor() {
      super()
      const shadowRoot = this.attachShadow({ mode: 'open' })
      shadowRoot.appendChild(this.generateTemplate().content.cloneNode(true))
      this.currentPage = 1
      this.maxPages = 10
      this.pages = [1]
      this.currentPageSize = null
      this.pageSizes = [DEFAULT_PAGE_SIZES]
      this.totalItems = 0
      this.totalPages = 0

      this.$pageSizeSelect = this.shadowRoot.querySelector('#pageSize')
      this.$pageJump = this.shadowRoot.querySelector('#pageJump')
      this.$pageJumpList = this.shadowRoot.querySelector('#pageJumpList')
      this.$previous = this.shadowRoot.querySelector('[part="previous"]')
      this.$next = this.shadowRoot.querySelector('[part="next"]')
      this.$pageOn = this.shadowRoot.querySelector('[name="pageOn"]')
      this.$pageTotal = this.shadowRoot.querySelector('[name="pageTotal"]')

      this.$previous.addEventListener('click', this._dispatchDetails.bind(this, CONTROLLERS.PREVIOUS))
      this.$next.addEventListener('click', this._dispatchDetails.bind(this, CONTROLLERS.NEXT))
      this.$pageSizeSelect.addEventListener('change', this._dispatchDetails.bind(this, CONTROLLERS.PAGESIZE))
      this.$pageJump.addEventListener('change', this._dispatchDetails.bind(this, CONTROLLERS.PAGEJUMP))

      this.$pageJump.setAttribute('min', 1)
    }

    get CONTROLLERS() {
      return CONTROLLERS
    }

    get EVENT_TYPES() {
      return EVENT_TYPES
    }

    setCurrentPage(page) {
      this.currentPage = ~~page
      this._update()
    }

    setCurrentPageSize(size) {
      if (this.isValidPageSize(size)) {
        this.$pageSizeSelect.value = size
      }
      this._update()
    }

    isValidPageSize(size) {
      size = ~~size
      const options = this.$pageSizeSelect.options
      const pageSizes = Array.from(options).filter(o => undefined != o).map(o => ~~o.value)
      return pageSizes.includes(size)
    }

    _dispatchDetails(controller) {
      const linkClicked = new CustomEvent(EVENT_TYPES.PAGINATION, {
        bubbles: false,
        detail: this.paginationDetails(controller),
      })
      this.dispatchEvent(linkClicked)
    }

    paginationDetails(controller) {
      if (controller === CONTROLLERS.NEXT) {
        this.currentPage++
      } else if (controller === CONTROLLERS.PREVIOUS) {
        this.currentPage--
      } else if (controller === CONTROLLERS.PAGEJUMP) {
        this.currentPage = ~~this.$pageJump.value
      }
      if (controller === CONTROLLERS.PAGESIZE) {
        this._updatePageSelection()
      } else {
        this._update()
      }
      return {
        CONTROLLERS,
        controller,
        currentPage: this.currentPage,
        currentPageSize: this.currentPageSize,
        pages: this.pages,
        totalItems: this.totalItems,
        totalPages: this.totalPages,
      }
    }

    generateTemplate() {

      const template = document.createElement('template')

      template.innerHTML = `
        <style>
          .controller {
            align-items: center;
            display: flex;
          }
          .left, .right {
            font-weight: bold;
          }
          .left {
            transform: rotate(270deg);
            padding: 0.1rem 0.1rem 0.1rem 0.2rem;
          }
          .right {
            transform: rotate(90deg);
            padding: 0.2rem 0.1rem 0.1rem 0.1rem;
          }
          .spacer {
            margin-right: 1rem;
          }
        </style>
        <nav class="controller" part="controller">
          <div class="spacer" part="pageSize">
            <label for="pageSize">
              <slot name="pageSize">Rows per page:</slot>
            </label>
            <select id="pageSize" part="pageSizeSelect"></select>
          </div>

          <div class="spacer" part="pageNav">
            <button part="previous">
              <slot name="previous"><div class="left">&#8963</div></slot>
            </button>
            <span part="pageNavMid">
              <output name="pageOn"></output>
              <span part="of">
                <slot name="of">of</slot>
              </span>
              <output name="pageTotal"></output>
            </span>
            <button part="next">
              <slot name="next"><div class="right">&#8963;</div></slot>
            </button>
          </div>

          <div part="pageJump">
            <label for="pageJump">
              <slot name="pageJump">Go to page:</slot>
            </label>
            <input type="number" list="pageJumpList" id="pageJump" part="pageJumpInput">
            <datalist id="pageJumpList" part="pageJumpList"></datalist>
          </div>
        </nav>
      `
      return template
    }

    _populateDatalist($list, values, reset = true) {
      if (reset) {
        $list.innerHTML = ''
      }
      const fragment = document.createDocumentFragment()
      values.forEach(value => {
        const option = document.createElement('option')
        option.value = value
        fragment.appendChild(option)
      })
      $list.appendChild(fragment)
    }

    _populateSelectInput($select, values, selectedValue) {
      this._resetSelectInput($select)
      const totalValues = values.length
      for (let i = 0; i < totalValues; i++) {
        let value = values[i]
        /* Do not allow for numbers beyond the total */
        if (value >= this.totalItems) {
          break
        }
        $select.options[$select.options.length] = new Option(value, value, false, value == selectedValue)
      }
      /* Always have an option for the total list */
      $select.options[$select.options.length] = new Option(this.totalItems, this.totalItems, false, this.totalItems == selectedValue)
    }

    _resetSelectInput($select) {
      let totalOptions = $select.options.length
      while (totalOptions) {
        $select.remove(--totalOptions)
      }
    }

    connectedCallback() {
      this._render()
    }

    static get observedAttributes() {
      return ['data-page-sizes', 'data-total-items']
    }

    attributeChangedCallback(attr, oldValue, newValue) {
      if (oldValue !== newValue) {
        this._render()
      }
    }

    _render() {
      const pageSizes = this.getAttribute('data-page-sizes')
      this.totalItems = ~~this.getAttribute('data-total-items')
      if (pageSizes) {
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
        this.pageSizes = pageSizes.split(',').map(val => ~~val).filter(val => val > 0).sort(collator.compare)
      }
      if (!pageSizes || !this.pageSizes.length) {
        this.pageSizes = [DEFAULT_PAGE_SIZES]
      }

      this._populateSelectInput(this.$pageSizeSelect, this.pageSizes, this.currentPageSize)


      this._update()
      this._updatePageSelection()
    }

    _updatePageSelection() {
      this._update()
      this._populateDatalist(this.$pageJumpList, this.pages)
    }

    _update() {
      this.currentPageSize = ~~this.$pageSizeSelect.value

      this.totalPages = Math.ceil(this.totalItems / this.currentPageSize)
      this.pages = [...Array(this.totalPages).keys()].map(i => i + 1)

      if (this.currentPage < 1) {
        this.currentPage = 1
      } else if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages
      }
      const displayCount = this.getAttribute('data-display-page') !== 'true'
      const startCount = ((this.currentPage-1)*this.currentPageSize)+1
      const maxCount = Math.min(this.totalItems, startCount+this.currentPageSize-1)
      const currentCount =  `${startCount} - ${maxCount}`

      this.$pageOn.value = displayCount ? currentCount : this.currentPage
      this.$pageTotal.value = displayCount ? this.totalItems : this.totalPages
      this.$pageJump.value = this.currentPage
      this.$pageJump.setAttribute('max', this.totalPages)

      this.$previous.toggleAttribute('disabled', this.currentPage === 1)
      this.$next.toggleAttribute('disabled', this.currentPage >= this.totalPages)
      /* The :disabled css property is not supported with CSS parts */
      this.$previous.part.toggle('disabled', this.$previous.disabled)
      this.$next.part.toggle('disabled', this.$next.disabled)
      this.toggleAttribute('data-previous-disabled', this.$previous.disabled)
      this.toggleAttribute('data-next-disabled', this.$next.disabled)
    }

  })
}
