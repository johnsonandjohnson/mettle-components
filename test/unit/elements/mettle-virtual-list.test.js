import { generateHTMLParagraphs } from '../helper.js'
const ELEM_TAG_NAME = 'mettle-virtual-list'
const ELEM_TAG_NAME_SUB = `sample-row`

if (!window.customElements.get(ELEM_TAG_NAME_SUB)) {
  window.customElements.define(ELEM_TAG_NAME_SUB, class extends HTMLElement {
    constructor() {
      super()
    }
    async connectedCallback() {
      this.innerHTML = `<div>data test</div>`
      this.$div = this.querySelector('div')
    }
    updateModel(data) {
      if (data && this.$div) {
        this.$div.innerHTML = data
      }
    }
  })
}

describe(ELEM_TAG_NAME, () => {

  let $el
  const elemTag = ELEM_TAG_NAME

  const listItems = ['one', 'two', 'three', 'four', 'five', 'six']


  beforeEach(async () => {
    $el = globalThis.document.createElement(elemTag)
    globalThis.document.body.appendChild($el)
    $el.style.height = `100vh`
    $el.style.display = 'block'
    await $el.render({
      listItems,
      renderRow: () => document.createElement(`${ELEM_TAG_NAME_SUB}`),
      updateRow: (elem, data) => elem.updateModel(data)
    })
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

    it('should be able to indicate hover on the mouseover of an item', async () => {
      const event = new UIEvent('mouseover')
      $el.viewPortItems[1].dispatchEvent(event)
      const hasClass = $el.viewPortItems[1].classList.contains($el.CLASS_STATE.HOVERED)
      expect(hasClass).toBeTrue()
    })

    it('should be able select on click', async () => {
      $el.viewPortItems[0].click()
      let hasClass = $el.viewPortItems[0].classList.contains($el.CLASS_STATE.SELECTED)
      expect(hasClass).toBeTrue()
      $el.clearSelectedRows()
      hasClass = $el.viewPortItems[0].classList.contains($el.CLASS_STATE.SELECTED)
      expect(hasClass).toBeFalse()
    })

    it('should be able to indicate hover on mouse over', async () => {
      const $row = $el.viewPortItems[0]
      let event = new UIEvent('mouseover')
      $row.dispatchEvent(event)

      let hasClass = $row.classList.contains($el.CLASS_STATE.HOVERED)
      expect(hasClass).toBeTrue()

      event = new UIEvent('mouseout')
      $row.dispatchEvent(event)

      hasClass = $row.classList.contains($el.CLASS_STATE.HOVERED)
      expect(hasClass).toBeFalse()
    })

    it('should be able to append to the current list', async () => {
      let listCount = listItems.length
      expect(listCount).toEqual(6)
      await $el.appendItems(listItems)
      listCount *= 2
      expect(listCount).toEqual(12)
    })

    it('should be able to dynamically display the height', async () => {
      $el.setAttribute('data-dynamic', 'true')
      const newList = [generateHTMLParagraphs(5)]
      const prevLargestHeight = $el.largestItemHeight
      await $el.appendItems(newList)
      const nextLargestHeight = $el.largestItemHeight
      expect(prevLargestHeight).toBeLessThan(nextLargestHeight)
    })

    it('should be able to stop scroll at max', async () => {
      const rowHeight = $el.smallestItemHeight
      $el.style.height = `${rowHeight*2}px`
      $el.$container.scrollTop = $el.totalHeight * 2
      $el.adjustScroll()
      expect($el.$container.scrollTop).toBeLessThanOrEqual($el.scrollMax)
    })

    it('should return an object of event type values', () => {
      expect($el.EVENT_TYPES).toEqual(jasmine.any(Object))
    })

    it('should return undefined if rendering the same list', async () => {
      const results = await $el.render({ listItems })
      expect(results).toBeUndefined()
    })

    it('should return undefined if appending an empty list', async () => {
      const results = await $el.appendItems()
      expect(results).toBeUndefined()
    })

    it('should dispatch a custom event on a row selection', () => {
      let eventDispatched = false

      $el.addEventListener($el.EVENT_TYPES.SELECTED, () => {
        eventDispatched = true
      })
      $el.viewPortItems[0].click()
      expect(eventDispatched).toBeTrue()
    })


  })

})
