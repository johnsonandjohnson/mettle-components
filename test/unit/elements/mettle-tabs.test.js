import { wait } from '../helper.js'
const ELEM_TAG_NAME = 'mettle-tabs'

describe(ELEM_TAG_NAME, () => {

  let $el
  const elemTag = ELEM_TAG_NAME
  const expect = chai.expect

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

    it('should be defined', async () => {
      expect($el).to.not.be.undefined
      expect(globalThis.customElements.get(elemTag)).to.not.be.undefined
    })

    it('should be an Element node', async () => {
      expect($el.nodeType).to.equal(Node.ELEMENT_NODE)
    })

  })

  describe('component', () => {

    it('should display content on tab selection ', async () => {
      await wait(50)
      const tabIndex = 1
      const $slotDiv = globalThis.document.querySelector('div:nth-child(2)')
      let attrValue = $slotDiv.getAttribute('aria-selected')
      expect(attrValue).to.equal('false')
      $el.selected = tabIndex
      expect($el.selected).to.equal(tabIndex)
      attrValue = $slotDiv.getAttribute('aria-selected')
      expect(attrValue).to.equal('true')
    })

  })

})

