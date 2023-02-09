import { MixinDefs } from './mixin.def.js'

export default Base => class extends Base {

  constructor() {
    super()
  }

  get MixinDefs() {
    return MixinDefs
  }

  [MixinDefs.onRemove](element, onDetachCallback) {
    const isDetached = el => {
      if (document === el.parentNode) {
        return false
      } else if (null === el.parentNode) {
        return true
      } else {
        return isDetached(el.parentNode)
      }
    }
    this[MixinDefs.onRemoveObserver] = new MutationObserver(() => {
      if (isDetached(element)) {
        this[MixinDefs.onRemoveObserver].disconnect()
        onDetachCallback()
      }
    })
    this[MixinDefs.onRemoveObserver].observe(document, {
      childList: true,
      subtree: true
    })
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback()
    }
    if (this[MixinDefs.onRemoveObserver] instanceof MutationObserver) {
      this[MixinDefs.onRemoveObserver].disconnect()
    }
  }
}
