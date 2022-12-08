import { Constants, Router } from 'services'
import { MainCtrl as HomeCtrl } from 'features/dashboard/home.js'
import { MainCtrl as AboutCtrl } from 'features/dashboard/about.js'

describe('Features', () => {
  describe('dashboard', () => {

    let reqMock
    const route = Constants.ROUTES.ABOUT
    let next

    beforeEach(() => {
      spyOn(Router, 'getCurrentPath').and.returnValue('/about/')
      next = jasmine.createSpy('next')
      reqMock = {
        canExit: jasmine.createSpy('canExit'),
        currentPath: Router.getAdjustedPath(Router.getCurrentPath()),
        exit: jasmine.createSpy('exit'),
        params: Router._pathParams(route),
        route,
        search: Router.getCurrentSearchParams()
      }
    })

    describe('home', () => {

      it('should execute the controller and continue routing', () => {
        const controller = HomeCtrl.bind(null, reqMock, next)
        controller()
        expect(next).toHaveBeenCalled()
      })

    })

    describe('about', () => {

      it('should execute the controller and continue routing', () => {
        const controller = AboutCtrl.bind(null, reqMock, next)
        controller()
        expect(next).toHaveBeenCalled()
      })

    })

  })
})
