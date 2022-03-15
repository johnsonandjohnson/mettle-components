const TAG_NAME = 'navbar-adam'

if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends HTMLElement {

    constructor () {
      super('')
      this.attachShadow({ mode: 'open' })
        .appendChild(this._generateTemplate().content.cloneNode(true))
      this._allowedPositions = new Set(['left', 'right'])
      this.$navbarNav = this.shadowRoot.querySelector('.navbar-nav')
      this.$navbar = this.shadowRoot.querySelector('.navbar-open')
      this.isShowing = false
      this.position = 'left'
      this.width = this.hasAttribute('data-width') ? this.getAttribute('data-width') : '10rem'
      this.$navbarNav.style.width = this.width
      //see if there is a specified icon or if default one should be used
      this.shadowRoot.querySelector('.navbar-icon').src = this.hasAttribute('icon') ? this.getAttribute('icon') : 'https://freesvg.org/img/menu-icon.png'
      this.shadowRoot.querySelector('.navbar-icon-inside').src = this.hasAttribute('close-icon') ? this.getAttribute('close-icon') : 'https://freesvg.org/img/menu-icon.png'
    }

    _generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = `
        <style>
        .navbar-icon,
        .navbar-icon-inside {
          width: 2rem;
        }
        .navbar-nav {
          position: fixed;
          top: 0;
          height: 100%;
          background-color: lightgray;
          overflow-x: hidden;
          transition: transform 150ms ease-in-out 25ms;
        }
        .navbar-open {
          cursor: pointer;
          overflow-x: hidden;
        }
        .navbar-nav-close {
          cursor: pointer;
          padding-left: .5rem;
          padding-top: .5rem;
        }
        .nav-open {
          overflow: hidden;
          height: 100%;
        }
        </style>
        <div class="navbar-container">
          <div class="navbar-open">
            <img class="navbar-icon">
          </div>
          <nav class="navbar-nav" part="nav">
            <div class="navbar-nav-close">
              <img class="navbar-icon-inside">
            </div>
            <slot name="navbar-content"> </slot>
          </nav>
        </div>
      `
      return template
    }

    connectedCallback() {
      //determine navbar positioning
      this._positionAt()
      //hide navbar at start
      this._hide()
      //closeMenu
      this.shadowRoot.querySelector('.navbar-open').addEventListener('click', () => {
        this._toggleNav()
      })
      //openMenu
      this.shadowRoot.querySelector('.navbar-nav-close').addEventListener('click', () => {
        this._toggleNav()
      })
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback()
      }
    }

    _toggleNav() {
      if (this.isShowing) {
        this._hide()
      } else {
        this._show()
      }
    }

    _show() {
      //translate the navbar to be visible on page
      this.$navbarNav.style.transform = 'translate(0rem)'
      //add style properties from document.body that prevent scrolling when navbar is open
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100%'
      this.isShowing = true
    }

    _hide() {
      //determine which way the navbar should hide depending on navbar positioning
      this.$navbarNav.style.transform = (this.position === 'left') ? `translate(-${this.width})` : `translate(${this.width})`
      //remove style properties from document.body that prevent scrolling when navbar is open
      document.body.style.removeProperty('overflow')
      document.body.style.removeProperty('height')
      this.isShowing = false
    }

    _positionAt() {
      //get position from attribute for navbar, if none detected, default to left
      const attrPosition = this.getAttribute('data-position')
      this.position = this._allowedPositions.has(attrPosition) ? attrPosition : 'left'
      if (this.position === 'left') {
        this.$navbarNav.style.left = '0'
      } else {
        this.$navbarNav.style.right = '0'
      }
    }

    static get observedAttributes() {
      return ['data-position', 'icon', 'close-icon', 'data-width']
    }

  })
}