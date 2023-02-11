
import { MixinDefs } from './mixin.def.js'

export default Base => class extends Base {

  constructor() {
    super()
    this[MixinDefs.Subscription] = []
  }

  static get MixinDefs() {
    return MixinDefs
  }

  get MixinDefs() {
    return MixinDefs
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback()
    }
    if (Array.isArray(this[MixinDefs.Subscription])) {
      this[MixinDefs.Subscription].forEach(subscription => subscription?.unsubscribe())
    }
    this[MixinDefs.Subscription] = null
  }

}
