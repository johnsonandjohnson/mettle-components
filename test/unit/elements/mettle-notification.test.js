import { wait } from '../helper.js'
const ELEM_TAG_NAME = 'mettle-notification'

describe(ELEM_TAG_NAME, () => {

  let $el
  const elemTag = ELEM_TAG_NAME
  const expect = chai.expect

  before(() => {
    $el = globalThis.document.createElement(elemTag)
    globalThis.document.body.appendChild($el)
  })

  after(() => {
    $el.remove()
    $el = null
  })

  describe('interface', () => {

    it('should be defined', async () => {
      expect($el).to.not.be.undefined
      expect(globalThis.customElements.get(elemTag)).to.not.be.undefined
    })

    it('should be an Element node', async () => {
      expect($el.nodeType).to.equal(Node.ELEMENT_NODE)
    })

  })

  describe('component', () => {

    it('should display a new notification', async () => {
      await wait(10)
      const id = $el.addNotification({
        message: 'testing',
        title: 'Test'
      })
      const $notification = $el.shadowRoot.getElementById(id)
      expect($notification.isConnected).to.be.true
    })

    it('should close the notification', async () => {
      await wait(10)
      const id = $el.addNotification({
        message: 'testing2',
        title: 'Test2'
      })

      const $notification = $el.shadowRoot.getElementById(id)
      $el.closeNotification(id)
      $notification.dispatchEvent(new Event('transitionend'))
      await wait(100)
      expect($notification.isConnected).to.be.false
    }).timeout(3000)


    it('should stop the timer when mouse over', async () => {
      await wait(10)
      const id = $el.addNotification({
        message: 'testing2',
        title: 'Test2'
      })

      const $notification = $el.shadowRoot.getElementById(id)
      const $circle = $notification.querySelector('.circle')
      $notification.dispatchEvent(new Event('mouseover'))
      let hasTimer = $circle.classList.contains('circle')
      expect(hasTimer).to.be.false
      $notification.dispatchEvent(new Event('mouseout'))
      hasTimer = $circle.classList.contains('circle')
      expect(hasTimer).to.be.true
    })

  })

})

