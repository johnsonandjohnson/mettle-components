const TAG_NAME = 'mettle-navbar'

const EVENT_TYPES = {
  HIDE: 'navbar-hidden',
  SHOW: 'navbar-shown'
}

const ACTION_TYPES = {
  AUXCLICK: 'auxclick',
  CLICK: 'click',
  MOUSE: 'mouse'
}

if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends HTMLElement {

    constructor () {
      super('')
      this.attachShadow({ mode: 'open' })
        .appendChild(this._generateTemplate().content.cloneNode(true))
        //see if there is a specified icon or if default one should be used
      if (!this.hasAttribute('icon')) {
        this.shadowRoot.querySelector('.navbar-icon').src = 'https://freesvg.org/img/menu-icon.png'
        this.shadowRoot.querySelector('.navbar-icon-inside').src = 'https://freesvg.org/img/menu-icon.png'
      } else {
        this.shadowRoot.querySelector('.navbar-icon').src = this.getAttribute('icon')
        this.shadowRoot.querySelector('.navbar-icon-inside').src = this.getAttribute('icon')
      }
      this.showing = false
      this.$navbarmenu = this.shadowRoot.querySelector('.navbar-menu')
    }

    _generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = `
      <style>
        .navbar-icon {
          width: 1rem;
        }
        .navbar-icon-inside {
          width: 1rem;
          position: absolute;
          left: 100px;
        }
        .navbar-menu-items {
          display: flex;
          flex-direction: column;
          width: 200px;
          height: auto;
          position: absolute;
          list-style-type: none;
        }
        .navbar-menu {
          background-color: grey;
          position: fixed;
          top: 0px;
          left: 0px;
          height: 100%;
          width: 15rem;
        }
        .navbar-expanded-menu-header {
          height: 3rem;
        }
        .navbar-expand-icon,
        .navbar-expand-inside-icon {
          cursor: pointer;
        }
      </style>
      <div class="navbar">
        <div class="navbar-expand-icon">
          <img class="navbar-icon"/>
        </div>
        <div class="navbar-menu" hidden>
          <div class="navbar-expanded-menu-header">
            <div class="navbar-expand-inside-icon">
              <img class="navbar-icon-inside"/>
            </div>
          </div>
          <ul>
            <slot class="navbar-menu-items id="navbar-menu-items" name="navbar-items"></slot>
          </ul>
        </div>
      </div>
      `.trim()
      return template
    }

    _toggleMenu() {
      if (this.showing) {
        console.log('hidding navbar menu')
        this.$navbarmenu.setAttribute('hidden', 'hidden')
      } else {
        console.log('displaying navbar menu')
        this.$navbarmenu.removeAttribute('hidden')
      }
      this.showing = !this.showing
    }

    get EVENT_TYPES() {
      return EVENT_TYPES
    }

    get ACTION_TYPES() {
      return ACTION_TYPES
    }

    connectedCallback() {
      this.shadowRoot.querySelector('.navbar-expand-icon').addEventListener('click', () => {
        console.log('toggle navbar expand')
        this._toggleMenu()
      })
      this.shadowRoot.querySelector('.navbar-expand-inside-icon').addEventListener('click', () => {
        console.log('toggle navbar expand')
        this._toggleMenu()
      })
    }

  })
}