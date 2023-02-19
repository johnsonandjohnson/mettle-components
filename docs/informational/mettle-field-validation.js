const TAG_NAME = 'mettle-field-validation'
if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends window.HTMLElement {

    constructor() {
      super('')
      this.attachShadow({ mode: 'open' })
        .appendChild(this._generateTemplate().content.cloneNode(true))
      this.$targetInputs = []
      this.$div = this.shadowRoot.querySelector('div')
      this._handleInvalidFieldBind = this.handleInvalidField.bind(this)
    }

    _generateTemplate() {
      const template = document.createElement('template')

      template.innerHTML = `
        <div part="validation"></div>
      `.trim()
      return template
    }

    connectedCallback() {
      this.$targetInputs = [...document.querySelectorAll(`[name="${this.dataset.fieldName}"]`)]
      if (Array.isArray(this.$targetInputs)) {
        this.$targetInputs.forEach(input => {
          input.addEventListener('invalid', this._handleInvalidFieldBind)
          input.addEventListener('change', this._handleInvalidFieldBind)
          input.addEventListener('keyup', this._handleInvalidFieldBind)
          input.addEventListener('blur', this._handleInvalidFieldBind)
        })
      }
    }

    disconnectedCallback() {
      if (Array.isArray(this.$targetInputs)) {
        this.$targetInputs.forEach(input => {
          input.removeEventListener('invalid', this._handleInvalidFieldBind)
          input.removeEventListener('change', this._handleInvalidFieldBind)
          input.removeEventListener('keyup', this._handleInvalidFieldBind)
          input.removeEventListener('blur', this._handleInvalidFieldBind)
        })
      }
    }

    handleInvalidField() {
      const isValid = this.$targetInputs.every(input => input.validity.valid)
      if (!isValid) {
        this.$div.innerText = this.$targetInputs[0].validationMessage
      } else {
        this.$div.innerText = ''
      }
    }

    resetField() {
      this.$div.innerText = ''
    }

  })
}

