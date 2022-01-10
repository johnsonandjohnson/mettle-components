import Debounce from './debounce.js'

let _attrRoleKey = 'data-roles'
let _rights = null
let _defaultRights = null
let _userRoles = []
const _rightsConfig = new Map()

class Roles {

  constructor() {
  }

  get DefaultRights() {
    return _defaultRights
  }

  setDefaultRights(rights = Object.create(null)) {
    _defaultRights = Object.assign(Object.create(null), rights)
    return this
  }

  setRightsConfig(roleName, rights) {
    _rightsConfig.set(roleName, Object.assign(Object.create(null), rights))
    return this
  }

  get RightsConfig() {
    return _rightsConfig
  }

  set UserRoles(roles = []) {
    _userRoles = roles
    this.refreshRights()
    if (this.isObserverEnabled()) {
      this._checkElementRoles()
    }
  }

  get UserRoles() {
    return _userRoles
  }

  get AllRoles() {
    return [...this.RightsConfig.keys()]
  }

  get AccessRights() {
    if (null === _rights) {
      _rights = this._getRightsForRoles()
    }
    return _rights
  }

  refreshRights() {
    _rights = null
    return this.AccessRights
  }


  get AttrRoleKey() {
    return _attrRoleKey
  }

  set AttrRoleKey(roleKey) {
    if (roleKey.length) {
      _attrRoleKey = roleKey
      if (this.isObserverEnabled()) {
        this.disconnectObserver().enforceElementRoles()
      }
    }
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
        //TODO: Allow for deleting element from page
        element.toggleAttribute('hidden', toggleVal)
      }
    })

  }
}

export default new Roles()
