import HtmlMarker from '../services/html-marker.js'
import { MixinDefs } from './mixin.def.js'

export default Base => class extends Base {

  constructor() {
    super()
    this[MixinDefs.DataModel] = this[MixinDefs.DefaultDataModel]
    this[MixinDefs.HTMLMarker] = new HtmlMarker()
  }

  static get MixinDefs() {
    return MixinDefs
  }

  get MixinDefs() {
    return MixinDefs
  }

  get [MixinDefs.DefaultDataModel]() {
    return Object.create(null)
  }

  [MixinDefs.updateDataModel](obj = Object.create(null)) {
    const lastModelUpdates = Object.create(null)
    Object.entries(obj).forEach(([prop, newValue]) => {
      if (this[MixinDefs.DataModel][prop] !== newValue) {
        lastModelUpdates[prop] = newValue
      }
    })
    Object.assign(this[MixinDefs.DataModel], obj)
    this[MixinDefs.onModelUpdate](lastModelUpdates)
  }

  [MixinDefs.onModelUpdate]() {
    this[MixinDefs.HTMLMarker].updateModel(this[MixinDefs.DataModel])
  }

  [MixinDefs.resetDataModel]() {
    this[MixinDefs.updateDataModel](this[MixinDefs.DefaultDataModel])
  }

}
