import Util from '../services/util.js'

const DISPLAY_STATE = {
  HIDE: 'none',
  SHOW: ''
}

const EVENT_TYPES = {
  SELECTED: 'selected',
  UNSELECTED: 'unselected',
}

const ROW_STATE = {
  SELECTED: 'selected',
}

const TAG_NAME = 'mettle-virtual-list'
if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends window.HTMLElement {

    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(this.generateTemplate().content.cloneNode(true))
    }

    generateTemplate() {
      const template = document.createElement('template')

      template.innerHTML = `
      <style>
      .v-container {
        contain: strict;
        height: 100%;
        overflow-y: auto;
        position: relative;
        will-change: scroll-position;
      }
      .v-list {
        height: 100%;
        left: 0;
        max-height: 100vh;
        position: absolute;
        top: 0;
        width: 100%;
      }
      .v-item {
        display: inherit;
      }
      .v-push {
        box-sizing: border-box;
        opacity: 0;
        width: 1px;
      }
      </style>
      <div class="v-container" part="container">
        <div class="v-push" part="push"></div>
        <div class="v-list" part"list"></div>
      </div>
    `.trim()
      return template
    }

    connectedCallback() {
      this.$container = this.shadowRoot.querySelector('div.v-container')
      this.$list = this.$container.querySelector('div.v-list')
      this.$push = this.$container.querySelector('div.v-push')
      this.oldListItems = []
      this.listItems = []
      this.listItemsHeight = []
      this.viewPortItems = []
      this.zoomResolution = null

      this.adjustScrollBind = Util.debounceAnimation(this.adjustScroll.bind(this))
      this.adjustResizeBind = Util.debounceAnimation(this.adjustResize.bind(this))
      this.zoomFactorBind = this.zoomFactor.bind(this)
      this.$container.addEventListener('scroll', this.adjustScrollBind)
      this.resizeObserver = new ResizeObserver(this.adjustResizeBind)
      this.resizeObserver.observe(this.$container)

      this.zoomFactor()
    }

    async zoomFactor() {
      await this.setListItemsHeights()
      this.zoomResolution = window.matchMedia(`(resolution: ${this.PIXEL_RATIO}dppx)`)
      this.zoomResolution.addEventListener('change', this.zoomFactorBind, { once: true })
    }

    get PIXEL_RATIO() {
      return window.devicePixelRatio
    }

    get EVENT_TYPES() {
      return EVENT_TYPES
    }

    get ROW_STATE() {
      return ROW_STATE
    }

    get fixedRows() {
      return ~~this.getAttribute('data-fixed-rows')
    }

    get listItemsLength() {
      return this.listItems.length
    }

    get listItemsHeightLength() {
      return this.listItemsHeight.length
    }

    get totalHeight() {
      const totalHeight = this.listItemsHeight.reduce((partialSum, acc) => partialSum + acc, 0)
      return totalHeight
    }

    get smallestItemHeight() {
      return Math.min(...this.listItemsHeight)
    }

    get largestItemHeight() {
      return Math.max(...this.listItemsHeight)
    }

    get displayAmt() {
      const rowAmount = this.fixedRows
      if(rowAmount > 0) {
        console.log('fixed rows', rowAmount)
        this.$container.style.height = `${this.largestItemHeight * rowAmount}px`
      }
      const containerHeight = Math.ceil(this.$container.getBoundingClientRect().height)
      return Math.ceil(containerHeight / this.smallestItemHeight)
    }

    get listViewAmt() {
      return Math.min(this.displayAmt, this.listItemsLength)
    }

    get scrollMax() {
      const scrollListAmt = this.listItemsLength - this.listViewAmt
      const scrollHeight = this.listItemsHeight.slice(0, scrollListAmt).reduce((partialSum, acc) => partialSum + acc, 0)
      return scrollHeight
    }

    get offsetItem() {
      const scrollTop = this.$container.scrollTop
      const listHeightLen = this.listItemsHeightLength
      let addedHeight = 0
      let offsetRow = 0
      for (let row = 0; row < listHeightLen; row++) {
        addedHeight += this.listItemsHeight[row]
        if (addedHeight > scrollTop) {
          offsetRow = row
          break
        }
      }
      return offsetRow
    }

    get viewPortItemsLength() {
      return this.viewPortItems.length
    }

    disconnectedCallback() {
      this.resizeObserver.unobserve(this.$container)
      if (this.zoomResolution) {
        this.zoomResolution.removeEventListener('change', this.zoomFactorBind)
      }
    }

    triggerSelected($selectedElement, rowIndex) {
      if ($selectedElement) {
        rowIndex = this.offsetItem + rowIndex
        this.clearSelectedRows($selectedElement)
        $selectedElement.part.toggle(ROW_STATE.SELECTED)
        this.currentSelectedIndex = $selectedElement.part.contains(ROW_STATE.SELECTED) ? rowIndex : null
        const eventName = $selectedElement.part.contains(ROW_STATE.SELECTED) ? EVENT_TYPES.SELECTED : EVENT_TYPES.UNSELECTED
        const detail = {
          elem: $selectedElement,
          index: rowIndex,
          itemData: Util.safeCopy(this.listItems[rowIndex]),
        }
        this.dispatchEvent(new CustomEvent(eventName, { bubbles: true, detail }))
      }
    }

    clearSelectedRows($filterRow = null) {
      this.viewPortItems.filter(row => row !== $filterRow).forEach($viewDiv => { $viewDiv.part.remove(ROW_STATE.SELECTED) })
      return this
    }

    isReady() {
      return Array.isArray(this.listItems) &&
        Util.isFunction(this.renderRow) &&
        Util.isFunction(this.updateRow)
    }

    async render({ listItems, renderRow = null, updateRow = null }) {
      if (!Array.isArray(listItems) ||
        JSON.stringify(listItems) === JSON.stringify(this.listItems)) {
        return
      }

      this.oldListItems = Util.safeCopy(this.listItems)
      this.listItems = Util.safeCopy(listItems)

      if (Util.isFunction(renderRow)) {
        if (Util.isFunction(this.renderRow) && renderRow.toString() !== this.renderRow.toString()) {
          this.$list.innerHTML = ''
          this.viewPortItems = []
          this.listItemsHeight = []
        }
        this.renderRow = renderRow
      }

      if (Util.isFunction(updateRow)) {
        this.updateRow = updateRow
      }

      await this.setListItemsHeights()
    }

    async appendItems(listItems) {
      if (!Array.isArray(listItems) ||
        !listItems.length) {
        return
      }
      this.listItems = this.listItems.concat(Util.safeCopy(listItems))
      await this.setListItemsHeights(true)
    }

    async setListItemsHeights(isAppended = false) {
      if (this.isReady()) {
        this.style.display = 'initial'
        const tag = this.renderRow()
        let itemHeights = []
        if (this.isDynamic()) {
          itemHeights = this.listItems.map((rowData, rowIndex) => {
            let rowHeight = isAppended || this.sameListItem(rowIndex) ? this.listItemsHeight[rowIndex] : undefined
            if (typeof rowHeight === 'undefined') {
              rowHeight = this._discoverElementHeight(tag.cloneNode(true), rowData)
            }
            return rowHeight
          })
        } else {
          const fixedHeight = await this._discoverLargestElementHeight(tag)
          itemHeights = this.listItems.map(() => fixedHeight)
        }
        await Promise.all(itemHeights)
          .then(values => {
            this.listItemsHeight = [...values]
          })
        await this.adjustResize()
        this.updateViewPortList()
        this.style.removeProperty('display')
      }
    }

    sameListItem(rowIndex) {
      return JSON.stringify(this.oldListItems[rowIndex]) === JSON.stringify(this.listItems[rowIndex])
    }

    updateViewPortList() {
      const topItem = this.offsetItem
      this.viewPortItems.forEach((tag, viewRowIndex) => {
        const offsetRowIndex = topItem + viewRowIndex
        tag.style.display = (typeof this.listItems[offsetRowIndex] === 'undefined') ? DISPLAY_STATE.HIDE : DISPLAY_STATE.SHOW
        tag.style.height = `${this.listItemsHeight[offsetRowIndex] || 0}px`
        tag.part.toggle(ROW_STATE.SELECTED, offsetRowIndex === this.currentSelectedIndex)
        tag.part.add('row')
        this.updateRow(tag, this.listItems[offsetRowIndex])
      })
    }

    adjustRenderedItems() {
      if (this.viewPortItemsLength !== this.displayAmt) {
        const viewPortItemsLength = this.displayAmt
        const rowElement = this.renderRow()
        const defaultHeight = this.largestItemHeight
        const topItem = this.offsetItem

        /* Add view port rows needed */
        for (let viewRowIndex = 0; viewRowIndex < viewPortItemsLength; viewRowIndex++) {
          const viewPortRow = this.viewPortItems[viewRowIndex]
          if (typeof viewPortRow === 'undefined') {
            const offsetRowIndex = topItem + viewRowIndex
            const viewPortRowElement = this.generateRow({
              defaultHeight, rowElement, rowIndex: offsetRowIndex
            })
            this.$list.appendChild(viewPortRowElement)
            this.updateRow(viewPortRowElement, this.listItems[offsetRowIndex])
            this.viewPortItems.push(viewPortRowElement)
          }
        }

      }
    }

    generateRow({ defaultHeight, rowElement, rowIndex }) {
      const tag = rowElement.cloneNode(true)
      tag.style.height = `${this.listItemsHeight[rowIndex] || defaultHeight}px`
      tag.style.display = (typeof this.listItems[rowIndex] === 'undefined') ? DISPLAY_STATE.HIDE : DISPLAY_STATE.SHOW
      tag.classList.add('v-item')
      tag.addEventListener('click', this.triggerSelected.bind(this, tag, rowIndex))
      return tag
    }

    async adjustResize() {
      if (this.isReady()) {
        this.$push.style.height = `${this.totalHeight}px`
        this.adjustRenderedItems()
        this.adjustScroll()
      }
    }

    adjustScroll() {
      if (!this.listItemsLength || !this.viewPortItemsLength) {
        return
      }
      let scrollTop = this.$container.scrollTop
      const topItem = this.offsetItem

      if (topItem !== this.lastTopItem) {
        let translateY = scrollTop
        if (topItem <= this.lastTopItem) {
          translateY -= this.listItemsHeight[topItem]
        }
        this.adjustListScrollPosition(translateY)
        this.updateViewPortList()
      }
      if (topItem === 0) {
        this.adjustListScrollPosition()
      }
      if (this.atScrollEnd()) {
        this.adjustListScrollPosition(this.scrollMax)
      }
      this.lastTopItem = topItem
    }

    adjustListScrollPosition(pos = 0) {
      this.$list.style.transform = `translateY(${pos}px)`
    }

    atScrollEnd() {
      return !!(this.$container.scrollTop > this.totalHeight)
    }

    async _discoverElementHeight(tag, rowData) {
      this.$list.appendChild(tag)
      tag.style.visibility = 'hidden'
      tag.classList.add('v-item')
      await this.updateRow(tag, rowData)
      const height = Math.ceil(tag.getBoundingClientRect().height)
      tag.remove()
      return height
    }

    _discoverLargestElementHeight(tag) {
      /* Find potential largest row */
      const mapLengths = this.listItems.map(listItem => JSON.stringify(listItem).length)
      const maxIndex = mapLengths.indexOf(Math.max(...mapLengths))
      return this._discoverElementHeight(tag, this.listItems[maxIndex])
    }

    isDynamic() {
      return this.hasAttribute('data-dynamic')
    }

    async setFixedRows() {
      if(this.isReady()) {
        await this.adjustResize()
        this.updateViewPortList()
      }
    }

    static get observedAttributes() {
      return ['data-fixed-rows']
    }

    attributeChangedCallback(attr, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.setFixedRows()
      }
    }

  })
}
