const TAG_NAME = 'mettle-tabs'
const FULL_LENGTH = 100

const EVENT_TYPES = {
  TAB: 'tab'
}

if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends window.HTMLElement {

    _generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = `
    <style>
        :host {
          --tabs-width: 100px;
          --tabs-section-width: 100px;
        }
        .tab-navigation slot {
          display: inline-flex;
          overflow: hidden;
        }
        .tab-navigation ::slotted(*) {
          cursor: pointer;
          user-select: none;
          outline: none;
        }
        .panel-container {
          overflow-x: hidden;
        }
        .panel-tab {
          width: var(--tabs-width);
          display: flex;
          flex-flow: row nowrap;
        }
        .panel-tab ::slotted(*) {
          height: 100%;
          width: var(--tabs-section-width);
          overflow-y: auto;
        }
    </style>
    <div class="tab-navigation" part="navigation">
      <slot id="tabSlot" name="navigation" part="navigation-slot"></slot>
    </div>
    <div class="panel-container" part="panel-container">
        <div id="panelTab" class="panel-tab" part="panel-tab">
          <slot id="panelSlot" part="panel-slot"></slot>
        </div>
    </div>
  `.trim()
      return template
    }

    updateWidth() {
      if (this.$panelTab && this.$panels) {
        const numTabs = this.$panels.length
        this.$panelTab.style.setProperty('--tabs-width', `${FULL_LENGTH * numTabs}%`)
        this.$panelTab.style.setProperty('--tabs-section-width', `${(FULL_LENGTH / numTabs).toFixed(1)}%`)
      }
    }

    constructor() {
      super('')

      const shadowRoot = this.attachShadow({ mode: 'open' })
      shadowRoot.appendChild(this._generateTemplate().content.cloneNode(true))
      this.$panelTab = this.shadowRoot.querySelector('#panelTab')
      this.$tabSlot = this.shadowRoot.querySelector('#tabSlot')
      this.$panelSlot = this.shadowRoot.querySelector('#panelSlot')
      this._selected = 0
      this._selectedPrevious = 0
      this.numTabs = 0
      this.$tabs = []
      this.$panels = []

      this.$tabSlot.addEventListener('slotchange', () => {
        this.$tabs = this.$tabSlot.assignedNodes({ flatten: true })
        this.$panels = this.$panelSlot.assignedNodes({ flatten: true })
          .filter(el => el.nodeType === Node.ELEMENT_NODE)
        this.numTabs = this.$panels.length
        this.selected = this._findFirstSelectedTab()
        this.updateWidth()
      })

      this.$tabSlot.addEventListener('click', evt => {
        if (evt.target.slot === 'navigation' && this.$tabs) {
          this.selected = this.$tabs.indexOf(evt.target)
          evt.target.focus()
        }
      })
    }

    get EVENT_TYPES() {
      return EVENT_TYPES
    }

    get selected() {
      return this._selected
    }

    set selected(selectedIndex) {
      this._selectedPrevious = this._selected
      this._selected = selectedIndex
      this._selectTab(selectedIndex)
    }

    _selectTab(selectedIndex = null) {
      this.$tabs.forEach((tab, i) => {
        const select = i === selectedIndex
        tab.setAttribute('aria-selected', select)
        this.$panels[i].setAttribute('aria-hidden', !select)
      })
      let panelOffset = this.selected * (-FULL_LENGTH / this.numTabs).toFixed(1)
      this.$panelTab.style.transform = `translateX(${panelOffset}%)`
      const detail = {
        selectedIndex: this.selected,
        previousSelectedIndex: this._selectedPrevious,
      }
      this.dispatchEvent(new CustomEvent(EVENT_TYPES.TAB, { bubbles: true, detail }))
    }

    _findFirstSelectedTab() {
      let selectedIndex = 0
      this.$tabs.forEach((tab, i) => {
        if (tab.hasAttribute('aria-selected')) {
          selectedIndex = i
        }
      })
      return selectedIndex
    }

  })
}
