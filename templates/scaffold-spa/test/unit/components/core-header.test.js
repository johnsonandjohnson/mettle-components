const ELEM_TAG_NAME = 'core-header'

describe(ELEM_TAG_NAME, () => {

  let $el

  beforeEach(() => {
    $el = document.createElement(ELEM_TAG_NAME)
    document.body.appendChild($el)
  })

  afterEach(() => {
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
  /*
  describe('component', () => {

  })
  */
})
