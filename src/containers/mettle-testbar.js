import { MixinDefs, OnRemoveMixin } from '../mixins/index.js'

const EVENT_TYPES = {
  CLOSED: 'closed',
  OPENED: 'opened'
}

const TAG_NAME = 'mettle-testbar'

const BASE = OnRemoveMixin(HTMLElement)
if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends BASE {

    constructor () {
      super('')
      this.attachShadow({ mode: 'open' })
        .appendChild(this._generateTemplate().content.cloneNode(true))
      //this.$targetElem = document.getElementById(this.dataset.for)
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
          <slot></slot>
        </div>
      `
      return template
    }

    connectedCallback() {
      this._updateSidebar()
      this._positionAt()
    }

    _positionAt() {
      // sees if the target elem has updated and if sidebar needs to be removed if target elem no longer exists
      this._updateSidebar()
      const attrPosition = this.getAttribute('data-position')
      this._position = this._allowedPositions.has(attrPosition) ? attrPosition : 'left'
      this._mainSidebar = this.hasAttribute('main-sidebar')

      // if sidebar is not main navbar and it still has a target elem -> position sidebar based on target elem's position
      if (!this._mainSidebar && this.$targetElem) {//TODO: doesn't update if someone changes data-position, need to remove the left/right property accordingly?
        const targetCoords = this.$targetElem.getBoundingClientRect()
        this.$sidebar.style.top = `${targetCoords.top + window.scrollY}px`
        // mettle-tabs, css variables
        // THIS TYPE OF IDEA: this.$panelTab.style.setProperty('--tabs-width', `${FULL_LENGTH * numTabs}%`)
        this.$sidebar.style.height = `${targetCoords.height}px` //see if this can be removed to prevent hardcoded styles
        if (this._position === 'left') {
          this.$sidebar.style.left = `${targetCoords.left + window.scrollX}px`
        } else {
          this.$sidebar.style.right = `${window.innerWidth - (targetCoords.right + window.scrollX)}px`
        }
      } else {
        this.$sidebar.style.position = 'fixed'
        this.$sidebar.style.top = '0px'
        this.$sidebar.style.height = '100%' //see if this can be removed to prevent hardcoded styles
        this.$sidebar.style.zIndex = '100' //see if this can be removed to prevent hardcoded styles
        if (this._position === 'left') {
          this.$sidebar.style.left = '0px'
        } else {
          this.$sidebar.style.right = '0px'
        }
      }
    }

    _isNewTargetFor() {
      this.$targetElemNew = document.getElementById(this.dataset.for)
      return this.$targetElemNew && !this.$targetElemNew.isEqualNode(this.$targetElem)
    }

    // doesn't do anything?
    _updateSidebar() {
      this._updateParentElem()
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
      if (!this.hasAttribute('open')) { this.setAttribute('open', '') }
    }

    close() {
      if (this.hasAttribute('open')) { this.removeAttribute('open') }
    }

    toggle() {
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
      // before showing sidebar -> determine if position of sidebar needs updating
      this._positionAt()
      this.$sidebar.style.width = this._width
      this.dispatchEvent(new CustomEvent(EVENT_TYPES.OPENED))
      this.setAttribute('open', '')
    }

    _hide() {
      // before hiding sidebar -> determine if position of sidebar needs updating
      this._positionAt()
      this.$sidebar.style.width = '0px'
      this.dispatchEvent(new CustomEvent(EVENT_TYPES.CLOSED))
      this.removeAttribute('open')
    }
    //if data tag is a body tag, then you can make the top and right/left to 0
    static get observedAttributes() { //change open to data-open to prevent conflict with standard "open"
      //make id required,
      return ['open', 'data-position', 'data-for', 'data-width', 'main-sidebar']
    }

    attributeChangedCallback(attr, oldValue, newValue) {
      if (oldValue !== newValue) {
        if (['open'].includes(attr)) {
          if (this.isOpened) {
            this._show()
          } else {
            this._hide()
          }
        }
        if (['data-position'].includes(attr) || ['main-sidebar'].includes(attr)) {
          this._positionAt()
        }
        // doesn't do anything?
        if (['data-for'].includes(attr)) {
          this._updateSidebar()
        }
      }
    }
  })
}