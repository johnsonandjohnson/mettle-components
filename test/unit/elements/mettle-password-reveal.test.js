const ELEM_TAG_NAME = 'mettle-password-reveal'

describe(ELEM_TAG_NAME, () => {

  let $el
  let textBox
  const elemTag = ELEM_TAG_NAME

  beforeEach(() => {
    $el = document.createElement(elemTag)
    document.body.appendChild($el)
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
      expect(textBox.type).toEqual('text')
    })

    it('should hide text when it is unchecked ', async () => {
      $el.setAttribute('data-for', 'testTextField')
      $el.$checkbox.checked = true
      $el.$checkbox.click()
      expect(textBox.type).toEqual('password')
    })
  })
})
