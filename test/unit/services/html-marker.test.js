import { HtmlMarker } from 'services'

describe('HtmlMarker', () => {

  let htmlMarker
  let dataModel
  let $renderedDiv

  beforeEach(() => {
    dataModel = {
      arrTemplate: (items, i) => `<li>\${items${i}.val}</li>`,
      id: new Date().getTime(),
      disabled: 'disabled',
      color: 'red',
      items: [
        {val:'<em>1</em>'},
        {val:'2&k'},
        {val:'3'},
        {val:'4'},
        {val:'5'}
      ],
      test: '<strong>this is a test</strong>',
      vehicles: ['Motorcycle', 'Bus', 'Car'],
      vehiclesTemplate: (vehicles, i) => `<li>\${vehicles${i}}</li>`,
    }
    htmlMarker = new HtmlMarker()
    $renderedDiv = globalThis.document.createElement('div')
    globalThis.document.body.appendChild($renderedDiv)
  })

  afterEach(() => {
    htmlMarker = null
    $renderedDiv.remove()
    $renderedDiv = null
  })

  describe('functions', () => {

    it('should render a marked HTML into a DOM target', async () => {
      const htmlString = '<p id="${id}">This is the value for test: ${test}</p>'
      await htmlMarker.render($renderedDiv, htmlString, dataModel)
      expect($renderedDiv.innerHTML).not.toEqual('')
    })

    it('should render a Boolean Attribute into a DOM target', async () => {
      const htmlString = '<button disabled="${disabled}">Button</button>'
      await htmlMarker.render($renderedDiv, htmlString, dataModel)
      const $button = $renderedDiv.querySelector('button')
      expect($button.hasAttribute('disabled')).toBeTrue()
      dataModel.disabled = ''
      htmlMarker.updateModel(dataModel)
      expect($button.hasAttribute('disabled')).toBeFalse()
    })

    it('should render a class marked attribute into a DOM target', async () => {
      const htmlString = '<p class="bold ${color}">This is the value for test</p>'
      await htmlMarker.render($renderedDiv, htmlString, dataModel)
      const $p = $renderedDiv.querySelector('p')
      expect($p.classList.contains(dataModel.color)).toBeTrue()
      htmlMarker.updateModel({color: 'green'})
      expect($p.classList.contains(dataModel.color)).toBeFalse()
    })

    it('should render an array marked template into a DOM target', async () => {
      const htmlString = '<ul>${$_arrayMarker("items", "arrTemplate")}</ul>'
      await htmlMarker.render($renderedDiv, htmlString, dataModel)
      const $liArr = [...$renderedDiv.querySelectorAll('li')]
      expect($liArr.length).toEqual(5)
    })

    it('should render a custom decorator into a DOM target', async () => {
      htmlMarker.addDecorator('ListFormat', (input) => {
        return input.join(',')
      })
      const htmlString = '<p>The List of vehicles are: ${ListFormat(vehicles)}</p>'
      await htmlMarker.render($renderedDiv, htmlString, dataModel)
      expect($renderedDiv.innerHTML.toString()).toContain(dataModel.vehicles.join(','))
    })

    it('should render update an array marked template from a DOM target', async () => {
      const htmlString = '<ul>${$_arrayMarker("vehicles", "vehiclesTemplate")}</ul>'
      await htmlMarker.render($renderedDiv, htmlString, dataModel)
      dataModel.vehicles.sort()
      htmlMarker.updateModel(dataModel)
      const firstLIItem = [...$renderedDiv.querySelectorAll('li')].shift()
      expect(firstLIItem.innerText).toEqual('Bus')
    })

    it('should render textarea template into a DOM target', async () => {
      const htmlString = '<textarea>${test}</textarea>'
      await htmlMarker.render($renderedDiv, htmlString, dataModel)
      const $textarea = $renderedDiv.querySelector('textarea')
      expect($textarea.value.toString()).not.toEqual('')
    })

    it('should render the $_allowHTML decorator into a DOM target', async () => {
      const htmlString = '<p>${$_allowHTML(test)}</p>'
      await htmlMarker.render($renderedDiv, htmlString, dataModel)
      const $p = $renderedDiv.querySelector('p')
      expect($p.innerHTML.toString()).toContain('<strong>')
    })

    it('should render the $_removeHTML decorator into a DOM target', async () => {
      const htmlString = '<p>${$_removeHTML(test)}</p>'
      await htmlMarker.render($renderedDiv, htmlString, dataModel)
      const $p = $renderedDiv.querySelector('p')
      expect($p.innerHTML.toString().includes('<strong>')).toBeFalse()
    })

    it('should be able to remove node references', async () => {
      const htmlString = '<p>${$_removeHTML(test)}</p>'
      await htmlMarker.render($renderedDiv, htmlString, dataModel)
      expect(htmlMarker.referenceNodes.size).toBeTruthy()
      htmlMarker.deleteReferences()
      expect(htmlMarker.referenceNodes.size).toEqual(0)
    })

  })
})
