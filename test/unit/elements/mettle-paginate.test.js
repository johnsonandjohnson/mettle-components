const ELEM_TAG_NAME = 'mettle-paginate'

describe(ELEM_TAG_NAME, () => {

  let $el
  const elemTag = ELEM_TAG_NAME

  beforeEach(() => {
    $el = globalThis.document.createElement(elemTag)
    $el.setAttribute('data-total-items', '100')
    $el.setAttribute('data-page-sizes', '10,20,50')
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

    it('should update the items shown when page size is updated', async () => {
      $el.setCurrentPageSize('20')
      expect($el.totalPages).toEqual(5)
    })

    it('should dispatch a custom event when the next button is clicked', () => {
      let eventDispatched = false
      $el.addEventListener($el.EVENT_TYPES.PAGINATION, () => {
        eventDispatched = true
      })
      $el.$next.click()
      expect(eventDispatched).toBeTrue()
    })

    it('should dispatch a custom event when the previous button is clicked', () => {
      let eventDispatched = false
      $el.setCurrentPage(2)
      $el.addEventListener($el.EVENT_TYPES.PAGINATION, () => {
        eventDispatched = true
      })
      $el.$previous.click()
      expect(eventDispatched).toBeTrue()
    })

    it('should dispatch a custom event when the page jump selection is changed', () => {
      let eventDispatched = false

      $el.addEventListener($el.EVENT_TYPES.PAGINATION, () => {
        eventDispatched = true
      })
      $el.$pageJump.value = 2
      $el.$pageJump.dispatchEvent(new Event('change'))
      expect(eventDispatched).toBeTrue()
    })

    it('should dispatch a custom event when the page size selection is changed', () => {
      let eventDispatched = false

      $el.addEventListener($el.EVENT_TYPES.PAGINATION, () => {
        eventDispatched = true
      })
      $el.$pageSizeSelect.value = 20
      $el.$pageSizeSelect.dispatchEvent(new Event('change'))
      expect(eventDispatched).toBeTrue()
    })

    it('should return an object of controller values', () => {
      expect($el.CONTROLLERS).toEqual(jasmine.any(Object))
    })

    it('should set the current page to one if less than one', () => {
      $el.setCurrentPage(-1)
      expect($el.currentPage).toEqual(1)
    })

    it('should set the current page to the max pages if set above limit', () => {
      $el.setCurrentPage($el.totalPages+999)
      expect($el.currentPage).toEqual($el.totalPages)
    })

  })

})

