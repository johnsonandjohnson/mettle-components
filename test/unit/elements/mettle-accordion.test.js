import { wait } from "../helper"

const ELEM_TAG_NAME = 'mettle-accordion'

describe(ELEM_TAG_NAME, () => {

  let $el
  const elemTag = ELEM_TAG_NAME

  function generateDetails() {
    return `
      <details>
        <summary>
          Show Details 1
        </summary>
        <p>The lazy  duck slowly sliced because some clock elegantly
          ran into a cheerful dog which, became a beautiful cheerful lady.
          <br />
          The lazy  duck slowly sliced because some clock elegantly
          ran into a cheerful dog which, became a beautiful cheerful lady.
          <br />
          The lazy  duck slowly sliced because some clock elegantly
          ran into a cheerful dog which, became a beautiful cheerful lady.
          <br />
          The lazy  duck slowly sliced because some clock elegantly
          ran into a cheerful dog which, became a beautiful cheerful lady.
          <br />
          The lazy  duck slowly sliced because some clock elegantly
          ran into a cheerful dog which, became a beautiful cheerful lady.
        </p>
      </details>`.trim()
  }

  beforeEach(() => {
    $el = globalThis.document.createElement(elemTag)
    $el.insertAdjacentHTML('afterbegin', generateDetails())
    globalThis.document.body.appendChild($el)
  })

  afterEach(() => {
    $el.remove()
    $el = null
  })

  describe('interface', () => {

    it('should be defined', async () => {
      expect($el).toBeDefined()
      expect(globalThis.customElements.get(elemTag)).toBeDefined()
    })

    it('should be an Element node ', async () => {
      expect($el.nodeType).toEqual(Node.ELEMENT_NODE)
    })

  })

  describe('component', () => {

    it('should be able to open all', () => {
      $el.openAll()
      const isOpen = $el.details[0].hasAttribute('open')
      expect(isOpen).toBeTrue()
    })

    it('should able to close all', () => {
      $el.collapseAll()
      const isOpen = $el.details[0].hasAttribute('open')
      expect(isOpen).toBeFalse()
    })

    it('should able to adjust when adding more slots', async () => {
      $el.insertAdjacentHTML('afterbegin', generateDetails())
      expect($el.details.length).toEqual(1)
    })

    it('should able to adjust when a detail is mutated', async () => {
      await wait(10)
      const beforeHeight = $el.details[0].style.getPropertyValue('--open')
      $el.details[0].querySelector('p').innerHTML = 'adjusted'
      await wait(50)
      const afterHeight = $el.details[0].style.getPropertyValue('--open')
      expect(beforeHeight).not.toEqual(afterHeight)
    })

  })

})

