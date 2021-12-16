const ELEM_TAG_NAME = 'mettle-skeleton'

describe(ELEM_TAG_NAME, () => {

  let $el
  const elemTag = ELEM_TAG_NAME

  function generateSlot() {
    return `<area shape="rect" coords="10,250,600,40" />
    <area shape="circle" coords="10,0,30" />`.trim()
  }

  beforeEach(() => {
    $el = globalThis.document.createElement(elemTag)
    $el.insertAdjacentHTML('afterbegin', generateSlot())
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

    it('should able to set a shimmer', () => {
      $el.setAttribute('data-shimmer', 'true')
      const hasShimmer = $el.$container.classList.contains('shimmer')
      expect(hasShimmer).toBeTrue()
    })

  })

})

