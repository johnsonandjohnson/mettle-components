import Util from '../services/util.js'

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
        border: 1px solid red;
        contain: strict;
        height: 100%;
        overflow-y: auto;
        position: relative;
        will-change: scroll-position;
      }
      ${TAG_NAME} .v-list {
        border: 1px solid blue;
        height: 100%;
        left: 0;
        max-height: 100vh;
        position: absolute;
        top: 0;
        width: 100%;
      }
      ${TAG_NAME} .v-item {
        display: block;
        word-break: break-all;
      }
      ${TAG_NAME} .v-push {
        border: 1px solid green;
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

      this.adjustScrollBind = Util.debounceAnimation(this.adjustScroll.bind(this))
      this.adjustResizeBind = Util.debounceAnimation(this.adjustResize.bind(this), 0)
      this.$container.addEventListener('scroll', this.adjustScrollBind)
      this.resizeObserver = new ResizeObserver(this.adjustResizeBind)
      this.resizeObserver.observe(this.$container)
    }


    get listItemsLength() {
      return this.listItems.length
    }

    get listItemsHeightLength() {
      return this.listItemsHeight.length
    }

    get totalHeight() {
      const totalHeight = this.listItemsHeight.reduce((partialSum, acc) => partialSum + acc, 0)
      return totalHeight + (this.listItemsLength * this.zoomFactor)
    }

    get zoomFactor() {
      return Math.ceil((window.outerWidth / window.innerWidth) * 100) / 100
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
      return scrollHeight + (scrollListAmt * this.zoomFactor)
    }

    get offsetItem() {
      const scrollTop = this.$container.scrollTop
      const listHeightLen = this.listItemsHeightLength
      let addedHeight = 0
      let offsetRow = 0
      for(let row = 0; row < listHeightLen; row++) {
        addedHeight += this.listItemsHeight[row]
        if( addedHeight > scrollTop) {
          offsetRow = row
          break
        }
      }
      return offsetRow
    }


    disconnectedCallback() {
      this.resizeObserver.unobserve(this.$container)
    }

    vItemDown() {
      this.isKeyDown = true
      const selectedDiv = this.$list.querySelector('.selected')
      if (selectedDiv) {
        if (selectedDiv.nextElementSibling && selectedDiv.nextElementSibling.nextElementSibling) {
          selectedDiv.classList.remove('selected')
          selectedDiv.nextElementSibling.classList.add('selected')
        } else if (this.listItemsLength >= this.displayAmt && !selectedDiv.nextElementSibling) {
          selectedDiv.classList.remove('selected')
          selectedDiv.previousElementSibling.classList.add('selected')
        } else {
          this.$container.scrollTop += this.itemHeight
          this.adjustScroll()
        }
      } else {
        this.viewPortItems[0].classList.add('selected')
      }
    }

    vItemUp() {
      this.isKeyDown = true
      const selectedDiv = this.$list.querySelector('.selected')
      if (selectedDiv) {
        if (this.lastTopItem === 0 && selectedDiv.previousElementSibling && !selectedDiv.previousElementSibling.previousElementSibling) {
          selectedDiv.classList.remove('selected')
          this.viewPortItems[0].classList.add('selected')
          this.$container.scrollTop = 0
        } else if (selectedDiv.previousElementSibling && selectedDiv.previousElementSibling.previousElementSibling) {
          selectedDiv.classList.remove('selected')
          selectedDiv.previousElementSibling.classList.add('selected')
        } else if (!selectedDiv.previousElementSibling && this.lastTopItem !== 0) {
          selectedDiv.classList.remove('selected')
          this.viewPortItems[1].classList.add('selected')
        } else {
          this.$container.scrollTop -= this.itemHeight
          this.adjustScroll()
        }
      } else {
        this.viewPortItems[0].classList.add('selected')
      }
    }

    triggerSelected() {
      const selectedElement = this.$list.querySelector('.selected')
      if (selectedElement) {
        this.dispatchEvent(new CustomEvent('v-item-selected', { detail: selectedElement.cloneNode(true) }))
      }
    }

    isReady() {
      return Array.isArray(this.listItems) &&
        this.listItems.length &&
        Util.isFunction(this.renderRow) &&
        Util.isFunction(this.updateRow)
    }

    async render({ listItems, renderRow, updateRow }) {
      if (!Array.isArray(listItems) ||
        !listItems.length ||
        !Util.isFunction(renderRow) ||
        !Util.isFunction(updateRow) ||
        JSON.stringify(listItems) === JSON.stringify(this.listItems)) {
        return
      }

      this.listItems = listItems
      this.renderRow = renderRow
      this.updateRow = updateRow

      await this.setListItemsHeights()


      await this.adjustResize()
      console.log(this.scrollMax)


      /*
      if (this.listItems.length && renderRow === this.renderRow) {
        return this.updateItems(listItems)
      }
      let doInit = true
      if (this.listItems.length) {
        doInit = false
      }

      this.listItemsLength = this.listItems.length
      await this.adjustResize()

      this.adjustListScrollPosition()
      if (doInit) {
        this.$container.scrollTop = 0
      }
      this.lastTopItem = -1
      this.adjustScroll()
      */
    }

    adjustRenderedItems() {
      if (this.viewPortItems.length !== this.displayAmt) {
        //this.displayAmt = displayAmt
        this.$list.innerHTML = ''
        this.viewPortItems = []
        let viewPortItemsLength = this.displayAmt
        const defaultTag = this.renderRow()
        const defaultHeight = this.largestItemHeight
        while (viewPortItemsLength--) {
          const tag = defaultTag.cloneNode(true)
          tag.style.height = `${this.listItemsHeight[viewPortItemsLength] || defaultHeight}px`
          tag.style.display = (typeof this.listItems[viewPortItemsLength] === 'undefined') ? 'none' : 'block'
          //this.updateRow(tag, this.listItems[viewPortItemsLength])
          tag.classList.add('v-item')
          tag.addEventListener('click', this.triggerSelected.bind(this))
          tag.addEventListener('mouseover', () => {
            if (!this.isKeyDown) {
              this.viewPortItems.forEach(viewDiv => { viewDiv.classList.remove('selected') })
              tag.classList.add('selected')
            }
          })
          tag.addEventListener('mouseout', () => {
            if (!this.isKeyDown) {
              tag.classList.remove('selected')
            }
          })
          tag.addEventListener('mousemove', () => {
            this.isKeyDown = false
          })
          this.$list.appendChild(tag)
          this.updateRow(tag, this.listItems[viewPortItemsLength])
          this.viewPortItems.push(tag)
        }
        this.viewPortItemsLength = this.viewPortItems.length
      }
    }

    async updateItems(listItems) {
      if (!Array.isArray(listItems) ||
        !listItems.length ||
        JSON.stringify(listItems) === JSON.stringify(this.listItems)) {
        return
      }

      this.listItems = listItems
      this.listItemsLength = this.listItems.length
      await this.adjustResize()

      const scrollTop = this.$container.scrollTop
      const topItem = Math.floor(scrollTop / this.itemHeight)
      const viewportItems = this.listItems.slice(topItem, topItem + this.viewPortItemsLength)
      this.viewPortItems.forEach((tag, i) => {
        tag.style.display = (typeof viewportItems[i] === 'undefined') ? 'none' : 'block'
        this.updateRow(tag, viewportItems[i])
      })
    }

    async adjustResize() {
      if (this.isReady()) {
        this.$push.style.height = `${this.totalHeight}px`
        //this.adjustScroll()
        this.adjustRenderedItems()
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
        const viewportItems = this.listItems.slice(topItem, topItem + this.viewPortItemsLength)

        this.viewPortItems.forEach((tag, i) => {
          tag.style.display = (typeof viewportItems[i] === 'undefined') ? 'none' : 'block'
          tag.style.height = `${this.listItemsHeight[topItem+i]}px`
          this.updateRow(tag, viewportItems[i])
        })
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


    async setListItemsHeights() {
      const tag = this.renderRow()
      let itemHeights = []
      if(this.isDynamic()) {
        itemHeights = this.listItems.map(rowData => this._discoverElementHeight(tag.cloneNode(true), rowData))
      } else {
        const fixedHeight = await this._discoverLargestElementHeight(tag)
        itemHeights = this.listItems.map(() => fixedHeight)
      }
      return await Promise.all(itemHeights).then(values => {
        this.listItemsHeight = [...values]
      })
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
