import { MixinDefs, OnRemoveMixin } from '../mixins/index.js'

const EVENT_TYPES = {
  CLOSED: 'closed',
  OPENED: 'opened'
}

const DATA_TYPES = {
  FOR: 'data-for',
  OPEN: 'data-open',
  POSITION: 'data-position',
  WIDTH: 'data-width'
}

const TAG_NAME = 'mettle-sidebar'

const BASE = OnRemoveMixin(HTMLElement)
if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends BASE {

    constructor () {
      super()
    }

    __attachShadowRoot() {
      if (null === this.shadowRoot) {
        this.attachShadow({ mode: 'open' })
          .appendChild(this._generateTemplate().content.cloneNode(true))
        document.body.appendChild(this)
        this.$sidebar = this.shadowRoot.querySelector('.sidebar')
        this._allowedPositions = new Set(['left', 'right'])
        this._position = 'left'
      }
    }

    _generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = `
        <style>
          .sidebar {
            background-color: #eee;
            position: absolute;
            transition: width .5s ease-in-out;
            width: 0px;
            overflow: hidden;
            overflow-x: hidden;
            overflow-y: scroll;
          }
        </style>
        <div class="sidebar" part="container">
          <slot></slot>
        </div>
      `
      return template
    }

    connectedCallback() {
      this.__attachShadowRoot()
      this._isNewTargetFor()
      this._updateParentElem()
    }

    _positionAt() {
      if (this.shadowRoot instanceof ShadowRoot) {
        // sees if the target elem has updated and if sidebar needs to be removed if target elem no longer exists
        this._updateSidebar()
        const attrPosition = this.getAttribute(DATA_TYPES.POSITION)
        this._position = this._allowedPositions.has(attrPosition) ? attrPosition : 'left'
        this._width = this.hasAttribute(DATA_TYPES.WIDTH) ? this.getAttribute(DATA_TYPES.WIDTH) : '10rem'

        // if sidebar is not attached to body tag and it still has a target elem -> position sidebar based on target elem's position
        if (!(this.$targetElem.tagName == 'BODY') && this.$targetElem) {
          const targetCoords = this.$targetElem.getBoundingClientRect()
          this.$sidebar.style.position = 'absolute'
          this.$sidebar.style.top = `${targetCoords.top + window.scrollY}px`
          this.$sidebar.style.height = `${targetCoords.height}px`
          if (this._position === 'left') {
            this.$sidebar.style.left = `${targetCoords.left + window.scrollX}px`
            this.$sidebar.style.removeProperty('right')
          } else {
            this.$sidebar.style.right = `${window.innerWidth - (targetCoords.right + window.scrollX)}px`
            this.$sidebar.style.removeProperty('left')
          }
        } else {
          this.$sidebar.style.position = 'fixed'
          this.$sidebar.style.top = '0px'
          this.$sidebar.style.height = '100%'
          if (this._position === 'left') {
            this.$sidebar.style.left = '0px'
            this.$sidebar.style.removeProperty('right')
          } else {
            this.$sidebar.style.right = '0px'
            this.$sidebar.style.removeProperty('left')
          }
        }
      }
    }

    _updateWidth() {
      this._width = this.hasAttribute(DATA_TYPES.WIDTH) ? this.getAttribute(DATA_TYPES.WIDTH) : '10rem'
      if (this.isOpened()) {
        this.$sidebar.style.width = this._width
      }
    }

    _isNewTargetFor() {
      this.$targetElemNew = document.getElementById(this.dataset.for)
      return (this.$targetElemNew && !this.$targetElemNew.isEqualNode(this.$targetElem))
    }

    _updateSidebar() {
      if (this.shadowRoot instanceof ShadowRoot) {
        if (this._isNewTargetFor()) {
          this._updateParentElem()
        } else if (!this.$targetElem) {
          this.remove()
        }
      }
    }

    _updateParentElem() {
      this.disconnectedCallback()
      this.$targetElem = this.$targetElemNew
      if (this.$targetElem) {
        this[MixinDefs.onRemove](this.$targetElem, this.remove.bind(this))
      }
    }

    open() {
      if (!this.isOpened()) {
        this.setAttribute(DATA_TYPES.OPEN, '')
      }
    }

    close() {
      if (this.isOpened()) {
        this.removeAttribute(DATA_TYPES.OPEN)
      }
    }

    toggle() {
      if (this.isConnected) {
        if (this.isOpened()) {
          this.close()
        } else {
          this.open()
        }
      }
    }

    isOpened() {
      return this.hasAttribute(DATA_TYPES.OPEN)
    }

    get EVENT_TYPES() {
      return EVENT_TYPES
    }

    get DATA_TYPES() {
      return DATA_TYPES
    }

    _show() {
      // before showing sidebar -> determine if position of sidebar needs updating
      this._positionAt()
      this.$sidebar.style.width = this._width
      this.dispatchEvent(new CustomEvent(EVENT_TYPES.OPENED))
      this.setAttribute(DATA_TYPES.OPEN, '')
    }

    _hide() {
      // before hiding sidebar -> determine if position of sidebar needs updating
      this._positionAt()
      this.$sidebar.style.width = '0px'
      this.dispatchEvent(new CustomEvent(EVENT_TYPES.CLOSED))
      this.removeAttribute(DATA_TYPES.OPEN)
    }

    static get observedAttributes() {
      return [DATA_TYPES.OPEN, DATA_TYPES.POSITION, DATA_TYPES.FOR, DATA_TYPES.WIDTH]
    }

    attributeChangedCallback(attr, oldValue, newValue) {
      if (oldValue !== newValue) {
        if ([DATA_TYPES.OPEN].includes(attr)) {
          if (this.isOpened()) {
            this._show()
          } else {
            this._hide()
          }
        }
        if ([DATA_TYPES.FOR].includes(attr)) {
          this._updateSidebar()
          this._updateParentElem()
          this._updateSidebar()
          if (this.$targetElem) { this._positionAt() }
        }
        if ([DATA_TYPES.POSITION].includes(attr)) {
          this._positionAt()
        }
        if ([DATA_TYPES.WIDTH].includes(attr)) {
          this._updateWidth()
        }
      }
    }
  })
}