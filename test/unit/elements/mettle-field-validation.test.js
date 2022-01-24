const ELEM_TAG_NAME = 'mettle-field-validation'

describe(ELEM_TAG_NAME, () => {

  let $el, input
  const elemTag = ELEM_TAG_NAME

  beforeEach(() => {
    $el = document.createElement(elemTag)
    $el.dataset.fieldName = 'name'
    input = document.createElement('input')
    input.type = 'text'
    input.name = 'name'
    input.setAttribute('required', 'required')

    document.body.appendChild(input)
    document.body.appendChild($el)
  })

  afterEach(() => {
    document.body.removeChild($el)
    document.body.removeChild(input)
    $el = null
    input = null
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

    it('should be able to reset the error message', async () => {
      $el.resetField()
      expect($el.$div.innerText).toEqual('')
    })

    it('should display error message when field is invalid', async () => {
      input.value = ''
      $el.handleInvalidField()
      expect($el.$div.innerText).not.toEqual('')
    })

    it('should not display error message when field is valid', async () => {
      input.value = 'abc123'
      $el.handleInvalidField()
      expect($el.$div.innerText).toEqual('')
    })

  })

})
