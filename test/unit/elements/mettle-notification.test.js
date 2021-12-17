import { wait } from '../helper.js'
const ELEM_TAG_NAME = 'mettle-notification'

describe(ELEM_TAG_NAME, () => {

  let $el
  const elemTag = ELEM_TAG_NAME

  beforeAll(() => {
    $el = globalThis.document.createElement(elemTag)
    globalThis.document.body.appendChild($el)
  })

  afterAll(() => {
    $el.remove()
    $el = null
  })

  describe('interface', () => {

    it('should be defined', () => {
      expect($el).toBeDefined()
      expect(globalThis.customElements.get(ELEM_TAG_NAME)).toBeDefined()
    })

    it('should be an Element node', () => {
      expect($el.nodeType).toEqual(Node.ELEMENT_NODE)
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
      expect($notification.isConnected).toBeTrue()
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
      expect($notification.isConnected).toBeFalse()
    }, 3000)


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
      expect(hasTimer).toBeFalse()
      $notification.dispatchEvent(new Event('mouseout'))
      hasTimer = $circle.classList.contains('circle')
      expect(hasTimer).toBeTrue()
    })

  })

})

