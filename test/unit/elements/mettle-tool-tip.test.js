import { wait } from '../helper.js'
const ELEM_TAG_NAME = 'mettle-tool-tip'

describe(ELEM_TAG_NAME, () => {

  let $el
  const elemTag = ELEM_TAG_NAME

  beforeEach(() => {
    globalThis.document.body.insertAdjacentHTML('afterbegin', '<p id="test">Testing</p>')
    globalThis.document.body.insertAdjacentHTML('afterbegin', '<mettle-tool-tip data-for="test">Tip Text</mettle-tool-tip>')
    $el = globalThis.document.querySelector(elemTag)
  })

  afterEach(() => {
    const target = globalThis.document.getElementById('test')
    if(target) {
      target.remove()
    }
    if ($el) {
      $el.remove()
    }
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

      it('should show tip when element event is mouseover', async () => {
        const target = globalThis.document.getElementById('test')
        const event = new UIEvent('mouseover')
        target.dispatchEvent(event)
        const isActive = $el.$tip.classList.contains('active')
        expect(isActive).toBeTrue()
      })

      it('should remove tip when element event is mouseout', async () => {
        const target = globalThis.document.getElementById('test')
        let event = new UIEvent('mouseover')
        target.dispatchEvent(event)
        event = new UIEvent('mouseout')
        target.dispatchEvent(event)
        const isActive = $el.isShowing()
        expect(isActive).toBeFalse()
      })

      it('should be able to change position', async () => {
        const component = $el
        const componentStyle = globalThis.getComputedStyle(component.$tip)
        const firstPosition = componentStyle.getPropertyValue('left')
        component.dataset.position = 'left'
        const secondPosition = componentStyle.getPropertyValue('left')
        expect(firstPosition).not.toEqual(secondPosition)
      })

      it('should be able to change position bottom', async () => {
        const component = $el
        const componentStyle = globalThis.getComputedStyle(component.$tip)
        const firstPosition = componentStyle.getPropertyValue('bottom')
        component.dataset.position = 'bottom'
        const secondPosition = componentStyle.getPropertyValue('bottom')
        expect(firstPosition).not.toEqual(secondPosition)
      })

      it('should remove tool-tip element when target is removed', async () => {
        const target = globalThis.document.getElementById('test')
        target.remove()
        await wait(500)
        expect($el.isConnected).toBeFalse()
      })

      it('should remove target event when data-for is changed', async () => {
        globalThis.document.body.insertAdjacentHTML('afterbegin', '<p id="test2">Testing</p>')
        const target = globalThis.document.getElementById('test')
        const newTarget = globalThis.document.getElementById('test2')

        $el.dataset.for = 'test2'
        $el.dataset.position = 'top'
        let event = new UIEvent('mouseover')

        target.dispatchEvent(event)
        let isActive = $el.$tip.classList.contains('active')
        expect(isActive).toBeFalse()

        newTarget.dispatchEvent(event)
        isActive = $el.$tip.classList.contains('active')
        expect(isActive).toBeTrue()

        newTarget.remove()
      })

    })

})

