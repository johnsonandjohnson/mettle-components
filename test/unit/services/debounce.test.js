import { Debounce } from 'services'

describe('Debounce', () => {

  describe('functions', () => {

    it('should wait 50 milliseconds to run a function', (done) => {
      const wait = Debounce(() => {
        done()
      })
      wait()
    })

    it('should cancel first call if called within 50 milliseconds', (done) => {
      const subscribeSpy = jasmine.createSpy()
      const wait = Debounce(subscribeSpy)
      wait()
      wait()
      expect(subscribeSpy).not.toHaveBeenCalled()
      setTimeout(()=> {
        expect(subscribeSpy).toHaveBeenCalled()
        done()
      }, 1000)
    })

  })

})
