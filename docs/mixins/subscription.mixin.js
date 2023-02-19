
import { MixinNS } from './mixin.namespace.js'

export default Base => class extends Base {

  constructor() {
    super()
    this[MixinNS.Subscription] = []
  }

  static get MixinNS() {
    return MixinNS
  }

  get MixinNS() {
    return MixinNS
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback()
    }
    if (Array.isArray(this[MixinNS.Subscription])) {
      this[MixinNS.Subscription].forEach(subscription => subscription?.unsubscribe())
    }
    this[MixinNS.Subscription] = null
  }

}
