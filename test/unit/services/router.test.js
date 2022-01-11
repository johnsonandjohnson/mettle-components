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

    it('should be able to set the resolve time', () => {
      RouterService.resolveIn(500)
      expect(RouterService._resolveTimeMS).toEqual(500)
    })

    it('should be able to update a route params', () => {
      const id = '123abc'
      RouterService.setPath('/update/:id', (req, next) => {
      })
      RouterService.goto('/update/123')
      RouterService.updateRouteParams({ id })
      expect(RouterService.getCurrentPath()).toContain(id)
    })

    it('should be able to update the URL search params', () => {
      RouterService.updateURLSearchParams({sort: 'date'})
      let URLParams = RouterService.getCurrentSearchParams()
      expect(URLParams.get('sort')).toEqual('date')
      RouterService.removeURLSearchParams()
      URLParams = RouterService.getCurrentSearchParams()
      expect(URLParams.get('sort')).toBeNull()
    })

    it('should be able to set a global middleware', () => {
      RouterService.use(RouterService.customElementsReady)
      expect(RouterService._allPathHandlers.size).toBeGreaterThan(0)
    })

    it('should be able to block the user from exiting the page', (done) => {
      let canExitCheck = true

      RouterService.setPath('/canexit1', (req, next) => {
        req.canExit(() => {
          canExitCheck = !canExitCheck
          return canExitCheck
        })
        req.exit(() => {
          expect(canExitCheck).toBeTrue()
          done()
        })
        RouterService.goto('/canexit2')
        RouterService.goto('/canexit2')
      })
      RouterService.setPath('/canexit2', (req, next) => {
        next()
      })
      RouterService.goto('/canexit1')
    })

  })
})
