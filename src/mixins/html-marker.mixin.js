import HtmlMarker from '../services/html-marker.js'
import { MixinNS } from './mixin.namespace.js'

export default Base => class extends Base {

  constructor() {
    super()
    this[MixinNS.DataModel] = this[MixinNS.DefaultDataModel]
    this[MixinNS.HTMLMarker] = new HtmlMarker()
  }

  static get MixinNS() {
    return MixinNS
  }

  get MixinNS() {
    return MixinNS
  }

  get [MixinNS.DefaultDataModel]() {
    return Object.create(null)
  }

  [MixinNS.updateDataModel](obj = Object.create(null)) {
    const lastModelUpdates = Object.create(null)
    Object.entries(obj).forEach(([prop, newValue]) => {
      if (this[MixinNS.DataModel][prop] !== newValue) {
        lastModelUpdates[prop] = newValue
      }
    })
    Object.assign(this[MixinNS.DataModel], obj)
    this[MixinNS.onModelUpdate](lastModelUpdates)
  }

  [MixinNS.onModelUpdate]() {
    this[MixinNS.HTMLMarker].updateModel(this[MixinNS.DataModel])
  }

  [MixinNS.resetDataModel]() {
    this[MixinNS.updateDataModel](this[MixinNS.DefaultDataModel])
  }

}
