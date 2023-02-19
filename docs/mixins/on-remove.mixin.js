import { MixinNS } from './mixin.namespace.js'

export default Base => class extends Base {

  constructor() {
    super()
  }

  static get MixinNS() {
    return MixinNS
  }

  get MixinNS() {
    return MixinNS
  }

  [MixinNS.onRemove](element, onDetachCallback) {
    const isDetached = el => {
      if (document === el.parentNode) {
        return false
      } else if (null === el.parentNode) {
        return true
      } else {
        return isDetached(el.parentNode)
      }
    }
    this[MixinNS.onRemoveObserver] = new MutationObserver(() => {
      if (isDetached(element)) {
        this[MixinNS.onRemoveObserver].disconnect()
        onDetachCallback()
      }
    })
    this[MixinNS.onRemoveObserver].observe(document, {
      childList: true,
      subtree: true
    })
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback()
    }
    if (this[MixinNS.onRemoveObserver] instanceof MutationObserver) {
      this[MixinNS.onRemoveObserver].disconnect()
    }
  }
}
