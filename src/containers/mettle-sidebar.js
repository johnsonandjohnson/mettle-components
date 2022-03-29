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
      // determines positioning of sidebar
      this._allowedPositions = new Set(['left', 'right'])
      this.position = 'left'
      this.$sideBarData = this.shadowRoot.querySelector('.sidebar-data')
      // determining and setting width for sidebar from attribute
      this.width = this.hasAttribute('data-width') ? this.getAttribute('data-width') : '10rem'
      //figure out better approach for width and not having to set one
      this.$sideBarData.style.width = this.width
    }

    _generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = `
        <style>

        .sidebar-data {
          position: fixed;
          top: 0;
          height: 100%;
          z-index: 5;
          background-color: white;
          overflow-x: hidden;
          transition: transform 150ms ease-in-out 25ms;
        }
        </style>
        <div class="sidebar-container">
          <div class="sidebar-expand">
            <slot name="expand-icon"> </slot>
          </div>
          <nav class="sidebar-data" part="sidebar">
            <div class="sidebar-close">
              <slot name="close-icon"> </slot>
            </div>
            <slot name="sidebar-content"> </slot>
          </nav>
        </div>
      `
      return template
    }
    //use named slots -> event for when slot changes
    connectedCallback() {
      //determine sidebar positioning
      this._positionAt()
      //hide sidebar at start
      this.$sideBarData.style.transform = (this.position === 'left') ? `translate(-${this.width})` : `translate(${this.width})`
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback()
      }
    }

    open() {
      if (!this.hasAttribute('open')) {
        // add the open attribute to component
        this.setAttribute('open', '')
      }
    }

    close() {
      if (this.hasAttribute('open')) {
        // remove the open attribute from component
        this.removeAttribute('open')
      }
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
      //translate the sidebar to be visible on page
      this.$sideBarData.style.transform = 'translate(0rem)'
      // fire event for opening the sidebar
      this.dispatchEvent(new CustomEvent(EVENT_TYPES.SHOW))
      // add the open attribute to component
      this.setAttribute('open', '')
    }

    _hide() {
      //determine which way the sidebar should hide depending on sidebar positioning
      this.$sideBarData.style.transform = (this.position === 'left') ? `translate(-${this.width})` : `translate(${this.width})`
      // fire event for closing the sidebar
      this.dispatchEvent(new CustomEvent(EVENT_TYPES.HIDE))
      // remove the open attribute from component
      this.removeAttribute('open')
    }

    _positionAt() {
      //get position from attribute for sidebar, if none detected, default to left
      const attrPosition = this.getAttribute('data-position')
      this.position = this._allowedPositions.has(attrPosition) ? attrPosition : 'left'
      if (this.position === 'left') {
        this.$sideBarData.style.left = '0'
      } else {
        this.$sideBarData.style.right = '0'
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