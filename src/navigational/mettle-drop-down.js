import { OnRemoveMixin } from '../mixins/index.js'

const EVENT_TYPES = {
  HIDE: 'dropdown-hidden',
  SHOW: 'dropdown-shown'
}

const ACTION_TYPES = {
  AUXCLICK: 'auxclick',
  CLICK: 'click',
  MOUSE: 'mouse'
}

const TAG_NAME = 'mettle-drop-down'
const BASE = OnRemoveMixin(HTMLElement)

if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends BASE {
    constructor() {
      super()
      this._allowedPositions = new Set(['bottom', 'left', 'right'])
      this._allowedUserActions = new Set([ACTION_TYPES.AUXCLICK, ACTION_TYPES.CLICK, ACTION_TYPES.MOUSE])
      this._onClickBind = this.toggleMenu.bind(this)
      this._onShowBind = this.show.bind(this)
      this._onHideBind = this.hide.bind(this)
      this._onWindowHideBind = this.windowHide.bind(this)
      this._preventDefaultBind = this._preventDefault.bind(this)
      this.setAttribute('hidden', 'hidden')
    }

    __attachShadowRoot() {
      if (null === this.shadowRoot) {
        this.attachShadow({ mode: 'open' })
          .appendChild(this._generateTemplate().content.cloneNode(true))
        document.body.appendChild(this)
      }
    }

    get EVENT_TYPES() {
      return EVENT_TYPES
    }

    get ACTION_TYPES() {
      return ACTION_TYPES
    }

    _generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = `
      <style>
        :host{
          position: absolute;
          z-index: 999;
        }
      </style>
      <slot></slot>
    `
      return template
    }

    connectedCallback() {
      this.__attachShadowRoot()
      if (this.shadowRoot instanceof ShadowRoot) {
        this.hide()
        this.updateMenuFor()
      }
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback()
      }
      if (this.$menuFor) {
        this.$menuFor.removeEventListener('click', this._onClickBind)
        this.$menuFor.removeEventListener('auxclick', this._onClickBind)
        this.$menuFor.removeEventListener('contextmenu', this._preventDefaultBind)
        this.$menuFor.removeEventListener('mouseover', this._onShowBind)
        this.removeEventListener('mouseout', this._onHideBind)
        window.removeEventListener('click', this._onWindowHideBind)
        window.removeEventListener('auxclick', this._onWindowHideBind)
      }
    }

    updateMenuFor() {
      if (this.isNewMenuFor()) {
        this._updateEvent()
      }
    }

    _updateEvent() {
      this.disconnectedCallback()
      const userAction = this.getAttribute('data-user-action') || ACTION_TYPES.CLICK
      if (this._allowedUserActions.has(userAction)) {
        this.$menuFor = this.$menuForNew
        if (this.$menuFor) {
          this[this.MixinDefs.onRemove](this.$menuFor, this.remove.bind(this))

          if (userAction === ACTION_TYPES.MOUSE) {
            this.$menuFor.addEventListener('mouseover', this._onShowBind, true)
            /* Should just be this, not this.$menuFor */
            this.$menuFor.addEventListener('mouseout', this._onHideBind, true)

          } else {
            window.addEventListener('click', this._onWindowHideBind, true)

            if (userAction === ACTION_TYPES.AUXCLICK) {
              window.addEventListener('auxclick', this._onWindowHideBind, true)
              this.$menuFor.addEventListener('contextmenu', this._preventDefaultBind, true)
            }
            this.$menuFor.addEventListener(userAction, this._onClickBind, true)
          }
        }

      }
    }

    isNewMenuFor() {
      this.$menuForNew = document.getElementById(this.getAttribute('data-for'))
      return this.$menuForNew && !this.$menuForNew.isEqualNode(this.$menuFor)
    }

    static get observedAttributes() {
      return ['data-distance-x', 'data-distance-y', 'data-for', 'data-position', 'data-user-action']
    }

    attributeChangedCallback(attr, oldValue, newValue) {
      if (oldValue !== newValue) {
        if (['data-for'].includes(attr)) {
          this.updateMenuFor()
        }
        if (['data-user-action'].includes(attr)) {
          this._updateEvent()
        }
        this._positionAt()
      }
    }

    _positionAt() {
      if (this.$menuFor) {
        const attrPosition = this.getAttribute('data-position')
        const position = this._allowedPositions.has(attrPosition) ? attrPosition : 'bottom'
        const parentCoords = this.$menuFor.getBoundingClientRect()
        const attrDistanceX = this.getAttribute('data-distance-x') || 0
        const attrDistanceY = this.getAttribute('data-distance-y') || 0
        const distX = parseInt(attrDistanceX, 10)
        const distY = parseInt(attrDistanceY, 10)
        let left = parseInt(parentCoords.right, 10) + distX
        let top = parseInt(parentCoords.top, 10) + distY

        if (position === 'left') {
          left = parseInt(parentCoords.left, 10) - distX - this.offsetWidth
        }

        if (position === 'bottom') {
          left = parseInt(parentCoords.left, 10) - distX
          top = parseInt(parentCoords.bottom, 10) + distY
        }

        left += window.scrollX
        top += window.scrollY

        const maxLeft = window.innerWidth - this.offsetWidth
        left = Math.min(left, maxLeft)
        left = Math.max(0, left)

        const pos = {
          left: `${left}px`,
          top: `${top}px`
        }
        Object.assign(this.style, pos)
      }

      if (this.isShowing()) {
        requestAnimationFrame(this._positionAt.bind(this))
      }
    }

    _preventDefault(evt) {
      if (evt instanceof Event) {
        evt.stopPropagation()
        evt.preventDefault()
      }
    }

    toggleMenu(evt) {
      if (this.isShowing()) {
        this.hide(evt)
      } else {
        this.show(evt)
      }
    }

    show(evt) {
      this._preventDefault(evt)
      this.closeChildren()
      this.removeAttribute('hidden')
      requestAnimationFrame(() => {
        this.setAttribute('data-open', '')
        this.dispatchEvent(new CustomEvent(EVENT_TYPES.SHOW))
      })
      this._positionAt()
    }

    hide(evt) {
      const target = evt instanceof Event && evt.target || undefined
      if (!target || !this.isNode(this, target)) {
        this.setAttribute('hidden', 'hidden')
        Object.assign(this.style, { left: '-1000px', top: '-1000px' })
        this.removeAttribute('data-open')
        this.dispatchEvent(new CustomEvent(EVENT_TYPES.HIDE))
      }
    }

    windowHide(evt) {
      const target = evt instanceof Event && evt.target || undefined
      if (!target || !this.isNode(this.$menuFor, target)) {
        this.hide(evt)
      }
    }

    isNode(node, target) {
      return node.isEqualNode(target) || node.isSameNode(target) || node.contains(target)
    }

    closeChildren() {
      const thisParent = this.getAttribute('data-parent')
      const parentGroup = [...document.querySelectorAll(`${TAG_NAME}[data-parent="${thisParent}"]`)]

      parentGroup.forEach(elem => {
        const childId = elem.getAttribute('data-for')
        const childGroups = [...document.querySelectorAll(`${TAG_NAME}[data-parent="${childId}"]`)]
        childGroups.forEach(childElem => childElem.closeChildren())
        elem.hide()
      })
    }

    isShowing() {
      return !this.hasAttribute('hidden')
    }

  })

}
