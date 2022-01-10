import Debounce from './debounce.js'
import Util from './util.js'

const DEFAULT_LOCALE = window.navigator.language.split('-').shift()
const DEFAULT_DATE_TIME_OPTIONS = {
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  month: 'short',
  year: 'numeric'
}

const I18N_ATTR_DEFAULTS = {
  DATE: 'data-i18n-date',
  I18N: 'data-i18n',
  NUMBER : 'data-i18n-number',
  PLACEHOLDER: 'data-i18n-placeholder',
  SRC: 'data-i18n-src',
  UNSAFE: 'data-i18n-unsafe',
}

/* TODO: clean up variables */
class I18n {

  constructor() {
    this._attributeMap = [
      { attr: 'placeholder', selector: I18N_ATTR_DEFAULTS.PLACEHOLDER },
      { attr: 'src', selector: I18N_ATTR_DEFAULTS.SRC },
    ]
    this._attributeFilters = new Set(Object.values(I18N_ATTR_DEFAULTS))
    this._decorators = new Map()
    this._localeId = DEFAULT_LOCALE
    this._observer = null
    this._dictionary = new Map()
    this._loadBasePath = window.location.href
    this._loadPath = ''
    this._storageKey = 'i18nLocale'
    this._urlParamKey = 'locale'
    this._pending = null
  }

  config({attributeMap, decorators, loadBasePath, loadPath, storageKey, urlParam}) {
    this._loadBasePath = loadBasePath || window.location.href
    this._loadPath = loadPath || ''
    this._storageKey = storageKey || 'i18nLocale'
    this._urlParamKey = urlParam || 'locale'
    if(Array.isArray(attributeMap)) {
      attributeMap.filter(({selector}) => !this._attributeFilters.has(selector)).forEach(({attr, selector}) => {
        this._attributeMap.push({attr, selector})
        this._attributeFilters.add(selector)
      })
    }
    if(Array.isArray(decorators)) {
      decorators.forEach(({attr, config}) => {
        if(config.format && Util.isFunction(config.format)) {
          this._decorators.set(attr, config)
          this._attributeFilters.add(attr)
        }
      })
    }
  }

  get localeId() {
    return this._localeId
  }

  set localeId(id) {
    this._localeId = id
    window.sessionStorage.setItem(this.STORAGE_KEY, this.localeId)
    document.documentElement.setAttribute('lang', this.localeId)
  }

  get loadPath() {
    return window.decodeURIComponent(new URL(`${this._loadPath}/${this.localeId}.json`, this._loadBasePath))
  }

  get DEFAULT_LOCALE() {
    return DEFAULT_LOCALE
  }

  get DEFAULT_ATTRIBUTES() {
    return I18N_ATTR_DEFAULTS
  }

  get STORAGE_KEY() {
    return this._storageKey
  }

  get URL_PARAM_KEY() {
    return this._urlParamKey
  }

  formatDateTime(date, lng = this.localeId, options = Object.create(null)) {
    const DATE_TIME_OPTIONS = { ...DEFAULT_DATE_TIME_OPTIONS, ...options }
    let outputValue = ''
    if (/^[0-9]*$/.test(date)) {
      outputValue = Number(date)
    } else if (date && date.length && !window.isNaN(Date.parse(date))) {
      outputValue = date
    }
    if (outputValue.toString().length) {
      outputValue = new Date(outputValue).toLocaleDateString(lng, DATE_TIME_OPTIONS)
    }
    return outputValue
  }

  formatNumber(number, lng = this.localeId, options = Object.create(null)) {
    return new Intl.NumberFormat(lng, options).format(number)
  }

  initSessionLocale() {
    const searchParams = new URLSearchParams(window.location.search)
    const locale = searchParams.get(this.URL_PARAM_KEY) || window.sessionStorage.getItem(this.STORAGE_KEY)
    if (locale) {
      this.localeId = locale
    }
  }

  async init() {
    this.initSessionLocale()
    return this.setLocale(this.localeId)
  }

  /**
   * Sets the local based on a language key stored in session.
   */
  async setLocale(locale = null) {
    this.localeId = locale || DEFAULT_LOCALE

    this._pending = new Promise(resolve => {
      let translator = this._translator.bind(this)
      if (!this._dictionary.get(this.localeId)) {
        fetch(this.loadPath)
          .then(response => {
            if (response instanceof Response && response.ok) {
              return response
            } else {
              throw response
            }
          })
          .then(response => response.clone().json().catch(() => null))
          .then(responseJSON => {
            if (null !== responseJSON) {
              this._dictionary.set(this.localeId, responseJSON)
            } else {
              throw new Error()
            }
            return translator
          })
          .then(translator => {
            this.translatePage()
            resolve(translator)
          })
          .catch(() => {
            if (this.localeId !== DEFAULT_LOCALE) {
              translator = this.setLocale(DEFAULT_LOCALE).then(translator => translator)
            }
            this.translatePage()
            resolve(translator)
          })
      } else {
        this.translatePage()
        resolve(translator)
      }
    })

    return this._pending
  }

  _translator(i18nKey) {
    const dictionary = this._dictionary.get(this.localeId)
    // Replace with Object.hasOwn() when Safari has support
    return dictionary && Object.prototype.hasOwnProperty.call(dictionary, i18nKey) ? dictionary[i18nKey] : i18nKey
  }

  setPageTitle(i18lKey) {
    const titleTag = document.head.querySelector('title')
    if (titleTag && i18lKey) {
      titleTag.dataset.i18n = i18lKey
    }
  }

  translateAttribute({ attr, selector }) {
    const elements = Array.from(document.querySelectorAll(`[${selector}]`))
    elements.forEach(element => {
      const attribute = element.getAttribute(selector)
      element.setAttribute(attr, this._translator(attribute))
      this._ensureDirAttribute(element)
    })
  }

  /* One way to do 'static' HTML page translations is with client-side code that scans for a data attribute.
     This is an alternative to performing the translations on the back end.
  */
  translatePage() {
    const elements = Array.from(document.querySelectorAll(`[${I18N_ATTR_DEFAULTS.I18N}]`))
    elements.forEach(element => {
      const i18nKey = element.dataset.i18n
      element.textContent = this._translator(i18nKey)
      this._ensureDirAttribute(element)
    })
    const elementsUnsafe = Array.from(document.querySelectorAll(`[${I18N_ATTR_DEFAULTS.UNSAFE}]`))
    elementsUnsafe.forEach(element => {
      const i18nKey = element.dataset.i18nUnsafe
      element.innerHTML = this._translator(i18nKey)
      this._ensureDirAttribute(element)
    })
    this._attributeMap.forEach(def => this.translateAttribute(def))
    this.translateDates().translateNumbers().translateDecorators()
  }

  translateDates() {
    const elements = Array.from(document.querySelectorAll(`[${I18N_ATTR_DEFAULTS.DATE}]`))
    elements.forEach(element => {
      const i18nKeyValue = element.dataset.i18nDate
      element.textContent = this.formatDateTime(this._translator(i18nKeyValue))
      this._ensureDirAttribute(element)
    })
    return this
  }

  translateNumbers() {
    const elements = Array.from(document.querySelectorAll(`[${I18N_ATTR_DEFAULTS.NUMBER}]`))
    elements.forEach(element => {
      const i18nKeyValue = element.dataset.i18nNumber
      element.textContent = this.formatNumber(this._translator(i18nKeyValue))
      this._ensureDirAttribute(element)
    })
    return this
  }

  translateDecorators() {
    this._decorators.forEach((config, attr) => {
      const {format, unsafe = false} = config
      const elements = Array.from(document.querySelectorAll(`[${attr}]`))
      elements.forEach(element => {
        const i18nKey = element.getAttribute(attr)
        element[unsafe ? 'innerHTML' : 'textContent'] = format(this._translator(i18nKey))
        this._ensureDirAttribute(element)
      })
    })
    return this
  }

  /* Ensure the text displayed is shown in the correct direction */
  _ensureDirAttribute(element) {
    if (!element.getAttribute('dir')) {
      element.setAttribute('dir', 'auto')
    }
  }

  async enableDocumentObserver() {
    if (!this.isObserverEnabled()) {
      await this.init()
      const observerConfig = { attributeFilter: [...this._attributeFilters], attributes: true, characterData: false, characterDataOldValue: false, childList: true, subtree: true }
      const translateDebounce = Debounce(() => {
        this._observer.disconnect()
        this.translatePage()
        this._observer.observe(document, observerConfig)
      })
      this._observer = new MutationObserver(translateDebounce.bind(this))
      this._observer.observe(document, observerConfig)
      this.translatePage()
    }
  }

  disconnectObserver() {
    if (this.isObserverEnabled()) {
      this._observer.disconnect()
    }
    this._observer = null
    return this
  }

  isObserverEnabled() {
    return this._observer instanceof MutationObserver
  }

}

export default new I18n()
