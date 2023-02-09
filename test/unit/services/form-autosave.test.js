import { FormAutoSave } from 'services'

describe('FormAutoSave', () => {

  const CUSTOM_KEY = 'unitTest'
  let $form
  let FormAutoSaveClass

  beforeAll(() => {
    $form = globalThis.document.createElement('form')
    $form.insertAdjacentHTML('afterbegin', '<input type="text" name="seat" />')
    globalThis.document.body.appendChild($form)
    $form.addEventListener('submit', evt => evt.preventDefault())
  })

  afterAll(() => {
    $form.remove()
    $form = null
    FormAutoSaveClass = null
  })

  describe('functions', () => {

    it('should save any form data into session storage', () => {
      FormAutoSaveClass = new FormAutoSave($form)
      $form.elements['seat'].value = 'test'
      $form.elements['seat'].dispatchEvent(new Event('input', {bubbles: true}))

      const values = JSON.parse(globalThis.localStorage.getItem(FormAutoSaveClass.SESSION_KEY) ?? null)
      expect(values).toBeTruthy()
      expect(values.seat).toEqual('test')
    })

    it('should populate the form elements from session storage', () => {
      globalThis.localStorage.setItem(CUSTOM_KEY, JSON.stringify({seat: 'test'}))
      FormAutoSaveClass = new FormAutoSave($form, CUSTOM_KEY)
      expect($form.elements['seat'].value).toEqual('test')
    })

    it('should clear the session storage', () => {
      globalThis.localStorage.setItem(CUSTOM_KEY, JSON.stringify({seat: 'test'}))
      FormAutoSaveClass = new FormAutoSave($form, CUSTOM_KEY)
      FormAutoSaveClass.clearStorage()
      const values = JSON.parse(globalThis.localStorage.getItem(CUSTOM_KEY) ?? null)
      expect(values).toBeNull()
    })

  })

})
