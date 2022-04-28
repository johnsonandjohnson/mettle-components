export default class Paginate {

  constructor({ pageList = [], pageSize = 10 } = Object.create(null)) {
    this.reset()
    this.pageSize = ~~pageSize
    this.pageList = pageList
  }

  reset() {
    this.sortOrderASC = true
    this.sortKey = ''
    this.threshold = 10
    this.currentPage = 1
    this.pageSize = 10
    this._pageList = []
    this.pageList = []
  }

  get currentPage() {
    return this._currentPage
  }

  set currentPage(page) {
    page = ~~page
    this._currentPage = page
    if (page < 1) {
      this._currentPage = 1
    } else if (page > this._totalPages) {
      this._currentPage = this._totalPages
    }
  }

  set pageSize(size) {
    size = ~~size
    if (size > 0) {
      this._currentPageSize = size
      this._update()
    }
  }

  get pageSize() {
    return this._currentPageSize
  }

  set pageList(listArray) {
    this._pageList = listArray
    this._sortList()
    this._totalItems = Array.isArray(this._pageList) ? ~~this._pageList.length : 0
    this._update()
  }

  get pageList() {
    return this._pageList
  }

  get totalItems() {
    return this._totalItems
  }

  set threshold(min = 10) {
    this._threshold = ~~min
  }

  get threshold() {
    return this._threshold
  }

  currentList() {
    const { end, start } = this.getSliceValues()
    return this.pageList.slice(start, end)
  }

  sortList(key, asc = true) {
    this.sortOrderASC = asc
    this.sortKey = key
    return this._sortList()
  }

  _sortList() {
    if (this.sortKey.length) {
      const comparer = (v1, v2) => new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare(v1, v2)
      const sortOrder = (prop = null, asc = true) => {
        return (a, b) => {
          a = prop ? a[prop] : a
          b = prop ? b[prop] : b
          const v1 = asc ? a : b
          const v2 = asc ? b : a
          return comparer(v1, v2)
        }
      }
      const sortRecursive = arrList => {
        if (Array.isArray(arrList)) {
          arrList = arrList.sort(sortOrder(this.sortKey, this.sortOrderASC))
        } else if (null != arrList && typeof (arrList) === 'object') {
          const keys = Object.keys(arrList)
          keys.forEach(key => {
            arrList[key] = sortRecursive(arrList[key])
          })
        }
        return arrList
      }
      this._pageList = sortRecursive(this.pageList)
    }
    return this
  }

  setPageByKeyValue(key, value) {
    const rowIndex = this.pageList.findIndex(row => row[key] == value)
    if (rowIndex > -1) {
      this.currentPage = Math.ceil((rowIndex + 1) / this.pageSize)
    }
    return this
  }

  _update() {
    this._totalPages = Math.ceil(this.totalItems / this.pageSize)
    this.currentPage = this._currentPage
  }

  forward() {
    this.currentPage = this.currentPage + 1
    return this
  }

  back() {
    this.currentPage = this.currentPage - 1
    return this
  }

  canNavigateForward() {
    return this.currentPage < this._totalPages
  }

  canNavigateBack() {
    return this.currentPage > 1
  }

  getSliceValues() {
    return {
      end: Math.min(this.currentPage * this.pageSize, this.totalItems),
      start: (this.currentPage - 1) * this.pageSize,
    }
  }

  shouldPaginate() {
    return this.totalItems > this.threshold
  }

}
