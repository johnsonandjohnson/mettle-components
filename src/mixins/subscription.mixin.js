
import { MixinDefs } from './mixin.def.js'

export default Base => class extends Base {

  constructor() {
    super()
    this[MixinDefs.Subscription] = null
  }

  static get MixinDefs() {
    return MixinDefs
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback()
    }
    if (this[MixinDefs.Subscription]) {
      if (Array.isArray(this[MixinDefs.Subscription])) {
        this[MixinDefs.Subscription].forEach(subscription => subscription.unsubscribe())
      } else {
        this[MixinDefs.Subscription].unsubscribe()
      }
    }
    this[MixinDefs.Subscription] = null
  }

}
