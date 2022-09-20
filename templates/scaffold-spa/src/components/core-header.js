import CORE_HEADER_HTML from './core-header.html'

const TAG_NAME = 'core-header'
const BASE = window.HTMLElement

if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends BASE {
    constructor() {
      super('')
      this.attachShadow({ mode: 'open' })
        .appendChild(this._generateTemplate().content.cloneNode(true))
    }

    _generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = CORE_HEADER_HTML
      return template
    }

  })
}
