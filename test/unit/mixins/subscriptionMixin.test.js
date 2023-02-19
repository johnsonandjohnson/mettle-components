import { SubscriptionMixin } from 'mixins'

describe('SubscriptionMixin', () => {

  let BASE
  let classInstance
  let MixinNS

  let Observable = class {
    unsubscribe() {}
  }

  beforeEach(() => {
    BASE = SubscriptionMixin(class { disconnectedCallback(){} })
    const newClass = class extends BASE {}
    classInstance = new newClass()
    MixinNS = classInstance.MixinNS
  })

  describe('interface', () => {

    it('should be a Function', async () => {
      expect(SubscriptionMixin).toEqual(jasmine.any(Function))
    })

    it('should have the mixin definitions when extended', async () => {
      expect(MixinNS).toEqual(jasmine.any(Object))
    })

  })

  describe('extends', () => {

    it('should have a subscription variable', async () => {
      expect(Array.isArray(classInstance[MixinNS.Subscription])).toBeTrue()
    })

    it('should unsubscribe on disconnected callback', async () => {
      classInstance[MixinNS.Subscription].push(new Observable())
      classInstance.disconnectedCallback()
      expect(classInstance[MixinNS.Subscription]).toBeNull()
    })

    it('should unsubscribe an array on disconnected callback', async () => {
      classInstance[MixinNS.Subscription] = [
        new Observable(),
        new Observable(),
      ]
      classInstance.disconnectedCallback()
      expect(classInstance[MixinNS.Subscription]).toBeNull()
    })

  })

})
