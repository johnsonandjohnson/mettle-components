const TAG_NAME = 'mettle-skeleton'
const SHAPES = {
  CIRCLE: 'circle',
  RECT: 'rect'
}
const COLOR_ATTR = 'data-color'
if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends window.HTMLElement {

    constructor() {
      super()
      const shadowRoot = this.attachShadow({ mode: 'open' })
      shadowRoot.appendChild(this.generateTemplate().content.cloneNode(true))
      this.$container = this.shadowRoot.querySelector('.container')
    }

    generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = `
      <style>
        :host {
          overflow: hidden;
        }
        .container {
          background-repeat: no-repeat;
        }
        .shimmer::before {
          content: '';
          position: absolute;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.8),
            transparent
          );
          width: 50%;
          height: 100%;
          top: 0;
          left: 0;
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
          0% {
            transform: skewX(-10deg) translateX(-100%);
          }
          100% {
            transform: skewX(-10deg) translateX(200%);
          }
        }
      </style>
      <div class="container" part="container">
        <slot></slot>
      </div>
    `.trim()
      return template
    }

    connectedCallback() {
      this.$containerStyle = this.findCSSSelectorText(this.shadowRoot, '.container')
      this._toggleShimmer()
      this._render()
    }

    _render() {
      const skeletonBG = {
        image: [],
        position: [],
        size: []
      }
      let maxHeight = 0, maxWidth = 0
      const allowedShapes = Object.values(SHAPES)
      const color = this.getAttribute(COLOR_ATTR) || 'lightgray'
      const slots = this.shadowRoot.querySelector('slot').assignedNodes({ flatten: true })
        .filter(el => el.nodeType === Node.ELEMENT_NODE && el.hasAttribute('coords') && allowedShapes.includes(el.getAttribute('shape')))
      slots.forEach(el => {
        const coords = el.getAttribute('coords')
        const shape = el.getAttribute('shape')
        const elColor = el.getAttribute(COLOR_ATTR) || color
        let height = 0, radius = 0, width = 0, x = 0, y = 0
        if (shape === SHAPES.CIRCLE) {
          [x, y, radius] = coords.split(',').map(c => c.trim())
          width = height = radius * 2
          skeletonBG.image.push(`radial-gradient( circle ${radius}px, ${elColor} 99%, transparent 0 )`)
        } else if (shape === SHAPES.RECT) {
          [x, y, width, height] = coords.split(',').map(c => c.trim())
          skeletonBG.image.push(`linear-gradient( ${elColor}, ${elColor} )`)
        }
        skeletonBG.position.push(`${x}px ${y}px`)
        skeletonBG.size.push(`${width}px ${height}px`)

        maxHeight = Math.max(maxHeight, ~~y + ~~height)
        maxWidth = Math.max(maxWidth, ~~x + ~~width)
      })

      const styles = {
        height: `${maxHeight}px`,
        width: `${maxWidth}px`
      }

      Object.entries(skeletonBG).forEach(([key, value]) => {
        styles[`background-${key}`] = value.join(',')
      })

      Object.assign(this.$containerStyle.style, styles)

    }

    findCSSSelectorText(element, selector) {
      let result
      const sheets = [...element.styleSheets]
      const len = sheets.length
      for (let i = 0; i < len; i++) {
        result = [...sheets[i].cssRules].find(rule => rule.selectorText === selector)
        if (result) {
          break
        }
      }
      return result
    }

    static get observedAttributes() {
      return ['data-shimmer']
    }

    attributeChangedCallback(attr, oldValue, newValue) {
      if (oldValue !== newValue && 'data-shimmer' === attr) {
        this._toggleShimmer()
      }
    }

    _toggleShimmer() {
      if(this.$container) {
        this.$container.classList.toggle('shimmer', this.getAttribute('data-shimmer') === 'true')
      }
    }

  })
}
