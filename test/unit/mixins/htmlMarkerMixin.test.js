import { HTMLMarkerMixin } from 'mixins'

describe('HTMLMarkerMixin', () => {

  let BASE
  let classInstance
  let MixinNS

  beforeEach(() => {
    BASE = HTMLMarkerMixin(class {})
    const newClass = class extends BASE {}
    classInstance = new newClass()
    MixinNS = classInstance.MixinNS
  })

  describe('interface', () => {

    it('should be a Function', async () => {
      expect(HTMLMarkerMixin).toEqual(jasmine.any(Function))
    })

    it('should have the mixin definitions when extended', async () => {
      expect(MixinNS).toEqual(jasmine.any(Object))
    })

  })

  describe('extends', () => {

    it('should have a data model variable', async () => {
      expect(classInstance[MixinNS.DataModel]).toEqual(jasmine.any(Object))
    })

    it('should have a data model variable', async () => {
      expect(classInstance[MixinNS.HTMLMarker]).toBeDefined()
    })

    it('should have a default data model variable', async () => {
      expect(classInstance[MixinNS.DefaultDataModel]).toEqual(jasmine.any(Object))
    })

    it('should update the data model', async () => {
      classInstance[MixinNS.updateDataModel]({testing: 'testing'})
      expect(classInstance[MixinNS.DataModel]).toEqual({testing: 'testing'})
    })

    it('should reset the data model', async () => {
      classInstance[MixinNS.resetDataModel]()
      expect(classInstance[MixinNS.DataModel]).toEqual({})
    })

  })

})
