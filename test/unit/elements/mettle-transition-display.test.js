const ELEM_TAG_NAME = 'mettle-transition-display'

describe(ELEM_TAG_NAME, () => {

  let $el
  const elemTag = ELEM_TAG_NAME

  beforeEach(() => {
    $el = document.createElement(elemTag)
    document.body.appendChild($el)
  })

  afterEach(() => {
    document.body.removeChild($el)
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

    it('should safely insert html', async () => {
      $el.dataset.enable = false
      await $el.insertContent('<template><h1>Testing</h1></template>')
      expect($el.innerHTML).toEqual('<h1>Testing</h1>')
    })

    it('should append html elements', async () => {
      $el.dataset.enable = false
      await $el.insertContent('<template><h1>Testing</h1></template>')
      const $div = document.createElement('div')
      $el.addElementToContent($div)
      expect($el.contains($div)).toBeTrue()
    })

    it('should safely insert style', async () => {
      $el.dataset.enable = false
      await $el.insertContent('<template><h1>Testing</h1></template><style>h1{margin-left:1px;}</style>')
      const h1Styles = window.getComputedStyle($el.querySelector('h1'))
      expect(h1Styles.getPropertyValue('margin-left')).toEqual('1px')
    })

    it('should preserve slotted insert style', async () => {
      $el.dataset.enable = false
      await $el.insertContent('<template><h1>Testing</h1></template><style>::slotted(h1){margin-left:2px;}</style>')
      const h1Styles = window.getComputedStyle($el.querySelector('h1'))
      expect(h1Styles.getPropertyValue('margin-left')).toEqual('2px')
    })

    it('should transition a style', () => {
      document.body.insertAdjacentHTML('afterbegin', '<div id="transition">Testing</h1>')
      const $elem = document.getElementById('transition')
      $elem.style.transition = 'all 0.2s'
      $elem.style.transformStyle = 'preserve-3d'
      $el._transitionToPromise($elem, 'opacity', 1)
      /* this does not trigger event */
      $elem.dispatchEvent(new Event('transitionend'))
      expect($elem.style.opacity).toEqual('1')
      $elem.remove()
    })

  })

})
