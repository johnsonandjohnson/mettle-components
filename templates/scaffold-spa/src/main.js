import './css/index.css'

function component() {
  const element = document.createElement('div')

  element.innerHTML = `<h1>Hello Mettle</h1>`

  return element
}

document.body.appendChild(component())
