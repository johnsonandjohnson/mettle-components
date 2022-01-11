import { ReadyState } from 'services'

describe('ReadyState', () => {

  describe('functions', () => {

    it('should allow you to subscribe', async () => {
      const readyState = new ReadyState()
      const subscription = readyState.subscribe(() => {
      })
      expect(readyState.observers.size).toBeGreaterThan(0)
      subscription.unsubscribe()
    })

    it('should notify subscribers of preparing state', () => {
      const readyState = new ReadyState()
      const subscription = readyState.subscribe(state => {
        expect(state).toEqual(readyState.PREPARING)
      })
      readyState.preparing()
      subscription.unsubscribe()
    })

    it('should notify subscribers of ready state', () => {
      const readyState = new ReadyState()
      const subscription = readyState.subscribe(state => {
        expect(state).toEqual(readyState.READY)
      })
      readyState.ready()
      subscription.unsubscribe()
    })

    it('should notify subscribers of updated state', () => {
      const readyState = new ReadyState()
      const subscription = readyState.subscribe(state => {
        expect(state).toEqual(readyState.UPDATED)
      })
      readyState.updated()
      subscription.unsubscribe()
    })

    it('should start at the current state of ready', () => {
      const readyState = new ReadyState()
      expect(readyState.CurrentState).toEqual(readyState.READY)
    })

  })
})
