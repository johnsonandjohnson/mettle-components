const EVENT_TYPES = {
  SORT: 'sort'
}

const ELEM_TAG_NAME = 'mettle-sort-header'

let SORT_DIRECTION_NAME = 'data-sort'
let SORT_KEY_NAME = 'data-key'
let SORT_SELECTED_CLASS = 'active'

const SORT_ORDER = {
  ASCENDING : 'asc',
  DESCENDING: 'desc'
}

if (!window.customElements.get(ELEM_TAG_NAME)) {
  window.customElements.define(ELEM_TAG_NAME, class extends HTMLElement {

    constructor() {
      super('')
      this.attachShadow({ mode: 'open' })
        .appendChild(this._generateTemplate().content.cloneNode(true))
    }

    _generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = '<slot></slot>'
      return template
    }

    get EVENT_TYPES() {
      return EVENT_TYPES
    }

    get SORT_ORDER() {
      return SORT_ORDER
    }

    get KEY_NAMES() {
      return {
        SORT_DIRECTION_NAME,
        SORT_KEY_NAME,
        SORT_SELECTED_CLASS,
      }
    }

    connectedCallback() {
      const $slot = this.shadowRoot.querySelector('slot')
      const $elements = $slot.assignedElements({ flatten: true })
      this.$headers = []

      $elements.forEach($element => {
        this.$headers = [...$element.querySelectorAll(`[${SORT_KEY_NAME}]`)].concat(this.$headers)
        if($element.hasAttribute(SORT_KEY_NAME)) {
          this.$headers.push($element)
        }
      })

      this.$headers.forEach($header => {
        $header.addEventListener('click', this.updateSortHeader.bind(this, $header))
      })

    }

    updateSortHeader($header) {
      if ($header.asc === undefined) {
        $header.asc = false
      }
      $header.asc = !$header.asc
      $header.setAttribute(SORT_DIRECTION_NAME, $header.asc ? SORT_ORDER.ASCENDING : SORT_ORDER.DESCENDING)

      this.$headers.forEach($header => {
        $header.classList.remove(SORT_SELECTED_CLASS)
      })
      $header.classList.add(SORT_SELECTED_CLASS)
      const detail = { asc: $header.asc, key: $header.getAttribute(SORT_KEY_NAME) }
      this.dispatchEvent(new CustomEvent(EVENT_TYPES.SORT, { bubbles: true, detail }))
    }

    resetAllSorting() {
      this.$headers.forEach($header => {
        $header.classList.remove(SORT_SELECTED_CLASS)
        $header.asc = undefined
        $header.removeAttribute(SORT_DIRECTION_NAME)
      })
    }

    /* In a future update we can change the keys
    static get observedAttributes() {
      return ['data-set-key', 'data-set-direction', 'data-set-selected']
    }

    attributeChangedCallback(attr, oldValue, newValue) {
      if (oldValue !== newValue) {
        if (['data-set-key'].includes(attr)) {
        }
        if (['data-set-direction'].includes(attr)) {
        }
        if (['data-set-selected'].includes(attr)) {
        }
      }
    } */

  })
}
