const TAG_NAME = 'mettle-transition-display'
if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends window.HTMLElement {

    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(this.generateTemplate().content.cloneNode(true))
    }

    generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = `
        <style>
          .transition-display-content {
            transform-style: preserve-3d;
            transition: all 0.2s;
          }
        </style>
        <style title="slotted"></style>
        <div class="transition-display-content" part="container"><slot></slot></div>
      `.trim()
      return template
    }

    connectedCallback() {
      this.$content = this.shadowRoot.querySelector('.transition-display-content')
      this.$style = this.shadowRoot.querySelector('style[title="slotted"]')
      this.ignoreSelectors = ['.transition-display-content']
    }

    updateCSSSelectors() {
      const newCSSRules = []
      const sheets = [...this.shadowRoot.styleSheets]
      sheets.forEach(sheet => {
        Array.from(sheet.cssRules)
          .filter(rule => !this.ignoreSelectors.includes(rule.selectorText))
          .forEach(rule => {
            const selectorString = rule.selectorText.toString().toLowerCase()
            const cssString = rule.cssText.toString().toLowerCase()
            if(!selectorString.includes('::slotted')) {
              const newSelector = `::slotted(${selectorString})`
              newCSSRules.push(cssString.replace(selectorString, newSelector))
            } else {
              newCSSRules.push(cssString)
            }
          })
      })
      this.$style.innerHTML = newCSSRules.join(' ')
    }

    async insertContent(content) {
      if (!this.$content) {
        return Promise.reject()
      }

      const transitionType = this.getAttribute('data-type') || 'opacity'
      const transitionStart = this.getAttribute('data-start') || '0'
      const transitionEnd = this.getAttribute('data-end') || '1'
      let transitionDisable = this.getAttribute('data-enable')
      transitionDisable = (transitionDisable && transitionDisable.toLowerCase() === 'false') || document.readyState !== 'complete'
      if (!transitionDisable) {
        await this._transitionToPromise(this.$content, transitionType, transitionStart)
      }
      const doc = new DOMParser().parseFromString(content, 'text/html')
      const template = doc.querySelector('template')
      const style = doc.querySelector('style')

      if(template) {
        this.innerHTML = template.innerHTML.toString()
      }
      if (style) {
        this.$style.innerHTML = style.innerHTML
        this.updateCSSSelectors()
      }
      return transitionDisable ?
        Promise.resolve() :
        this._transitionToPromise(this.$content, transitionType, transitionEnd)
    }

    addElementToContent(element, position = 'beforeend') {
      this.$content.insertAdjacentElement(position, element)
    }

    _transitionToPromise(el, property, value) {
      return new Promise(resolve => {
        const pascalCaseProperty = property.split(/(?=[A-Z])/g).map(prop => prop.charAt(0).toLowerCase() + prop.substring(1)).join('-')
        const transitionEnded = evt => {
          if (evt.propertyName !== pascalCaseProperty) {
            return
          }
          resolve()
        }
        el.addEventListener('transitionend', transitionEnded, { once : true })
        el.style[property] = value
      })
    }

  })
}
