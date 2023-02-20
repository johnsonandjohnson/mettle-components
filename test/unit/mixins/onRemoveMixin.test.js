import { wait } from '../helper.js'
import { OnRemoveMixin } from 'mixins'

describe('OnRemoveMixin', () => {

  let BASE
  let classInstance
  let MixinNS
  let $elem

  beforeEach(() => {
    $elem = document.createElement('p')
    document.body.insertAdjacentElement('afterbegin', $elem)
    BASE = OnRemoveMixin(class {
      setupRemove($elem, callback) {
        this[this.MixinNS.onRemove]($elem, callback)
      }
    })
    const newClass = class extends BASE {}
    classInstance = new newClass()
    MixinNS = classInstance.MixinNS
  })

  afterEach(() => {
    $elem && $elem.remove()
    $elem = null
  })

  describe('interface', () => {

    it('should be a Function', async () => {
      expect(OnRemoveMixin).toEqual(jasmine.any(Function))
    })

    it('should have the mixin definitions when extended', async () => {
      expect(MixinNS).toEqual(jasmine.any(Object))
      expect(BASE.MixinNS).toEqual(jasmine.any(Object))
    })

  })

  describe('extends', () => {

    it('should call my callback when observed element is removed from the DOM', async () => {
      const callbackSpy = jasmine.createSpy('callback')
      classInstance.setupRemove($elem, callbackSpy)
      $elem.remove()
      await wait(300)
      expect(callbackSpy).toHaveBeenCalled()
    })

    it('should not call my callback when disconnectedCallback is called', async () => {
      const callbackSpy = jasmine.createSpy('callback')
      classInstance.setupRemove($elem, callbackSpy)
      classInstance.disconnectedCallback()
      $elem.remove()
      await wait(300)
      expect(callbackSpy).not.toHaveBeenCalled()
    })

  })

})
