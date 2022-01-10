import { Router as RouterService } from 'services'

describe('RouterService', () => {


  describe('functions', () => {

    it('should change the history api', (done) => {
      RouterService.setPath('test', (req, next) => {
      })
      const pathChange = () => {
        expect(true).toBeTrue()
        window.removeEventListener(RouterService.routeChangeEventName, pathChange)
        done()
      }
      window.addEventListener(RouterService.routeChangeEventName, pathChange)
      RouterService.goto('test')
    })

    it('should execute the exit function', (done) => {
      RouterService.setPath('/exit1', (req, next) => {
        req.exit(() => {
          expect(true).toBeTrue()
          done()
        })
        RouterService.goto('/exit2')
      })
      RouterService.setPath('/exit2', (req, next) => {
        next()
      })
      RouterService.goto('/exit1')
    })

    it('should execute the default path from an unknown path', (done) => {
      RouterService.defaultPath('/unknown')
      RouterService.setPath('/unknown', (req, next) => {
        expect(window.location.href.includes('unknown')).toBeTrue()
        expect(RouterService.$defaultPath).toEqual('unknown')
        done()
      })
      RouterService.goto('/null')
    })

    it('should have access to route params', (done) => {
      RouterService.setPath('/test/:id', (req, next) => {
        expect(req.params.get('id')).toEqual('123')
        done()
      })
      RouterService.goto('/test/123')
    })

    it('should route to optional paths', (done) => {
      RouterService.setPath('/optional/:id?', (req, next) => {
        expect(req.params.get('id')).not.toBeDefined()
        done()
      })
      RouterService.goto('/optional')
    })

  })
})
