const ELEM_TAG_NAME = 'mettle-loader'

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

    it('should be loading when set to true', () => {
      $el.loading()
      const isLoading = $el.getAttribute('data-loading')
      expect(isLoading).toEqual('true')
    })

    it('should not be loading when set to false', () => {
      $el.done()
      const isLoading = $el.getAttribute('data-loading')
      expect(isLoading).toEqual('false')
    })

    it('should add the size to the loader', () => {
      const SIZE = 'small'
      $el.setAttribute('data-size', SIZE)
      const hasSize = $el.$content.classList.contains(SIZE)
      expect(hasSize).toBeTrue()
    })

  })

})

