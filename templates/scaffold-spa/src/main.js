import './css/index.css'
import '@johnsonandjohnson/mettle-components'
import '@vanillawc/wc-datepicker'
import 'components'
import 'features'

import {
  Constants,
  Router,
} from  'services'

Router.defaultPath(Constants.ROUTES.HOME)


const $links = Array.from(document.querySelectorAll('a[rel*="/"]'))
$links.map(a => {
  a.addEventListener('click', evt => {
    evt.preventDefault()
    removeActiveClass()
    a.classList.add('active')
    Router.goto(a.getAttribute('rel'), a.getAttribute('title'))
  })
})

function removeActiveClass() {
  $links.forEach(link => {
    link.classList.remove('active')
  })
}
