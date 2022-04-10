import './css/index.css'
import '@johnsonandjohnson/mettle-components'
import '@vanillawc/wc-datepicker'
import 'components'

function component() {
  const element = document.createElement('core-header')

  element.innerHTML = 'Hello Mettle'

  return element
}

function dateComponent() {
  const picker = document.createElement('wc-datepicker')
  const  input = document.createElement('input')
  input.setAttribute('type', 'text')
  picker.appendChild(input)

  return picker
}

document.body.appendChild(component())
document.body.appendChild(dateComponent())
