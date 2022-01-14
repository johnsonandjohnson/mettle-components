const ELEM_TAG_NAME = 'mettle-sort-header'

describe(ELEM_TAG_NAME, () => {

  let $el
  const elemTag = ELEM_TAG_NAME

  function generateSlot() {
    return `<div data-key="date">Date</div>
    <div data-key="title">Title</div>`.trim()
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

    it('should able to set a sort for a slot element', () => {
      const $slotEl = document.querySelector('[data-key="date"]')
      $slotEl.click()
      const hasActiveState = $slotEl.classList.contains($el.KEY_NAMES.SORT_SELECTED_CLASS)
      expect(hasActiveState).toBeTrue()
    })

    it('should dispatch and event when element is clicked', (done) => {
      $el.addEventListener($el.EVENT_TYPES.SORT, evt => {
        expect(evt.detail.asc).toBeTrue()
        done()
      })
      const $slotEl = document.querySelector('[data-key="date"]')
      $slotEl.click()
    })

    it('should set the element to descending when clicked on twice', () => {
      const $slotEl = document.querySelector('[data-key="date"]')
      $slotEl.click()
      $slotEl.click()
      const sortState = $slotEl.getAttribute($el.KEY_NAMES.SORT_DIRECTION_NAME)
      expect(sortState).toEqual($el.SORT_ORDER.DESCENDING)
    })

    it('should return a sort order options object', () => {
     expect($el.SORT_ORDER).toEqual(jasmine.any(Object))
    })

    it('should reset or sorting states', () => {
      const $slotEl = document.querySelector('[data-key="date"]')
      $slotEl.click()
      $el.resetAllSorting()
      const hasActiveState = $slotEl.classList.contains($el.KEY_NAMES.SORT_SELECTED_CLASS)
      expect(hasActiveState).toBeFalse()
    })

  })

})

