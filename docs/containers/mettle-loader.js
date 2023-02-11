/* allow for hsla code for color */
/* allow for content possible size to determine min height */
const TAG_NAME = 'mettle-loader'
if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends window.HTMLElement {

    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(this.generateTemplate().content.cloneNode(true))
      this.$content = this.shadowRoot.querySelector('div.content')
    }

    generateTemplate() {

      const template = document.createElement('template')

      template.innerHTML = `
      <style>
        :host {
          --hue-color: 56;
          --ring-size: 0.15rem;
        }
        .content {
          margin: 0;
          min-height: 40px;
          min-width: 40px;
          position: relative;
        }
        .loader {
          background-color: hsl(var(--hue-color), 8%, 93%);
          display: inline-flex;
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          visibility: hidden;
          width: 100%;
          z-index: 9999;
        }
        .ring {
          align-items: center;
          display: flex;
          height: 100%;
          justify-content: center;
          width: 100%;
        }
        .ring::after {
          animation: rotate-ring 1s linear infinite;
          border: var(--ring-size) solid hsla(var(--hue-color), 1%, 30%, 0.2);
          border-left: var(--ring-size) solid hsla(var(--hue-color), 1%, 10%, 0.7);
          border-radius: 50%;
          content: " ";
          display: block;
          height: 25px;
          width: 25px;
        }
        .animate {
          animation: flash 2s ease infinite;
        }
        .content:not(.is-loading) {
          animation: none;
        }
        .content.is-loading .loader {
          visibility: visible;
        }
        .content.is-loading > slot:not([name="loader"]) {
          visibility: hidden;
        }
        .small {
          min-height: 25vh;
          min-width: 25vw;
        }
        .medium {
          min-height: 50vh;
          min-width: 50vw;
        }
        .large {
          min-height: 100vh;
          min-width: 100vw;
        }
        @keyframes flash {
          0% {
            opacity: 1;
          }
          50% {
            opacity: .25;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes rotate-ring {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      </style>
      <div class="content animate" part="content">
        <slot></slot>
        <div class="loader" part="loader">
          <slot name="loader"><div class="ring"></div></slot>
        </div>
      </div>
    `
      return template
    }

    connectedCallback() {
      this._render()
    }

    static get observedAttributes() {
      return ['data-loading', 'data-size', 'data-inanimate']
    }

    attributeChangedCallback(attr, oldValue, newValue) {
      if (oldValue !== newValue) {
        this._render()
      }
    }

    _render() {
      this.$content.classList.toggle('is-loading', this.isLoading())
      const size = this.getAttribute('data-size')
      this.$content.classList.remove('small', 'medium', 'large')
      if(['small', 'medium', 'large'].includes(size)) {
        this.$content.classList.add(size)
      }
      this._toggleInanimate()
    }

    _toggleInanimate() {
      if(this.$content) {
        this.$content.classList.toggle('animate', this.getAttribute('data-inanimate') === 'false')
      }
    }

    isLoading() {
      return this.getAttribute('data-loading') === 'true'
    }

    loading() {
      this.dataset.loading = true
    }

    done() {
      this.dataset.loading = false
    }

  })
}
