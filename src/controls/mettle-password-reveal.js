const TAG_NAME = 'mettle-password-reveal'

if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends HTMLElement {

    constructor() {
      super()
      this.attachShadow({mode: 'open'}).appendChild(this._generateTemplate().content.cloneNode(true))
    }

    _generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = `
      <div part="container">
        <input id="password-toggle" type="checkbox" part="checkbox" />
        <label for="password-toggle" part="label">
          <slot></slot>
        </label>
      </div>
    `
      return template
    }

    connectedCallback() {
      this.$checkbox = this.shadowRoot.querySelector('#password-toggle')
      this.$checkbox.addEventListener('change', this.handleCheckboxChange.bind(this))

      this.setupTargetField()
    }

    disconnectedCallback() {
      if (this.$targetField) {
        this.$targetField.setAttribute('type', 'password')
      }
    }

    static get observedAttributes() {
      return ['data-for']
    }

    attributeChangedCallback(attr, oldValue, newValue) {
      if (oldValue !== newValue && attr === 'data-for') {
        this.disconnectedCallback()
        this.setupTargetField()
      }
    }

    handleCheckboxChange() {
      if (this.$checkbox && this.$targetField) {
        this.$targetField.setAttribute('type', this.$checkbox.checked ? 'text' : 'password')
      }
    }

    setupTargetField() {
      const fieldSelector = this.getAttribute('data-for')
      if(fieldSelector) {
        this.$targetField = document.getElementById(fieldSelector)
      }

      this.handleCheckboxChange()
    }
  })
}
