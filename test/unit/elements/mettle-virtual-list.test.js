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
  let $parent
  const elemTag = ELEM_TAG_NAME

  const listItems = ['one', 'two', 'three', 'four', 'five', 'six']


  beforeEach(async () => {
    $parent = globalThis.document.createElement('div')
    $parent.style.height = `100vh`
    $parent.style.display = 'block'
    $el = globalThis.document.createElement(elemTag)
    //$el.dataset.fixedRows = '10'
    $parent.appendChild($el)
    globalThis.document.body.appendChild($parent)

    await $el.render({
      listItems,
      renderRow: () => document.createElement(`${ELEM_TAG_NAME_SUB}`),
      updateRow: (elem, data) => elem.updateModel(data)
    })
  })

  afterEach(() => {
    $el.remove()
    $el = null
    $parent.remove()
    $parent = null
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

    it('should be able select on click', async () => {
      $el.viewPortItems[0].click()
      let hasClass = $el.viewPortItems[0].part.contains($el.ROW_STATE.SELECTED)
      expect(hasClass).toBeTrue()
      $el.clearSelectedRows()
      hasClass = $el.viewPortItems[0].part.contains($el.ROW_STATE.SELECTED)
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
      $parent.style.height = `${rowHeight*2}px`
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

    it('should dispatch a custom event on a row un-selection', () => {
      let eventDispatched = false

      $el.addEventListener($el.EVENT_TYPES.UNSELECTED, () => {
        eventDispatched = true
      })
      $el.viewPortItems[0].click()
      $el.viewPortItems[0].click()
      expect(eventDispatched).toBeTrue()
    })

    it('should remove all rendered view port items when new render function is added', async () => {
      await $el.render({
        listItems: ['1', '2', '3'],
        renderRow: () => document.createElement('div'),
        updateRow: (elem, data) => {
          elem.innerHTML = data
        }
      })
      expect($el.listItemsHeightLength).toEqual(3)
    })

    it('should compare items from the previous list to the updated list', async () => {
      await $el.render({
        listItems: ['one', 'two', 'three', '4', '5', '6'],
      })
      let isSameItem = $el.sameListItem(0)
      expect(isSameItem).toBeTrue()
      isSameItem = $el.sameListItem(5)
      expect(isSameItem).toBeFalse()
    })


    it('should allow fixed rows to be updated', async () => {
      const currentFixedRows = $el.fixedRows
      $el.dataset.fixedRows = '5'
      const newFixedRows = $el.fixedRows
      expect(currentFixedRows).toBeLessThan(newFixedRows)
    })


  })

})
