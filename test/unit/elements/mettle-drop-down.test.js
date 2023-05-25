import { generateParagraph, generateTitle, uuid, wait } from '../helper.js'
const ELEM_TAG_NAME = 'mettle-drop-down'

describe(ELEM_TAG_NAME, () => {

  let $el
  let $parent
  const parentId = `parent-${uuid()}`

  beforeEach(async () => {
    $parent = globalThis.document.createElement('div')
    $parent.id = parentId
    $parent.insertAdjacentHTML('afterbegin', generateTitle())
    globalThis.document.body.appendChild($parent)

    globalThis.document.body.insertAdjacentHTML('afterbegin', `<${ELEM_TAG_NAME} data-for="${parentId}"><p>${generateParagraph()}</p></${ELEM_TAG_NAME}>`)
    $el = globalThis.document.querySelector(`${ELEM_TAG_NAME}[data-for="${parentId}"]`)
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

    it('should be hidden by default', () => {
      expect($el.getAttribute('hidden')).toBeTruthy()
    })

    it('should be able to show and hide the drop down', () => {
      $parent.click()
      expect($el.getAttribute('hidden')).toBeNull()
      $parent.click()
      expect($el.getAttribute('hidden')).toBeTruthy()
    })

    it('should remove from the dom when linked element is removed', async () => {
      $parent.remove()
      await wait(500)
      expect($el.isConnected).toBeFalse()
      expect(document.body.contains($parent)).toBeFalse()
      expect(document.body.contains($el)).toBeFalse()
    })

    it('should allow for mouse actions', async () => {
      $el.setAttribute('data-user-action', $el.ACTION_TYPES.MOUSE)
      $el.setAttribute('data-position', 'left')

      let event = new UIEvent('mouseover')
      $parent.dispatchEvent(event)
      expect($el.getAttribute('hidden')).toBeNull()
      event = new UIEvent('mouseout')
      $parent.dispatchEvent(event)
      expect($el.getAttribute('hidden')).toBeTruthy()
    })

    it('should allow for aux click actions', async () => {
      $el.setAttribute('data-user-action', $el.ACTION_TYPES.AUXCLICK)

      const event = new UIEvent('auxclick')
      $parent.dispatchEvent(event)
      expect($el.getAttribute('hidden')).toBeNull()
      $parent.dispatchEvent(event)
      expect($el.getAttribute('hidden')).toBeTruthy()
    })


    it('should return an object of event type values', () => {
      expect($el.EVENT_TYPES).toEqual(jasmine.any(Object))
    })

    it('should return an object of action type values', () => {
      expect($el.ACTION_TYPES).toEqual(jasmine.any(Object))
    })

  })
})
