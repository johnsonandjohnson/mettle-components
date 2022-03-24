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
      // for positioning sidebar
      this._allowedPositions = new Set(['left', 'right'])
      this.position = 'left'
      this.$sideBarData = this.shadowRoot.querySelector('.sidebar-data')
      // determining and setting width for sidebar from attribute
      this.width = this.hasAttribute('data-width') ? this.getAttribute('data-width') : '10rem'
      this.$sideBarData.style.width = this.width
      this.isShowing = false
      // determining if page's scroll bar should be disabled if sidebar is open from attribute
      this.freezeScroll = this.hasAttribute('freeze-scroll') ? this.getAttribute('freeze-scroll') : false
      // see if there is a specified icon or if default one should be used
      this.shadowRoot.querySelector('.expand-icon').src = this.hasAttribute('icon') ? this.getAttribute('icon') : 'https://freesvg.org/img/menu-icon.png'
      this.shadowRoot.querySelector('.close-icon').src = this.hasAttribute('close-icon') ? this.getAttribute('close-icon') : 'https://freesvg.org/img/menu-icon.png'
    }

    _generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = `
        <style>
        .expand-icon,
        .close-icon {
          width: 2rem;
          cursor: pointer;
        }
        .sidebar-close {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 1rem;
        }
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
            <img class="expand-icon" part="open">
          </div>
          <nav class="sidebar-data" part="sidebar">
            <div class="sidebar-close">
              <img class="close-icon" part="close">
            </div>
            <slot name="sidebar-content"> </slot>
          </nav>
        </div>
      `
      return template
    }

    connectedCallback() {
      //determine sidebar positioning
      //test to see if I fixed everything
      this._positionAt()
      //hide sidebar at start
      this.hide()
      //closeMenu
      this.shadowRoot.querySelector('.sidebar-expand').addEventListener('click', () => {
        this.toggleNav()
      })
      //openMenu
      this.shadowRoot.querySelector('.sidebar-close').addEventListener('click', () => {
        this.toggleNav()
      })
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback()
      }
    }

    toggleNav() {
      if (this.isShowing) {
        this.hide()
      } else {
        this.show()
      }
    }

    isOpened() {
      return this.isShowing
    }

    get EVENT_TYPES() {
      return EVENT_TYPES
    }

    show() {
      //translate the sidebar to be visible on page
      this.$sideBarData.style.transform = 'translate(0rem)'
      //add style properties from document.body that prevent scrolling when sidebar is open
      if (this.freezeScroll === 'true') {
        document.body.style.overflow = 'hidden'
        document.body.style.height = '100%'
      }
      this.dispatchEvent(new CustomEvent(EVENT_TYPES.SHOW))
      this.isShowing = true
    }

    hide() {
      //determine which way the sidebar should hide depending on sidebar positioning
      this.$sideBarData.style.transform = (this.position === 'left') ? `translate(-${this.width})` : `translate(${this.width})`
      //remove style properties from document.body that prevent scrolling when sidebar is open
      if (this.freezeScroll === 'true') {
        document.body.style.removeProperty('overflow')
        document.body.style.removeProperty('height')
      }
      this.dispatchEvent(new CustomEvent(EVENT_TYPES.HIDE))
      this.isShowing = false
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
      return ['data-position', 'icon', 'close-icon', 'data-width']
    }

  })
}