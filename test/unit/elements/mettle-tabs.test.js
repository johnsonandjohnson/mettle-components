import { wait } from '../helper.js'
const ELEM_TAG_NAME = 'mettle-tabs'

describe(ELEM_TAG_NAME, () => {

  let $el
  const elemTag = ELEM_TAG_NAME

  function generateSlot() {
    return `<div slot="navigation">one</div>
    <div slot="navigation">two</div>
    <div>one thing</div>
    <div>two thing</div>`.trim()
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

    it('should display content on tab selection ', async () => {
      await wait(50)
      const tabIndex = 1
      const $slotDiv = globalThis.document.querySelector('div:nth-child(2)')
      let attrValue = $slotDiv.getAttribute('aria-selected')
      expect(attrValue).toEqual('false')
      $el.selected = tabIndex
      expect($el.selected).toEqual(tabIndex)
      attrValue = $slotDiv.getAttribute('aria-selected')
      expect(attrValue).toEqual('true')
    })

  })

})

