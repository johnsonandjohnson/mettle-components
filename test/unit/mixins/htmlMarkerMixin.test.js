import { HTMLMarkerMixin } from 'mixins'

describe('HTMLMarkerMixin', () => {

  let BASE
  let classInstance
  let MixinDefs

  let Observable = class {
    unsubscribe() {}
  }

  beforeEach(() => {
    BASE = HTMLMarkerMixin(class {})
    MixinDefs = BASE.MixinDefs
    const newClass = class extends BASE {}
    classInstance = new newClass()
  })

  describe('interface', () => {

    it('should be a Function', async () => {
      expect(HTMLMarkerMixin).toEqual(jasmine.any(Function))
    })

    it('should have the mixin definitions when extended', async () => {
      expect(MixinDefs).toEqual(jasmine.any(Object))
    })

  })

  describe('extends', () => {

    it('should have a data model variable', async () => {
      expect(classInstance[MixinDefs.DataModel]).toEqual(jasmine.any(Object))
    })

    it('should have a data model variable', async () => {
      expect(classInstance[MixinDefs.HTMLMarker]).toBeDefined()
    })

    it('should have a default data model variable', async () => {
      expect(classInstance[MixinDefs.DefaultDataModel]).toEqual(jasmine.any(Object))
    })

    it('should update the data model', async () => {
      classInstance[MixinDefs.updateDataModel]({testing: 'testing'})
      expect(classInstance[MixinDefs.DataModel]).toEqual({testing: 'testing'})
    })

    it('should reset the data model', async () => {
      classInstance[MixinDefs.resetDataModel]()
      expect(classInstance[MixinDefs.DataModel]).toEqual({})
    })

  })

})
