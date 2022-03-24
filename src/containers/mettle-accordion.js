const TAG_NAME = 'mettle-accordion'
const SELECTOR = 'details'

if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends HTMLElement {

    constructor() {
      super('')
      this.attachShadow({ mode: 'open' })
        .appendChild(this._generateTemplate().content.cloneNode(true))
    }

    _generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = `
      <style>
      ::slotted(details) {
          cursor: pointer;
          height: var(--collapsed);
          overflow: hidden;
          transition: height 300ms;
        }
        ::slotted(details[open]) {
          height: var(--open);
        }
      </style>
      <slot></slot>`.trim()
      return template
    }

    connectedCallback() {

      this._MO = new MutationObserver(async entries => {
        const detailsSet = new Set()
        entries.forEach(entry => {
          const detail = entry.target.closest(SELECTOR)
          if(null !== detail) {
            detailsSet.add(detail)
          }
        })
        detailsSet.forEach(detail => {
          this._setHeight(detail)
        })
      })

      this._RO = new ResizeObserver(entries => {
        entries.forEach(entry => {
          const detail = entry.target
          const width = ~~detail.getAttribute('data-width')
          if (width !== entry.contentRect.width) {
            this._setHeight(detail)
          }
        })
      })

      this._adjustDetails()
      this.shadowRoot.querySelector('slot').addEventListener('slotchange', this._adjustDetails.bind(this))

    }

    _adjustDetails() {
      this.details = [...this.querySelectorAll(SELECTOR)]
      this.details.forEach(detail => {
        this._setHeight(detail)
        this._RO.observe(detail)
        this._MO.observe(detail, { attributes: false, childList: true, subtree: true })
      })
    }

    disconnectedCallback() {
      this._MO.disconnect()
      this._RO.disconnect()
    }

    _setHeight(detail) {
      requestAnimationFrame(() => {
        const setCSSVariables = () => {
          detail.open = !detail.open
          const rect = detail.getBoundingClientRect()
          detail.dataset.width = rect.width
          detail.style.setProperty(detail.open ? '--open' : '--collapsed',`${rect.height}px`)
        }
        detail.removeAttribute('style')
        Promise.resolve().then(setCSSVariables).then(setCSSVariables)
      })
    }

    openAll() {
      this.details.forEach(detail => {
        detail.open = true
      })
    }

    collapseAll() {
      this.details.forEach(detail => {
        detail.open = false
      })
    }

  })
}
