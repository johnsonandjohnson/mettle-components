import { Utility } from 'services'

describe('Utility', () => {

  describe('functions', () => {

    it('should execute LoadHTML and continue routing', (done) => {
      const HTML = '<p>Testing</p>'
      const $MettleTransitionDisplay = document.createElement('mettle-transition-display')
      $MettleTransitionDisplay.classList.add('route-display')
      document.body.appendChild($MettleTransitionDisplay)
      const middleWare = Utility.LoadHTML(HTML)
      middleWare(null, done)
      $MettleTransitionDisplay.remove()
    })

    it('should throw an error if not able to load HTML', async () => {
      const HTML = '<p>Testing</p>'
      const middleWare = Utility.LoadHTML(HTML)
      const noop = () => null
      await expectAsync(middleWare(null, noop)).toBeRejectedWithError()
    })

  })

})
