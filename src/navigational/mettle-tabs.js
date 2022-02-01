const TAG_NAME = 'mettle-tabs'
const FULL_LENGTH = 100

const EVENT_TYPES = {
  TAB: 'tab'
}

const ATTR_TYPES = {
  HIDDEN: 'aria-hidden',
  IGNORE: 'data-ignore',
  SELECTED: 'aria-selected'
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
        .tab-navigation #tabSlot::slotted(:not([${ATTR_TYPES.IGNORE}])) {
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
      <slot id="tabSlotBefore" name="beforeNavigation" part="before-navigation-slot"></slot>
      <div part="navigation-tab-group">
        <slot id="tabSlot" name="navigation" part="navigation-slot"></slot>
      </div>
      <slot id="tabSlotAfter" name="afterNavigation" part="after-navigation-slot"></slot>
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
          .filter(el => !el.hasAttribute(ATTR_TYPES.IGNORE))
        this.$panels = this.$panelSlot.assignedNodes({ flatten: true })
          .filter(el => el.nodeType === Node.ELEMENT_NODE)
        this.numTabs = this.$panels.length
        this.selected = this._findFirstSelectedTab()
        this.updateWidth()
      })

      this.$tabSlot.addEventListener('click', evt => {
        const $tab = evt.target
        if ($tab.slot === 'navigation' && this.$tabs && !$tab.hasAttribute(ATTR_TYPES.IGNORE)) {
          this.selected = this.$tabs.indexOf($tab)
          $tab.focus()
        }
      })
    }

    get EVENT_TYPES() {
      return EVENT_TYPES
    }

    get ATTR_TYPES() {
      return ATTR_TYPES
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
        tab.setAttribute(ATTR_TYPES.SELECTED, select)
        this.$panels[i].setAttribute(ATTR_TYPES.HIDDEN, !select)
      })
      let panelOffset = this.selected * (-FULL_LENGTH / this.numTabs).toFixed(1)
      this.$panelTab.style.transform = `translateX(${panelOffset}%)`
      const detail = {
        previousSelectedIndex: this._selectedPrevious,
        selectedIndex: this.selected,
      }
      this.dispatchEvent(new CustomEvent(EVENT_TYPES.TAB, { bubbles: true, detail }))
    }

    _findFirstSelectedTab() {
      let selectedIndex = 0
      this.$tabs.forEach((tab, i) => {
        if (tab.hasAttribute(ATTR_TYPES.SELECTED)) {
          selectedIndex = i
        }
      })
      return selectedIndex
    }

  })
}
