import Util from '../services/util.js'

const DISPLAY_STATE = {
  HIDE: 'none',
  SHOW: ''
}

const EVENT_TYPES = {
  ROW_SELECTED: 'row-selected',
  ROW_UNSELECTED: 'row-unselected',
}

const CLASS_STATE = {
  HOVERED: 'hovered',
  SELECTED: 'selected',
  UNSELECTED: 'unselected',
}


const TAG_NAME = 'mettle-virtual-list'
if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends window.HTMLElement {

    constructor() {
      super()
      this.isKeyDown = false
    }

    _generateTemplate() {
      return `
      <style>
      ${TAG_NAME} .v-container {
        contain: strict;
        height: 100%;
        overflow-y: auto;
        position: relative;
        will-change: scroll-position;
      }
      ${TAG_NAME} .v-list {
        height: 100%;
        left: 0;
        max-height: 100vh;
        position: absolute;
        top: 0;
        width: 100%;
      }
      ${TAG_NAME} .v-item {
        display: inherit;
      }
      ${TAG_NAME} .v-push {
        box-sizing: border-box;
        opacity: 0;
        width: 1px;
      }
      </style>
      <div class="v-container">
        <div class="v-push"></div>
        <div class="v-list"></div>
      </div>
    `.trim()
    }

    connectedCallback() {
      this.innerHTML = this._generateTemplate()
      this.$container = this.querySelector('div.v-container')
      this.$list = this.$container.querySelector('div.v-list')
      this.$push = this.$container.querySelector('div.v-push')
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
      const containerHeight = Math.ceil(this.$container.getBoundingClientRect().height)
      return Math.ceil(containerHeight / this.smallestItemHeight)
    }

    get scrollMax() {
      const listViewAmt = Math.min(this.displayAmt, this.listItemsLength)
      const scrollListAmt = this.listItemsLength - listViewAmt
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

    vItemDown() {
      this.isKeyDown = true
      const $selectedRow = this.$list.querySelector(`.${CLASS_STATE.HOVERED}`)
      if ($selectedRow) {
        if ($selectedRow.nextElementSibling && $selectedRow.nextElementSibling.nextElementSibling) {
          $selectedRow.classList.remove(CLASS_STATE.HOVERED)
          $selectedRow.nextElementSibling.classList.add(CLASS_STATE.HOVERED)
        } else if (this.listItemsLength >= this.displayAmt && !$selectedRow.nextElementSibling) {
          $selectedRow.classList.remove(CLASS_STATE.HOVERED)
          $selectedRow.previousElementSibling.classList.add(CLASS_STATE.HOVERED)
        } else {
          const selectedRowHeight = Math.ceil($selectedRow.getBoundingClientRect().height)
          this.$container.scrollTop += selectedRowHeight
          this.adjustScroll()
        }
      } else {
        this.viewPortItems[0].classList.add(CLASS_STATE.HOVERED)
      }
    }

    vItemUp() {
      this.isKeyDown = true
      const $selectedRow = this.$list.querySelector(`.${CLASS_STATE.HOVERED}`)
      if ($selectedRow) {
        if (this.lastTopItem === 0 && $selectedRow.previousElementSibling && !$selectedRow.previousElementSibling.previousElementSibling) {
          $selectedRow.classList.remove(CLASS_STATE.HOVERED)
          this.viewPortItems[0].classList.add(CLASS_STATE.HOVERED)
          this.$container.scrollTop = 0
        } else if ($selectedRow.previousElementSibling && $selectedRow.previousElementSibling.previousElementSibling) {
          $selectedRow.classList.remove(CLASS_STATE.HOVERED)
          $selectedRow.previousElementSibling.classList.add(CLASS_STATE.HOVERED)
        } else if (!$selectedRow.previousElementSibling && this.lastTopItem !== 0) {
          $selectedRow.classList.remove(CLASS_STATE.HOVERED)
          this.viewPortItems[1].classList.add(CLASS_STATE.HOVERED)
        } else {
          const selectedRowHeight = Math.ceil($selectedRow.getBoundingClientRect().height)
          this.$container.scrollTop -= selectedRowHeight
          this.adjustScroll()
        }
      } else {
        this.viewPortItems[0].classList.add(CLASS_STATE.HOVERED)
      }
    }

    triggerSelected($selectedElement, rowIndex) {
      if ($selectedElement) {
        this.clearSelectedRows($selectedElement)
        $selectedElement.classList.toggle(CLASS_STATE.SELECTED)
        this.currentSelectedIndex = $selectedElement.classList.contains(CLASS_STATE.SELECTED) ? this.offsetItem + rowIndex : null
        const eventName = $selectedElement.classList.contains(CLASS_STATE.SELECTED) ? EVENT_TYPES.SELECTED : EVENT_TYPES.UNSELECTED
        this.dispatchEvent(new CustomEvent(eventName, { bubbles: true, detail: $selectedElement.cloneNode(true) }))
      }
    }

    clearSelectedRows($filterRow = null) {
      this.viewPortItems.filter(row => row !== $filterRow).forEach(viewDiv => { viewDiv.classList.remove(CLASS_STATE.SELECTED) })
      return this
    }

    isReady() {
      return Array.isArray(this.listItems) &&
        this.listItemsLength &&
        Util.isFunction(this.renderRow) &&
        Util.isFunction(this.updateRow)
    }

    async render({ listItems, renderRow = null, updateRow = null }) {
      if (!Array.isArray(listItems) ||
        !listItems.length ||
        JSON.stringify(listItems) === JSON.stringify(this.listItems)) {
        return
      }

      this.listItems = Util.safeCopy(listItems)

      if(Util.isFunction(renderRow)) {
        this.renderRow = renderRow
      }

      if(Util.isFunction(updateRow)) {
        this.updateRow = updateRow
      }

      await this.setListItemsHeights()
    }

    async appendItems(listItems) {
      if (!Array.isArray(listItems) ||
        !listItems.length ||
        JSON.stringify(listItems) === JSON.stringify(this.listItems)) {
        return
      }
      this.listItems = this.listItems.concat(Util.safeCopy(listItems))
      await this.setListItemsHeights(true)
    }

    async setListItemsHeights(isAppended = false) {
      if (this.isReady()) {
        const tag = this.renderRow()
        let itemHeights = []
        if (this.isDynamic()) {
          itemHeights = this.listItems.map((rowData, rowIndex) => {
            let rowHeight = isAppended ? this.listItemsHeight[rowIndex] : undefined
            if(typeof rowHeight === 'undefined') {
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
      }
    }

    updateViewPortList() {
      const topItem = this.offsetItem
      this.viewPortItems.forEach((tag, viewRowIndex) => {
        const offsetRowIndex = topItem + viewRowIndex
        tag.style.display = (typeof this.listItems[offsetRowIndex] === 'undefined') ? DISPLAY_STATE.HIDE : DISPLAY_STATE.SHOW
        tag.style.height = `${this.listItemsHeight[offsetRowIndex] || 0}px`
        tag.classList.toggle(CLASS_STATE.SELECTED, offsetRowIndex === this.currentSelectedIndex)
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
      tag.addEventListener('mouseover', () => {
        if (!this.isKeyDown) {
          this.viewPortItems.forEach(viewDiv => { viewDiv.classList.remove(CLASS_STATE.HOVERED) })
          tag.classList.add(CLASS_STATE.HOVERED)
        }
      })
      tag.addEventListener('mouseout', () => {
        if (!this.isKeyDown) {
          tag.classList.remove(CLASS_STATE.HOVERED)
        }
      })
      tag.addEventListener('mousemove', () => {
        this.isKeyDown = false
      })
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

  })
}
