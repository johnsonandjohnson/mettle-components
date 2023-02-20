import Debounce from './debounce.js'

class Roles {

  #attrRoleKey = 'data-roles'
  #rights = null
  #defaultRights = null
  #userRoles = []
  #rightsConfig = new Map()
  #shouldDeleteElement = false

  constructor() {
  }

  get DefaultRights() {
    return this.#defaultRights
  }

  setDefaultRights(rights = Object.create(null)) {
    this.#defaultRights = Object.assign(Object.create(null), rights)
    return this
  }

  setRightsConfig(roleName, rights) {
    this.#rightsConfig.set(roleName, Object.assign(Object.create(null), rights))
    return this
  }

  get RightsConfig() {
    return this.#rightsConfig
  }

  set UserRoles(roles = []) {
    this.#userRoles = roles
    this.refreshRights()
    if (this.isObserverEnabled()) {
      this._checkElementRoles()
    }
  }

  get UserRoles() {
    return this.#userRoles
  }

  get AllRoles() {
    return [...this.RightsConfig.keys()]
  }

  get AccessRights() {
    if (null === this.#rights) {
      this.#rights = this._getRightsForRoles()
    }
    return this.#rights
  }

  refreshRights() {
    this.#rights = null
    return this.AccessRights
  }


  get AttrRoleKey() {
    return this.#attrRoleKey
  }

  set AttrRoleKey(roleKey) {
    if (roleKey.length) {
      this.#attrRoleKey = roleKey
      if (this.isObserverEnabled()) {
        this.disconnectObserver().enforceElementRoles()
      }
    }
  }

  get shouldDeleteElement() {
    return this.#shouldDeleteElement
  }

  set shouldDeleteElement(bool) {
    this.#shouldDeleteElement = !!bool
  }

  isValidRole(roleName) {
    return this.AllRoles.includes(roleName)
  }

  _getRightsForRoles() {
    let userRights = Object.create(null)
    if (null !== this.DefaultRights) {
      userRights = Object.assign(Object.create(null), this.DefaultRights)
      this.UserRoles.forEach(role => {
        if (this.isValidRole(role)) {
          userRights = this._mergeRights(userRights, this.RightsConfig.get(role))
        }
      })
    }
    return userRights
  }

  _mergeRights(currentRights, newRights) {
    /* New rights should be specified as a 'white list', remove any that are false before merging.*/
    for (const [key, value] of Object.entries(newRights)) {
      if (value === false) {
        delete newRights[key]
      }
    }

    /* The remaining white list will overwrite any default rights. */
    return Object.assign(Object.create(null), currentRights, newRights)
  }

  enforceElementRoles() {
    if (!this.isObserverEnabled()) {
      const observerConfig = { attributeFilter: [this.AttrRoleKey], attributes: true, characterData: false, characterDataOldValue: false, childList: true, subtree: true }
      const funcDebounce = Debounce(() => {
        this._observer.disconnect()
        this._checkElementRoles()
        this._observer.observe(document, observerConfig)
      })
      this._observer = new MutationObserver(funcDebounce.bind(this))
      this._observer.observe(document, observerConfig)
      this._checkElementRoles()
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

  _checkElementRoles() {
    const elementRoles = this.AccessRights
    const elements = document.querySelector(`[${this.AttrRoleKey}]`) ?
      Array.from(document.querySelectorAll(`[${this.AttrRoleKey}]`)) :
      []
    elements.forEach(element => {
      let configKey = element.getAttribute(this.AttrRoleKey)
      const isInverted = configKey.startsWith('!')
      configKey = isInverted ? configKey.slice(1) : configKey
      if (configKey in elementRoles) {
        const toggleVal = isInverted ? !!elementRoles[configKey] : !elementRoles[configKey]
        if(this.shouldDeleteElement && toggleVal) {
          element.remove()
        } else if(!this.shouldDeleteElement) {
          element.toggleAttribute('hidden', toggleVal)
        }
      }
    })

  }
}

export default new Roles()
