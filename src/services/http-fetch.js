import Util from './util.js'

const METHODS = {
  DELETE: 'DELETE',
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
}

let _requestOptions = Object.create(null)
let _nextRequestOptions = Object.create(null)

export default class HttpFetch {

  constructor(options = Object.create(null)) {
    this.requestOptions = options
  }

  get STATIC() {
    return {
      METHODS,
      addParamsToURL: this.constructor.addParamsToURL,
      generateUrlParams: this.constructor.generateUrlParams,
      parseResponse: this.constructor.parseResponse,
      searchParamsToObject: this.constructor.searchParamsToObject,
    }
  }

  static get METHODS() {
    return METHODS
  }

  get requestOptions() {
    return _requestOptions
  }

  set requestOptions(options) {
    if(typeof options === 'object') {
      _requestOptions = options
    }
  }

  nextRequestOptions(options) {
    if(typeof options === 'object') {
      _nextRequestOptions = options
    }
    return this
  }

  resetNextRequestOptions() {
    _nextRequestOptions = Object.create(null)
    return this
  }

  async request({ body = null, params = null, url, method }) {
    const myHeaders = new Headers()
    method = method.toUpperCase()

    if (params) {
      url = this.constructor.addParamsToURL(url, params)
    }

    let options = { cache: 'default', method, mode: 'cors', ...this.requestOptions, ..._nextRequestOptions }
    options.body = body
    if (body && !(body instanceof FormData || body instanceof URLSearchParams)) {
      options.body = JSON.stringify(body)
      myHeaders.set('Content-Type', 'application/json')
    }
    // Replace with Object.hasOwn() when Safari has support
    let headerOptions = Object.create(null)
    if (typeof this.requestOptions === 'object' && Object.prototype.hasOwnProperty.call(this.requestOptions, 'headers')) {
      headerOptions = { ...headerOptions, ...this.requestOptions.headers }
    }
    if (typeof _nextRequestOptions === 'object' && Object.prototype.hasOwnProperty.call(_nextRequestOptions, 'headers')) {
      headerOptions = { ...headerOptions, ..._nextRequestOptions.headers }
    }
    Object.entries(headerOptions).forEach(([key, value]) => {
      myHeaders.set(key, value)
    })
    options.headers = myHeaders
    this.resetNextRequestOptions()

    return window.fetch(url, options)
  }

  async requestAll(requests, settled = true) {
    return Promise[settled ? 'allSettled' : 'all'](requests.map(async request => this.request(request)))
  }

  static addParamsToURL(url, params = Object.create(null)) {
    let result = url
    try {
      const pathURL = new URL(url)
      const searchParams = pathURL.searchParams
      params = this.searchParamsToObject(params)
      Object.entries(params)
        .forEach(([key, value]) => {
          searchParams.set(key, value)
        })
      const urlSearchParams = searchParams.toString().length ? `?${searchParams.toString()}` : ''
      result = `${pathURL.origin}${pathURL.pathname}${urlSearchParams}`
    } catch (error) {
      if (url) {
        const queryString = this.searchParamsToObject(new URLSearchParams(url.slice(0).split('?')[1]))
        result = url.split('?')[0] + this.generateUrlParams({ ...queryString, ...params })
      }
    }
    return result
  }

  static searchParamsToObject(searchParams) {
    let result = Object.create(null)
    if(Util.isNotEmptyObject(searchParams)) {
      result = searchParams
    }
    if(searchParams instanceof URLSearchParams) {
      result = [...searchParams.entries()].reduce((acc, [key, val]) => Object.assign(acc, { [key]: String(val) }), Object.create(null))
    }
    return result
  }

  static async parseResponse(response) {
    let responseParsed = ''
    if (response instanceof Response && response.ok) {
      const responseText = await response.clone().text()
      responseParsed = responseText
      const contentType = response.headers.get('content-type')
      if (contentType) {
        if (contentType.includes('application/json')) {
          responseParsed = responseText.length ? JSON.parse(responseText) : Object.create(null)
        } else if (contentType.includes('application/octet-stream')) {
          responseParsed = await response.clone().blob()
        }
      }
    } else {
      throw response
    }
    return responseParsed
  }

  static generateUrlParams(params = Object.create(null)) {
    return `?${new URLSearchParams(params).toString()}`
  }

  get(url, params = null) {
    return this.request({ method: METHODS.GET, params, url })
  }

  async getAll(requests, settled = true) {
    requests = requests.map(request => ({ ...request, method: METHODS.GET }))
    return this.requestAll(requests, settled)
  }

  post(url, body) {
    return this.request({ body, method: METHODS.POST, url })
  }

  put(url, body) {
    return this.request({ body, method: METHODS.PUT, url })
  }

  delete(url) {
    return this.request({ method: METHODS.DELETE, url })
  }
}

