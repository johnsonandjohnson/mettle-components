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
      this.width = this.hasAttribute('nav-width') ? this.getAttribute('nav-width') : '10rem'
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

    //make it so menu can have a set width DONE
      //transition needs to take this in account when doing translate DONE
      //don't have width hard coded in DONE
    //option to choose if menu blocks scrolling 
    //make it so it doesn't necessarily take an image for the nav icon and have the inside icon have the option of 
      //being a close button instead of the nav icon again


    connectedCallback() {
      this._positionAt()
      this._hide()
      //closeMenu
      this.shadowRoot.querySelector('.navbar-open').addEventListener('click', () => {
        this._toggleNav()
        //this.$navbarNav.style.transform = 'translate(0rem)' //make class that adds and removes
        //this.$navbar.setAttribute('hidden', 'hidden')
      })
      //openMenu
      this.shadowRoot.querySelector('.navbar-nav-close').addEventListener('click', () => {
        this._toggleNav()
        //this.$navbarNav.style.transform = `translate(-${this.width})`
        //this.$navbar.removeAttribute('hidden')
      })
    }

    _toggleNav() {
      if (this.isShowing) {
        this._hide()
      } else {
        this._show()
      }
    }

    _show() {
      this.$navbarNav.style.transform = 'translate(0rem)'
      //this.$navbar.removeAttribute('hidden')


      
      this.isShowing = true
    }

    _hide() {
      if (this.position === 'left') {
        this.$navbarNav.style.transform = `translate(-${this.width})`
      } else {
        this.$navbarNav.style.transform = `translate(${this.width})`
      }

      //this.$navbar.setAttribute('hidden', 'hidden')
      this.isShowing = false
    }

    _positionAt() {
      const attrPosition = this.getAttribute('data-position')
      this.position = this._allowedPositions.has(attrPosition) ? attrPosition : 'left'

      if (this.position === 'left') {
        this.$navbarNav.style.left = '0'
      } else {
        this.$navbarNav.style.right = '0'
      }

    }

    static get observedAttributes() {
      return ['navbar-position']
    }

  })
}