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
      this.$parentElem = document.getElementById(this.dataset.for)
      this.$sidebar = this.shadowRoot.querySelector('.sidebar')
      this.$sideBarData = this.shadowRoot.querySelector('.sidebar-data')
      // determining and setting width for sidebar from attribute
      this.width = this.hasAttribute('data-width') ? this.getAttribute('data-width') : '10rem'
      this.mainSidebar = this.hasAttribute('main-sidebar')
      //console.log(this.width)
      // figure out better approach for width and not having to set one
      //this.$sideBarData.style.width = this.width
    }

    _generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = `
        <style>
        .sidebar {
          background-color: orange;
          position: relative;
          transition: width .5s ease-in-out;
          width: 0px;
          overflow: hidden;
          overflow-x: hidden;
          overflow-y: scroll;

        }
        .sidebar-data {
          position: absolute;
        }
        </style>
        <div class="sidebar">
          <slot name="content" class="sidebar-data"> </slot>
        </div>
      `
      // <div class="sidebar-data"> This is a test</div>
      return template
    }
    //use named slots -> event for when slot changes
    connectedCallback() {
      //determine sidebar positioning
      this._positionAt()
      //hide sidebar at start TODO
      //this.$sideBarData.style.transform = (this.position === 'left') ? `translate(-${this.width})` : `translate(${this.width})`
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
      this._positionAt()
      this.$sidebar.style.width = this.width
      //translate the sidebar to be visible on page
      //this.$sideBarData.style.transform = 'translate(0rem)'
      // fire event for opening the sidebar
      this.dispatchEvent(new CustomEvent(EVENT_TYPES.SHOW))
      // add the open attribute to component
      this.setAttribute('open', '')
    }

    _hide() {
      this._positionAt()
      this.$sidebar.style.width = '0px'
      //determine which way the sidebar should hide depending on sidebar positioning
      //this.$sideBarData.style.transform = (this.position === 'left') ? `translate(-${this.width})` : `translate(${this.width})`
      // fire event for closing the sidebar
      this.dispatchEvent(new CustomEvent(EVENT_TYPES.HIDE))
      // remove the open attribute from component
      this.removeAttribute('open')
    }

    _positionAt() {
      //get position from attribute for sidebar, if none detected, default to left
      const attrPosition = this.getAttribute('data-position')
      this.position = this._allowedPositions.has(attrPosition) ? attrPosition : 'left'

      if (!this.mainSidebar) {
        const parentCoords = this.$parentElem.getBoundingClientRect()
        console.log(parentCoords)
        console.log(parentCoords.top + window.scrollY)
        //this.$sidebar.style.position = 'relative'
        //this.$sideBarData.style.position = 'absolute'
        this.$sidebar.style.top = `${parentCoords.top }px`
        this.$sidebar.style.height = `${parentCoords.height }px`
        if (this.position === 'left') {
          this.$sidebar.style.left = `${parentCoords.left}px`
        } else {
          this.$sidebar.style.right = `${parentCoords.right}px`
        }
      } else {
        this.$sidebar.style.position = 'fixed'
        this.$sidebar.style.top = '0px'
        this.$sidebar.style.height = '100%'
        this.$sidebar.style.zIndex = '100'
        if (this.position === 'left') {
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