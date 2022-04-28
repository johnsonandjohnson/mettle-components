import { wait } from "../helper"

const ELEM_TAG_NAME = 'mettle-sidebar'

describe(ELEM_TAG_NAME, () => {

  let $el
  const elemTag = ELEM_TAG_NAME

  beforeEach(() => {
    globalThis.document.body.insertAdjacentHTML('afterbegin', '<div id="test">Testing</div>')
    globalThis.document.body.insertAdjacentHTML('afterbegin', '<mettle-sidebar data-width="15rem" data-for="test"><div slot="content">Content Testing</div></mettle-sidebar>')
    $el = globalThis.document.querySelector(elemTag)
  })

  afterEach(() => {
    const target = globalThis.document.getElementById('test')
    if (target) {
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
    it('should return boolean for isOpened', () => {
      const opened = $el.isOpened
      expect(opened).toBeFalse()
    })

    it('should be able to toggle the sidebar to open and close', () => {
      $el.toggle()
      expect($el.getAttribute('open')).toBeDefined()
      $el.toggle()
      expect($el.getAttribute('open')).toBeNull()
    })

    it('should be able to change position to right', () => {
      const componentStyle = globalThis.getComputedStyle($el.$sidebar)
      const firstPosition = componentStyle.getPropertyValue('right')
      $el.setAttribute('data-position', 'right')
      const secondPosition = componentStyle.getPropertyValue('right')
      expect(firstPosition).not.toEqual(secondPosition)
    })

    it('should be able to change position to right when attached to body tag', () => {
      $el.remove()
      globalThis.document.body.setAttribute('id', 'test-id')
      globalThis.document.body.insertAdjacentHTML('afterbegin', '<mettle-sidebar data-for="test-id"><div slot="content">Content Testing</div></mettle-sidebar>')
      const $secondEl = globalThis.document.querySelector(elemTag)
      const componentStyle = globalThis.getComputedStyle($secondEl.$sidebar)

      const leftValue = componentStyle.getPropertyValue('left')
      const rightValue = componentStyle.getPropertyValue('right')

      $secondEl.setAttribute('data-position', 'right')

      const secondLeftValue = componentStyle.getPropertyValue('left')
      const secondRightValue = componentStyle.getPropertyValue('right')
      expect(leftValue).not.toEqual(secondLeftValue)
      expect(rightValue).not.toEqual(secondRightValue)
    })

    it('should remove sidebar element when target is removed', async () => {
      const targetElem = globalThis.document.getElementById('test')
      targetElem.remove()
      await wait(500)
      expect($el.isConnected).toBeFalse()
    })

    it('should be able to change width of sidebar', async () => {
      $el.open()
      await wait(1000)
      const componentStyle = globalThis.getComputedStyle($el.$sidebar)
      const widthValue = componentStyle.getPropertyValue('width')
      $el.setAttribute('data-width', '20rem')
      await wait(1000)
      const secondWidthValue = componentStyle.getPropertyValue('width')
      expect(widthValue).not.toEqual(secondWidthValue)
    })

    it('should return an object of event type values', () => {
      expect($el.EVENT_TYPES).toEqual(jasmine.any(Object))
    })

  })

})

