const EVENT_TYPES = {
  HIDE: 'sidebar-hidden',
  SHOW: 'sidebar-shown'
}

const TAG_NAME = 'mettle-sidebar'

if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends HTMLElement {

    constructor () {
      super('')
      this.attachShadow({ mode: 'open' })
        .appendChild(this._generateTemplate().content.cloneNode(true))
      this.$parentElem = document.getElementById(this.dataset.for)
      this.$sidebar = this.shadowRoot.querySelector('.sidebar')
      this._width = this.hasAttribute('data-width') ? this.getAttribute('data-width') : '10rem'
      this._mainSidebar = this.hasAttribute('main-sidebar')
      this._allowedPositions = new Set(['left', 'right'])
      this._position = 'left'
    }

    _generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = `
        <style>
          .sidebar {
            background-color: orange;
            position: absolute;
            transition: width .5s ease-in-out;
            width: 0px;
            overflow: hidden;
            overflow-x: hidden;
            overflow-y: scroll;
          }
        </style>
        <div class="sidebar" part="container">
          <slot name="content" part="content"> </slot>
        </div>
      `
      return template
    }

    connectedCallback() {
      this._positionAt()
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback()
      }
    }

    open() {
      if (!this.hasAttribute('open')) { this.setAttribute('open', '') }
    }

    close() {
      if (this.hasAttribute('open')) { this.removeAttribute('open') }
    }

    toggleNav() {
      if (this.hasAttribute('open')) {
        this.close()
      } else {
        this.open()
      }
    }

    get isOpened() {
      return this.hasAttribute('open')
    }

    get EVENT_TYPES() {
      return EVENT_TYPES
    }

    _show() {
      this._positionAt()
      this.$sidebar.style.width = this._width
      this.dispatchEvent(new CustomEvent(EVENT_TYPES.SHOW))
      this.setAttribute('open', '')
    }

    _hide() {
      this._positionAt()
      this.$sidebar.style.width = '0px'
      this.dispatchEvent(new CustomEvent(EVENT_TYPES.HIDE))
      this.removeAttribute('open')
    }

    _positionAt() {
      // get position from attribute for sidebar, if none detected, default to left
      const attrPosition = this.getAttribute('data-position')
      this._position = this._allowedPositions.has(attrPosition) ? attrPosition : 'left'

      if (!this._mainSidebar) {
        const parentCoords = this.$parentElem.getBoundingClientRect()
        this.$sidebar.style.top = `${parentCoords.top + window.scrollY}px`
        this.$sidebar.style.height = `${parentCoords.height}px`
        if (this._position === 'left') {
          this.$sidebar.style.left = `${parentCoords.left + window.scrollX}px`
        } else {
          this.$sidebar.style.right = `${window.innerWidth - (parentCoords.right + window.scrollX)}px`
        }
      } else {
        this.$sidebar.style.position = 'fixed'
        this.$sidebar.style.top = '0px'
        this.$sidebar.style.height = '100%'
        this.$sidebar.style.zIndex = '100'
        if (this._position === 'left') {
          this.$sidebar.style.left = '0px'
        } else {
          this.$sidebar.style.right = '0px'
        }
      }
    }

    static get observedAttributes() {
      return ['open']
    }

    attributeChangedCallback(attr, oldValue, newValue) {
      if (oldValue !== newValue) {
        if (this.isOpened) {
          this._show()
        } else {
          this._hide()
        }
      }
    }
  })
}