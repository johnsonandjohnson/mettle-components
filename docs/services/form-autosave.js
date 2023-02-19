import Debounce from './debounce.js'
export default class FormAutoSave {
  SESSION_KEY = 'formAutoSave'
  constructor(form, sessionKey = '') {
    if(sessionKey && sessionKey.length) {
      this.SESSION_KEY = sessionKey
    }
    this.$form = form
    this.initialSessionValues = JSON.parse(globalThis.localStorage.getItem(this.SESSION_KEY) ?? null)
    this.setInitialSessionValues()
    const saveDebounce = Debounce(this.save.bind(this))
    this.$form.addEventListener('input', saveDebounce.bind(this))
    this.$form.addEventListener('change', saveDebounce.bind(this))
    this.$form.addEventListener('blur', saveDebounce.bind(this))
  }

  setInitialSessionValues() {
    if(this.initialSessionValues) {
      const elements = this.$form.elements
      Object.entries(this.initialSessionValues).forEach(([key, value]) => {
        if(elements[key]) {
          elements[key].value = value
        }
      })
    }
  }

  clearStorage() {
    globalThis.localStorage.removeItem(this.SESSION_KEY)
  }

  save() {
    globalThis.localStorage.setItem(this.SESSION_KEY, JSON.stringify(Object.fromEntries(new FormData(this.$form))))
  }
}
