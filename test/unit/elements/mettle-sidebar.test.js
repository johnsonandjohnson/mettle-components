const ELEM_TAG_NAME = 'mettle-sidebar'

describe(ELEM_TAG_NAME, () => {

  let $el
  const elemTag = ELEM_TAG_NAME

  beforeEach(() => {
    $el = globalThis.document.createElement(elemTag)
    globalThis.document.body.appendChild($el)
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

  describe('component', () => {

    // it('should be loading when set to true', () => {
    //   $el.loading()
    //   const isLoading = $el.getAttribute('data-loading')
    //   expect(isLoading).toEqual('true')
    // })

    it('should return boolean for isOpened', () => {
      const opened = $el.isOpened()
      expect(opened).toBeFalse()
    })
    
    it('should return an object of event type values', () => {
      expect($el.EVENT_TYPES).toEqual(jasmine.any(Object))
    })

  })

})

