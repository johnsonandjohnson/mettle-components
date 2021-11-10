const ELEM_TAG_NAME = 'mettle-loader'

describe(ELEM_TAG_NAME, () => {

  let $el
  const elemTag = ELEM_TAG_NAME
  const expect = chai.expect

  beforeEach(() => {
    $el = globalThis.document.createElement(elemTag)
    globalThis.document.body.appendChild($el)
  })

  afterEach(() => {
    $el.remove()
    $el = null
  })

  describe('interface', () => {

    it('should be defined', async () => {
      expect($el).to.not.be.undefined
      expect(globalThis.customElements.get(elemTag)).to.not.be.undefined
    })

    it('should be an Element node ', async () => {
      expect($el.nodeType).to.equal(Node.ELEMENT_NODE)
    })

  })

  describe('component', () => {

    it('should be loading when set to true', () => {
      $el.loading()
      const isLoading = $el.getAttribute('data-loading')
      expect(isLoading).to.equal('true')
    })

    it('should not be loading when set to false', () => {
      $el.done()
      const isLoading = $el.getAttribute('data-loading')
      expect(isLoading).to.equal('false')
    })

    it('should add the size to the loader', () => {
      const SIZE = 'small'
      $el.setAttribute('data-size', SIZE)
      const hasSize = $el.$content.classList.contains(SIZE)
      expect(hasSize).to.be.true
    })

  })

})

