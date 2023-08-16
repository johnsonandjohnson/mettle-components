import Util from './util.js'

const REGEX_LITERAL = /(\${.+(?=[${.+?}]+)?})/gi
/* Alt: /(\${.+?})/gi  */
const STRING_LITERAL_FINDS = /\$\{(([\w_().$])+)\}/gi
const PARAM_FROM_FUNCTION = /\$*\w+\s*\((.*)\)/gi
const QUOTES = /["']/g
const BOOLEAN_ATTRIBUTES = new Set([
  'allowfullscreen',
  'allowpaymentrequest',
  'async',
  'autofocus',
  'autoplay',
  'checked',
  'controls',
  'default',
  'defer',
  'disabled',
  'formnovalidate',
  'hidden',
  'ismap',
  'itemscope',
  'loop',
  'multiple',
  'muted',
  'nomodule',
  'novalidate',
  'open',
  'playsinline',
  'readonly',
  'required',
  'reversed',
  'selected',
  'truespeed',
  'typemustmatch'
])

const DEFAULT_DECORATORS = ['$_arrayMarker', '$_removeHTML', '$_allowHTML']

export default class HtmlMarker {
  constructor() {
    this.referenceNodes = new Set()
    this.uuid = Util.uuid() + '@'
    this.model = Object.create(null)
    this._decorators = new Map([
      ['$_arrayMarker', () => ''],
      ['$_removeHTML', Util.removeHTML.bind(this)],
      ['$_allowHTML', Util.allowHTML.bind(this)]
    ])
  }

  get decorators() {
    return this._decorators
  }

  get BOOLEAN_ATTRIBUTES() {
    return BOOLEAN_ATTRIBUTES
  }

  addBooleanAttribute(boolAttr) {
    this.BOOLEAN_ATTRIBUTES.add(boolAttr)
  }

  addDecorator(name, func) {
    if (!DEFAULT_DECORATORS.includes(name)) {
      this._decorators.set(name, func)
    }
    return this
  }

  updateModel(obj = Object.create(null)) {
    obj = Util.mapRecursive(obj, Util.safeInnerHTML.bind(this))
    Object.assign(this.model, obj)
    return this.update()
  }

  _templateStringDataModel(templateString) {
    const matches = new Set(Array.from(templateString.matchAll(STRING_LITERAL_FINDS), m => m[1]).map(model => {
      /* this makes no sense what so ever,
         why do I need to run the match before the match all
         regex.test works but breaks
      */
      if (model.match(PARAM_FROM_FUNCTION)) {
        model = Array.from(model.matchAll(PARAM_FROM_FUNCTION), m => m[1]).shift()
      }
      return model.includes('.') ? model.substring(0, model.indexOf('.')) : model
    })
      .filter(val => val && val.length))
    const defaultModel = [...matches].reduce((acc, curr) => (acc[curr] = '', acc), Object.create(null))
    /* We need all the values that are needed to render the first pass */
    this.updateModel(defaultModel)
  }

  async render(target, templateString, initialModel = Object.create(null)) {
    /* remove comments that are found in the string since we use them as markers */
    templateString = templateString.replace(/<!--[\s\S]*?-->/gm, '')

    this._templateStringDataModel(templateString)
    this.updateModel(initialModel)
    console.log(this.model, templateString)
    const html = this._interpolate({ params: this.model, template: templateString, useMarkers: true })

    console.log(html)

    const rootElement = this._fragmentFromString(templateString)

    let frag = this._markerTree(rootElement)
    frag = await this._referenceTree(frag)

    /* allow for shadowRoot */
    if (target) {
      target.appendChild(frag)
      await this.update()
      //console.log(target.innerHTML)
    }
    return Promise.resolve(true)
  }

  _fragmentFromString(strHTML) {
    const template = document.createElement('template')
    template.innerHTML = strHTML
    return template.content.cloneNode(true)
  }

  _markChildNodes(childNodes) {
    let expressions = []
    Array.from(childNodes).forEach(node => {
      if (node.hasChildNodes()) {
        //console.log('child child', node.childNodes)
        expressions = expressions.concat(this._markChildNodes(node.childNodes))
      }
      expressions = expressions.concat(this._markNode(node))
    })
    return expressions
  }

  _markNode(node) {
    let expressions = []
    if (node.nodeValue && node.nodeValue.trim().length) {
      const matches = node.nodeValue.trim().match(REGEX_LITERAL)
      if (matches) {
        expressions = expressions.concat(matches)
        const template = node.nodeValue.trim()
        //console.log('template')
        //console.log(template)
        const html = this._interpolate({ params: this.model, template, useMarkers: true })
        //console.log(html)
        const newNode = this._parseHTML(html)
        node.parentNode.replaceChild(newNode, node)
        //console.dir(expressions)
      }
    }
    return expressions
  }

  _markerTree(rootElement) {
    const walker = document.createNodeIterator(
      rootElement,
      NodeFilter.SHOW_ALL,
      null,
      false
    )
    let expressions = []
    let node = walker.nextNode()
    while (node) {

      if (node.nodeType !== Node.ELEMENT_NODE && !(window.customElements.get(node.tagName) || (node.tagName && node.tagName.includes('-')))) {

        if (node.hasChildNodes()) {
          //console.log('child', node.childNodes)
          expressions = expressions.concat(this._markChildNodes(node.childNodes))
        }
       // console.log('regular', node)
        expressions = expressions.concat(this._markNode(node))
      }
      node = walker.nextNode()
    }
    //console.log(expressions)
    const walkerComments = document.createNodeIterator(
      rootElement,
      NodeFilter.SHOW_COMMENT,
      null,
      false
    )
    let i = 0
    let nodeComments = walkerComments.nextNode()
    while (nodeComments) {
      //nodeComments.textContent = `${this.uuid}${expressions[i++]}`
     // console.log(nodeComments.textContent)
      nodeComments = walkerComments.nextNode()
    }
    //console.log(expressions)
    return rootElement
  }
  // Fix issue with async, that items truly are rendered before promise is complete
  // ensure extra text past expression is its own text node
  _interpolate({ params, template, useMarkers = false }) {
    console.log('useMarkers', useMarkers, template)
    template = template?.replace(/<!--[\s\S]*?-->/gm, '')
    const keys = Object.keys(params).concat([...this.decorators.keys()])
    const keyValues = Object.values(params).concat([...this.decorators.values()])
    const returnFn = useMarkers ? `function markers (strings, ...expressions) {
      const stringBetween = (startStr, endStr, str) => {
        const pos = str.indexOf(startStr) + startStr.length
        const end = str.indexOf(endStr, pos)
        return str.substring(pos,  end === pos ? -1: end)
      }
      const temp = \`${template.trim()}\`
      //console.log(temp2)
      const uuid = '${this.uuid}'
        return strings.reduce((accumulator, part, i) => {
            const startStr = strings.at(i-1)
            const expressionVar = \`\${stringBetween(startStr, part, temp)}\`
            //console.log(startStr, part, temp, 'expressionVar', expressionVar)
          return \`\${accumulator}<!--\${expressionVar}-->\${part}\`
        })
      } return markers\`${template}\`` : `return \`${template}\``
    return new Function(...keys, returnFn)(...keyValues)
  }

  _referenceTree(rootElement) {
    return new Promise(resolve => {
      const walker = document.createNodeIterator(
        rootElement,
        NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_ELEMENT,
        null,
        false
      )
      let node = walker.nextNode()
      while (node) {
        /* Do not filter custom elements to allow attribute updates */
        if (node.nodeType === Node.ELEMENT_NODE && node.hasAttributes()) {
          const attrs = [...node.attributes]
          attrs.forEach(attr => {
            const hasLiteral = attr.value.match(REGEX_LITERAL)
            const isBooleanAttr = this.BOOLEAN_ATTRIBUTES.has(attr.name)
            if (hasLiteral) {
              this.referenceNodes.add({
                isBooleanAttr,
                name: attr.name,
                node: isBooleanAttr ? node : attr,
                oldValue: null,
                value: attr.value
              })
              if (isBooleanAttr) {
                node.setAttribute(attr.name, '')
              }
            }
          })
        }

        if (node.nodeType === Node.COMMENT_NODE) {
          if (node.nodeValue.includes(this.uuid)) {
            //console.log('saved beforre', node.nodeValue)
            const nodeValue = node.nodeValue.replace(this.uuid, '')
            if (node.parentElement.tagName === 'TEXTAREA') {
              this.referenceNodes.add({ arrayMarker: Object.create(null), node: node.parentElement, oldValue: nodeValue, value: nodeValue })
            } else {
             // console.log('saved', nodeValue)
              this.referenceNodes.add({ arrayMarker: Object.create(null), node, oldValue: nodeValue, value: nodeValue })
            }
          }
        } else {
          this.referenceNodes.add({ node })
        }
        node = walker.nextNode()
      }

      resolve(rootElement)
    })
  }

  /* update all referenced nodes with the model values */
  update() {
    //console.log('referenceNodes')
    //console.log(this.referenceNodes)
    this.referenceNodes.forEach(({ arrayMarker, isBooleanAttr = false, name = '', node, oldValue = null, value = '' }, reference) => {
      if (node.nodeType === Node.ELEMENT_NODE && !document.body.contains(node)) {
        this.referenceNodes.delete(reference)
      } else {

        let newValue = this._interpolate({ params: this.model, template: value })
        //console.log('value', value)
        //console.log('newValue', newValue)
        if (value.includes('$_arrayMarker(')) {

          let funcParams = null
          if (value.match(PARAM_FROM_FUNCTION)) {
            funcParams = Array.from(value.matchAll(PARAM_FROM_FUNCTION), m => m[1].split(',').map(key => key.trim().replace(QUOTES, ''))).shift()
          }

          if (Array.isArray(funcParams)) {
            const [arrKey, arrTemplate] = funcParams

            if (!Array.isArray(this.model[arrKey])) {
              this.model[arrKey] = []
            }

            const newObject = this.model[arrKey].reduce((acc, cv, i) => {
              acc[`${arrKey}${i}`] = cv
              return acc
            }, this.model)

            //console.log(newObject)


            if (!arrayMarker[arrKey]) {
              arrayMarker[arrKey] = new HtmlMarker()
            }

            if (this.model[arrKey].length != Object.keys(arrayMarker[arrKey].model).length) {
              arrayMarker[arrKey].deleteReferences()
              if (this.model[arrTemplate]) {
                const display = this.model[arrKey].map(this.model[arrTemplate]).join(' ')
                arrayMarker[arrKey].render(node.parentNode, display, newObject)
              }
            } else {
              arrayMarker[arrKey].updateModel(newObject)
            }

          }

        } else if (!isBooleanAttr && newValue !== oldValue) {
          if (node.nodeType === Node.COMMENT_NODE) {
            const newNode = this._parseHTML(`${newValue}`)
            if (node.nextSibling && typeof oldValue === 'string' && oldValue.length) {
              node.parentNode.replaceChild(newNode, node.nextSibling)
            } else {
              node.after(newNode)
            }
          } else if (node.nodeType === Node.ATTRIBUTE_NODE) {
            if (node.nodeName === 'class') {
              newValue = this._handleClassValue({ node, oldValue, value })
            } else {
              node.value = newValue
            }
            /* textarea is an element node that requires an attribute update */
          } else if (node.tagName === 'TEXTAREA') {
            node.value = newValue
          }
        }
        if (isBooleanAttr) {
          node.toggleAttribute(name, !!newValue.toString().length)
        }
        reference.oldValue = newValue
      }
    })
    return Promise.resolve(true)
  }

  deleteReferences() {
    this.referenceNodes.forEach(({ node }, reference) => {
      node?.remove()
      this.referenceNodes.delete(reference)
    })
    this.model = Object.create(null)
  }

  _handleClassValue({ node, oldValue = [], value }) {
    const ownerElement = this._getNodeOwnerElement(node)
    const values = value.match(REGEX_LITERAL)
    let newValFiltered = []
    let newVal = []

    if (values) {
      /* remove starting literal values */
      ownerElement.className = ownerElement.className.replace(REGEX_LITERAL, '')
      newVal = this._interpolate({ params: this.model, template: values.join(' ') })
      newVal = newVal.split(' ').filter(className => className.length)
      if (Array.isArray(newVal)) {
        oldValue = Array.isArray(oldValue) ? oldValue : []
        /* any old class in the new value can be ignored */
        const intersection = newVal.filter(className => oldValue.includes(className))
        oldValue = oldValue.filter(className => !intersection.includes(className))
        newValFiltered = newVal.filter(className => !intersection.includes(className))
      }
    }

    if (Array.isArray(oldValue) && oldValue.length) {
      ownerElement.classList.remove(...oldValue)
    }

    if (Array.isArray(newValFiltered) && newValFiltered.length) {
      ownerElement.classList.add(...newValFiltered)
    }
    return newVal
  }

  /* Allows to find the parent which is not always as simple as node.parentNode
    mainly for the element an attribute belongs too */
  _getNodeOwnerElement(node) {
    let ownerElement = node.ownerElement
    while (ownerElement && !ownerElement.tagName) {
      ownerElement = ownerElement.ownerElement
    }
    return ownerElement
  }

  _parseHTML(html) {
    const t = document.createElement('template')
    t.innerHTML = html
    return t.content.cloneNode(true)
  }

}
