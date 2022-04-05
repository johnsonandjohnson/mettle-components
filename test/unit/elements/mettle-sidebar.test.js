import { wait } from "../helper"

const ELEM_TAG_NAME = 'mettle-sidebar'

describe(ELEM_TAG_NAME, () => {

  let $el
  const elemTag = ELEM_TAG_NAME

  beforeEach(() => {
    globalThis.document.body.insertAdjacentHTML('afterbegin', '<div id="test">Testing</div>')
    globalThis.document.body.insertAdjacentHTML('afterbegin', '<mettle-sidebar data-for="test"><div slot="content">Content Testing</div></mettle-sidebar>')
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

    // it('should be loading when set to true', () => {
    //   $el.loading()
    //   const isLoading = $el.getAttribute('data-loading')
    //   expect(isLoading).toEqual('true')
    // })

    it('should return boolean for isOpened', () => {
      const opened = $el.isOpened
      expect(opened).toBeFalse()
    })

    it('should be able to toggle the sidebar to open and close', () => {
      $el.toggleNav()
      expect($el.getAttribute('open')).toBeDefined()
      $el.toggleNav()
      expect($el.getAttribute('open')).toBeNull()
    })

    it('should be able to change sidebar to main navigation sidebar', () => {
      const componentStyle = globalThis.getComputedStyle($el.$sidebar)
      const firstPosition  = componentStyle.getPropertyValue('position')
      $el.setAttribute('main-sidebar', '')
      const secondPosition  = componentStyle.getPropertyValue('position')
      expect(firstPosition).not.toEqual(secondPosition)
    })

    it('should be able to change position to right', () => {
      const componentStyle = globalThis.getComputedStyle($el.$sidebar)
      const firstPosition = componentStyle.getPropertyValue('right')
      $el.setAttribute('data-position', 'right')
      const secondPosition = componentStyle.getPropertyValue('right')
      console.log(firstPosition, secondPosition)
      expect(firstPosition).not.toEqual(secondPosition)
    })

    it('should be able to change position to right when used as a main sidebar', () => {
      $el.remove()
      globalThis.document.body.insertAdjacentHTML('afterbegin', '<mettle-sidebar data-for="test" main-sidebar><div slot="content">Content Testing</div></mettle-sidebar>')
      const $secondEl = globalThis.document.querySelector(elemTag)
      const componentStyle = globalThis.getComputedStyle($secondEl.$sidebar)
      $secondEl.open()

      const firstPosition = componentStyle.getPropertyValue('width')
      const testPosition = componentStyle.getPropertyValue('left')
      $el.setAttribute('data-position', 'right')
      const secondPosition = componentStyle.getPropertyValue('left')

      console.log(firstPosition, testPosition, secondPosition)
    })

    it('should return an object of event type values', () => {
      expect($el.EVENT_TYPES).toEqual(jasmine.any(Object))
    })

  })

})

