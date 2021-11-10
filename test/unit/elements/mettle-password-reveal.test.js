const ELEM_TAG_NAME = 'mettle-password-reveal'

describe(ELEM_TAG_NAME, () => {

  let $el
  let textBox
  const elemTag = ELEM_TAG_NAME
  const expect = chai.expect

  beforeEach(() => {
    $el = document.createElement(elemTag)
    document.body.appendChild($el)
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
    beforeEach(() => {
      textBox = document.createElement('input')
      textBox.type = 'password'
      textBox.id = 'testTextField'
      document.body.appendChild(textBox)
    })

    afterEach(() => {
      document.body.removeChild(textBox)
      textBox = null
    })

    it('should reveal text when it is checked ', async () => {
      $el.setAttribute('data-for', 'testTextField')
      $el.$checkbox.checked = false
      $el.$checkbox.click()
      expect(textBox.type).to.deep.equal('text')
    })

    it('should hide text when it is unchecked ', async () => {
      $el.setAttribute('data-for', 'testTextField')
      $el.$checkbox.checked = true
      $el.$checkbox.click()
      expect(textBox.type).to.deep.equal('password')
    })
  })
})
