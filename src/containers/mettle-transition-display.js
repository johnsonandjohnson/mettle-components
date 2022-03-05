const TAG_NAME = 'mettle-transition-display'
if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends window.HTMLElement {

    constructor() {
      super()
    }

    connectedCallback() {
      this.innerHTML = '<div class="transition-display-content"></div>'
      this.$content = this.querySelector('.transition-display-content')
      this.$content.style.transition = 'all 0.2s'
      this.$content.style.transformStyle = 'preserve-3d'
    }

    async insertContent(content) {
      if (!this.$content) {
        return Promise.reject()
      }

      const transitionType = this.getAttribute('data-type') || 'opacity'
      const transitionStart = this.getAttribute('data-start') || '0'
      const transitionEnd = this.getAttribute('data-end') || '1'
      let transitionDisable = this.getAttribute('data-enable')
      transitionDisable = (transitionDisable && transitionDisable.toLowerCase() === 'false')
      if (!transitionDisable) {
        await this._transitionToPromise(this.$content, transitionType, transitionStart)
      }
      const doc = new DOMParser().parseFromString(content, 'text/html')
      const template = doc.querySelector('template')
      const style = doc.querySelector('style')
      console.log(template)
      if(template) {
        this.$content.innerHTML = template.innerHTML.toString()
      }
      if (style) {
        this.$content.insertAdjacentHTML('afterbegin', style.outerHTML)
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
          el.removeEventListener('transitionend', transitionEnded)
          resolve()
        }
        el.addEventListener('transitionend', transitionEnded)
        el.style[property] = value
      })
    }

  })
}
