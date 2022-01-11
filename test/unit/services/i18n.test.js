import { I18n as I18nService } from 'services'
import { mockApiResponse, wait } from 'helper'

describe('I18nService', () => {

  const TRANSLATE_KEY = 'test'
  const TRANSLATE_UNSAFE_KEY = 'testUnsafe'
  let fetchSpy

  beforeAll(() => {
    const res = mockApiResponse({ test: 'A thing', testUnsafe: '<p>A thing</p>'})
    const resFail = mockApiResponse({}, 404)
    I18nService.localeId = I18nService.DEFAULT_LOCALE
    const URL = I18nService.loadPath
    I18nService.localeId = 'ek'
    const URLFail = I18nService.loadPath

    fetchSpy = spyOn(window, 'fetch')
      .withArgs(URL).and.returnValue(Promise.resolve(res))
      .withArgs(URLFail).and.returnValue(Promise.resolve(resFail));

    I18nService.localeId = I18nService.DEFAULT_LOCALE
  })

  afterAll(() => {
    //fetchSpy.andCallThrough()
  })

  describe('translate', () => {
    it('should have a default locale of English', async () => {
      await I18nService.init()
      const locale = I18nService.localeId
      expect(locale).toEqual('en')
    })

    it('allows a caller to set the locale', async () => {
      await I18nService.init()
      let locale = I18nService.localeId = 'fr'
      locale = I18nService.localeId
      expect(locale).toEqual('fr')
      I18nService.localeId = 'en'
    })

    it('returns a translation', async () => {
      const translation = await I18nService.init()
      const message = translation('packages|create-package')
      expect(message).not.toBeNull()
    })
  })

  describe('functions', () => {

    it('should format date time based on locale', async () => {
      const epoch = 'Thu Sep 19 2019 9:45:09 GMT-0400 (Eastern Daylight Time)'
      const dateFormatString = I18nService.formatDateTime(epoch)
      expect(dateFormatString).not.toEqual('')
    })

    it('should format a number based on locale', async () => {
      const number = '123457890'
      const numberFormatted = I18nService.formatNumber(number)
      expect(numberFormatted).not.toEqual('')
    })

    it('should set the page title', async () => {
      const titleTag = document.head.querySelector('title')
      const TITLE_KEY = 'title:key'
      I18nService.setPageTitle(TITLE_KEY)
      expect(titleTag.getAttribute('data-i18n')).toEqual(TITLE_KEY)
    })

    it('should translate attributes', async () => {
      const inputEl = document.createElement('input')
      inputEl.setAttribute('data-i18n-placeholder', TRANSLATE_KEY)
      document.body.appendChild(inputEl)

      await I18nService.init()
      I18nService.translatePage()
      expect(inputEl.getAttribute('placeholder')).not.toEqual(TRANSLATE_KEY)
      inputEl.remove()
    })

    it('should translate dataset i18n attributes', async () => {
      const div = document.createElement('div')
      div.setAttribute(I18nService.DEFAULT_ATTRIBUTES.I18N, TRANSLATE_KEY)
      document.body.appendChild(div)
      await I18nService.init()
      I18nService.translatePage()
      expect(div.textContent).not.toEqual(TRANSLATE_KEY)
      div.remove()
    })

    it('should translate dataset i18n-unsafe attributes', async () => {
      const div = document.createElement('div')
      div.setAttribute(I18nService.DEFAULT_ATTRIBUTES.UNSAFE, TRANSLATE_UNSAFE_KEY)
      document.body.appendChild(div)

      I18nService.translatePage()
      await wait(100)
      expect(div.textContent).not.toEqual(TRANSLATE_UNSAFE_KEY)
      div.remove()
    })

    it('should translate dataset i18n-date attributes', async () => {
      const div = document.createElement('div')
      const epoch = 'Thu Sep 19 2019 9:45:09 GMT-0400 (Eastern Daylight Time)'
      div.setAttribute(I18nService.DEFAULT_ATTRIBUTES.DATE, epoch)
      document.body.appendChild(div)

      I18nService.translateDates()
      expect(div.textContent).not.toEqual(epoch)
      div.remove()
    })

    it('should translate dataset i18n-number attributes', async () => {
      const div = document.createElement('div')
      const US_NUMBER = '9003452'
      div.setAttribute(I18nService.DEFAULT_ATTRIBUTES.NUMBER, US_NUMBER)
      document.body.appendChild(div)

      I18nService.translateNumbers()
      expect(div.textContent).not.toEqual(US_NUMBER)
      div.remove()
    })

    it('should decorate with custom dataset i18n attributes', async () => {
      I18nService.config({
        decorators: [
          {
            attr: 'data-i18n-currency',
            config: {
              format: (number) => `<p>${new Intl.NumberFormat(I18nService.localeId, { style: 'currency', currency: 'USD' }).format(number)}</p>`,
              unsafe: false
            }
          }
        ]
      })
      const div = document.createElement('div')
      const US_NUMBER = '9003452'
      div.setAttribute('data-i18n-currency', US_NUMBER)
      document.body.appendChild(div)

      I18nService.translateDecorators()
      expect(div.textContent).not.toEqual(US_NUMBER)
      div.remove()
    })

    it('should translate with custom dataset i18n attribute maps', async () => {
      I18nService.config({
        attributeMap: [
          { attr: 'alt', selector: 'data-i18n-alt' }
        ]
      })
      const input = document.createElement('input')
      input.setAttribute('data-i18n-alt', TRANSLATE_KEY)
      document.body.appendChild(input)

      I18nService.translatePage()
      expect(input.getAttribute('alt')).not.toEqual(TRANSLATE_KEY)
      input.remove()
    })

    it('should translate document changes automatically', async () => {
      I18nService.enableDocumentObserver()
      const div = document.createElement('div')
      document.body.appendChild(div)
      div.setAttribute('data-i18n', TRANSLATE_KEY)
      await wait(500)
      expect(div.textContent).not.toEqual(TRANSLATE_KEY)
      div.remove()

      I18nService.disconnectObserver()
    })

    it('should populate the dictionary', async () => {
      const translator = await I18nService.init()
      const message = translator('test')
      expect(message).toEqual('A thing')
    })

    it('should populate the dictionary with the default locale', async () => {
      const translator = await I18nService.setLocale('ek')
      const message = translator('test')
      expect(message).toEqual('A thing')
    })

  })


})
