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

      //see if there is a specified icon or if default one should be used
      if (!this.hasAttribute('icon')) {
        this.shadowRoot.querySelector('.navbar-icon').src = 'https://freesvg.org/img/menu-icon.png'
        this.shadowRoot.querySelector('.navbar-icon-inside').src = 'https://freesvg.org/img/menu-icon.png'
      } else {
        this.shadowRoot.querySelector('.navbar-icon').src = this.getAttribute('icon')
        this.shadowRoot.querySelector('.navbar-icon-inside').src = this.getAttribute('icon')
      }
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
          left: 0;
          height: 100%;
          background-color: lightgray;
          overflow-x: hidden;
          transition: transform 150ms ease-in-out 25ms;
          width: 10rem;
          transform: translate(-10rem)
        }
        ul {
          list-style-type: none;
          padding-inline-start: 0px;
        }
        li a {
          display: block;
          padding: 20px 30px;
          font-size: 25px;
          text-decoration: none;
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
        </style>
        <div class="navbar-container">
          <div class="navbar-open">
            <img class="navbar-icon">
          </div>
          <nav class="navbar-nav">
            <div class="navbar-nav-close">
              <img class="navbar-icon-inside">
            </div>
            <ul>
              <li><a href="#">Home</a></li>
              <hr></hr>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Profile</a></li>
            </ul>
          </nav>
        </div>
      `
      return template
    }

    connectedCallback() {
      this._positionAt()
      //openMenu
      this.shadowRoot.querySelector('.navbar-open').addEventListener('click', () => {
        this._toggleNav()
        this.$navbarNav.style.transform = 'translate(0rem)'
        this.$navbar.setAttribute('hidden', 'hidden')
      })
      //closeMenu
      this.shadowRoot.querySelector('.navbar-nav-close').addEventListener('click', () => {
        //this.$navbarNav.style.width = '0rem'
        this.$navbarNav.style.transform = 'translate(-10rem)'
        this.$navbar.removeAttribute('hidden')
      })
    }

    _toggleNav() {
      if (this.isShowing()) {
        this._hide()
      } else {
        this._show()
      }
    }

    _positionAt() {
      const attrPosition = this.getAttribute('data-position')
      const position = this._allowedPositions.has(attrPosition) ? attrPosition : 'left'

      this.$navbar

    }

    static get observedAttributes() {
      return ['navbar-position']
    }

  })
}