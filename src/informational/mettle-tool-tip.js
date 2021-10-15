import { MixinDefs, OnRemoveMixin } from '../mixins/index.js'
const TAG_NAME = 'mettle-tool-tip'
const HALF = 2

const BASE = OnRemoveMixin(HTMLElement)
if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends BASE {
    constructor() {
      super()
      this._onMouseoverBind = this.show.bind(this)
      this._onMouseoutBind = this.hide.bind(this)
    }

    __attachShadowRoot() {
      if (null === this.shadowRoot) {
        this.attachShadow({ mode: 'open' })
          .appendChild(this._generateTemplate().content.cloneNode(true))
        document.body.appendChild(this)
      }
    }

    _generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = `
      <style>
        .arrow {
          background-color: #212121;
          height: 15px;
          position: absolute;
          transform: rotateZ(45deg);
          width: 15px;
        }
        .tip {
          background-color: #212121;
          border-radius: 6px;
          filter: drop-shadow(0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 0.5));
          color: #eee;
          display: inline;
          left: -100px;
          opacity: 0;
          padding: 0.6rem;
          position: absolute;
          top: -100px;
          transition: opacity 0.3s;
          z-index: 999999;
        }
        .tip.active {
          opacity:1;
        }
      </style>
      <div class="tip" part="tip">
        <div class="arrow" part="arrow"></div>
        <slot></slot>
      </div>
    `
      return template
    }

    connectedCallback() {
      this.__attachShadowRoot()
      if (this.shadowRoot instanceof ShadowRoot) {
        this.$tip = this.shadowRoot.querySelector('div.tip')
        this.$arrow = this.shadowRoot.querySelector('div.arrow')
        this.hide()
        this.updateTipFor()
      }
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback()
      }
      if (this.$tipFor) {
        this.$tipFor.removeEventListener('mouseover', this._onMouseoverBind)
        this.$tipFor.removeEventListener('mouseout', this._onMouseoutBind)
      }
    }

    updateTipFor() {
      if (this.shadowRoot instanceof ShadowRoot) {
        if (this.isNewTipFor()) {
          this._updateHoverFeature()
        } else if (!this.$tipFor) {
          this.remove()
        }
      }
    }

    _updateHoverFeature() {
      this.disconnectedCallback()
      this.$tipFor = this.$tipForNew
      if (this.$tipFor) {
        if (this.getAttribute('data-hover') !== 'false') {
          this.$tipFor.addEventListener('mouseover', this._onMouseoverBind)
          this.$tipFor.addEventListener('mouseout', this._onMouseoutBind)
        }
        this[MixinDefs.onRemove](this.$tipFor, this.remove.bind(this))
      }
    }

    isNewTipFor() {
      this.$tipForNew = document.getElementById(this.dataset.for)
      return this.$tipForNew && !this.$tipForNew.isEqualNode(this.$tipFor)
    }

    static get observedAttributes() {
      return ['data-position', 'data-for', 'data-hover']
    }

    attributeChangedCallback(attr, oldValue, newValue) {
      if (oldValue !== newValue) {
        if (['data-for'].includes(attr)) {
          this.updateTipFor()
        }
        if (['data-hover'].includes(attr)) {
          this._updateHoverFeature()
        }
        this._positionAt()
      }
    }

    _positionAt() {
      if (this.$tipFor && this.$tip) {
        const position = this.dataset.position || 'right'
        const parentCoords = this.$tipFor.getBoundingClientRect()
        const tooltip = this.$tip
        const dist = 15
        let left = parseInt(parentCoords.right, 10) + dist
        let top = (parseInt(parentCoords.top, 10) + parseInt(parentCoords.bottom, 10)) / HALF - tooltip.offsetHeight / HALF

        if (position === 'left') {
          left = parseInt(parentCoords.left, 10) - dist - tooltip.offsetWidth
        }

        if (position === 'bottom') {
          left = (parseInt(parentCoords.left, 10) + parseInt(parentCoords.right, 10)) / HALF - tooltip.offsetWidth / HALF
          top = parseInt(parentCoords.bottom, 10) + dist
        }

        if (position === 'top') {
          left = (parseInt(parentCoords.left, 10) + parseInt(parentCoords.right, 10)) / HALF - tooltip.offsetWidth / HALF
          top = parseInt(parentCoords.top, 10) - dist - tooltip.offsetHeight
        }

        left += window.scrollX
        top += window.scrollY

        tooltip.style.left = `${left}px`
        tooltip.style.top = `${top}px`
        this._positionArrow(
          position,
          parentCoords.top,
          parentCoords.right,
          parentCoords.bottom,
          parentCoords.left
        )
      }
    }

    _positionArrow(position) {
      /**
       * use the getBoundingClientRect() function to get the rendered
       * borders of the transformed $arrow div, and use those to center its point
       * on the specified toggle element
       */
      let arrowCoords
      const thisRect = this.$tip.getBoundingClientRect()
      switch (position) {
      case 'left': arrowCoords = this._arrowAtRight(thisRect); break
      case 'right': arrowCoords = this._arrowAtLeft(thisRect); break
      case 'top': arrowCoords = this._arrowAtBottom(thisRect); break
      case 'bottom': arrowCoords = this._arrowAtTop(thisRect); break
      default: arrowCoords = this._arrowAtRight(thisRect)
      }
      const { arrowTop, arrowLeft } = arrowCoords
      this.$arrow.style.left = `${arrowLeft}px`
      this.$arrow.style.top = `${arrowTop}px`
    }

    _arrowAtLeft(targetCoords) {
      const { top, bottom } = targetCoords
      const arrowTop = ((bottom - top) / HALF) - this.$arrow.clientWidth / HALF
      const arrowLeft = - (this.$arrow.clientWidth / HALF)
      return { arrowLeft, arrowTop }
    }

    _arrowAtRight(targetCoords) {
      const { top, bottom, right, left } = targetCoords
      const arrowTop = ((bottom - top) / HALF) - this.$arrow.clientHeight / HALF
      const arrowLeft = right - left - (this.$arrow.clientWidth / HALF)
      return { arrowLeft, arrowTop }
    }

    _arrowAtTop(targetCoords) {
      const { left, right } = targetCoords
      const arrowTop = - this.$arrow.clientWidth / HALF
      const arrowLeft = (right - left) / HALF - (this.$arrow.clientWidth / HALF)
      return { arrowLeft, arrowTop }
    }

    _arrowAtBottom(targetCoords) {
      const { top, bottom, left, right } = targetCoords
      const arrowTop = bottom - top - (this.$arrow.clientWidth / HALF)
      const arrowLeft = (right - left) / HALF - (this.$arrow.clientWidth / HALF)
      return { arrowLeft, arrowTop }
    }

    show() {
      this._positionAt()
      this.$tip.classList.add('active')
    }

    hide() {
      this.$tip.classList.remove('active')
      this.$tip.style.left = '-1000px'
      this.$tip.style.top = '-1000px'
    }

    isShowing() {
      return this.$tip.classList.contains('active')
    }

  })
}
