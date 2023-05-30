import { Observable } from 'services'

import { wait } from "../helper"

describe('Observable', () => {

  describe('functions', () => {

    it('should allow you to subscribe', async () => {
      const observable = new Observable()
      const subscription = observable.subscribe({
        complete: () => { },
        error: () => { },
        next: () => { }
      })
      expect(observable.observers.size).toBeGreaterThan(0)
      subscription.unsubscribe()
    })

    it('should reset on complete', async () => {
      const observable = new Observable()
      const subscription = observable.subscribe({
        complete: () => { },
        error: () => { },
        next: () => { }
      })
      observable.complete()
      expect(observable.observers).toHaveSize(0)
      subscription.unsubscribe()
    })

    it('should notify subscribers', async () => {
      const observable = new Observable()
      const subscription = observable.subscribe({
        complete: () => { },
        error: () => { },
        next: (subject) => { expect(subject).toEqual('test') }
      })
      observable.notify('test')
      subscription.unsubscribe()
    })

    it('should notify subscribers of an error', async () => {
      const observable = new Observable()
      const subscription = observable.subscribe({
        complete: () => { },
        error: (subject) => { expect(subject).toEqual('test') },
        next: () => { }
      })
      observable.notifyError('test')
      subscription.unsubscribe()
    })

    it('should limit the number if emits when only() is set', async () => {
      const observable = new Observable()
      observable.subscribe(() => { }).only(2)
      observable.notify('test')
      expect(observable.observers.size).toBeGreaterThan(0)
      observable.notify('test')
      expect(observable.observers).toHaveSize(0)
    })

    it('should notify when subject is cached', async () => {
      const notifyCall = jasmine.createSpy()
      const observable = new Observable()
      observable.notify(notifyCall)
      observable.notifyError(notifyCall)
      const subscription = observable.subscribe({
        complete: () => { },
        error: (subject) => { subject() },
        next: (subject) => { subject()  }
      })
      await wait(200)
      expect(notifyCall).toHaveBeenCalledTimes(2)

    })

  })
})
