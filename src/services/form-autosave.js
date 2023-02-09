export default class FormAutoSave {
  SESSION_KEY = 'formAutoSave'
  constructor(form, sessionKey = '') {
    if(sessionKey && sessionKey.length) {
      this.SESSION_KEY = sessionKey
    }
    this.$form = form
    this.initialSessionValues = JSON.parse(globalThis.localStorage.getItem(this.SESSION_KEY) ?? null)
    this.setInitialSessionValues()
    this.$form.addEventListener('input', () => {
      globalThis.localStorage.setItem(this.SESSION_KEY, JSON.stringify(Object.fromEntries(new FormData(this.$form))))
    })
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

}
