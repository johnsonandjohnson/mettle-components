import Util from './util.js'

const METHODS = {
  DELETE: 'DELETE',
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
}

export default class HttpFetch {

  #requestOptions = Object.create(null)
  #nextRequestOptions = Object.create(null)
  #interceptorMap = new Map()

  constructor(options = Object.create(null)) {
    this.#requestOptions = options
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

  get interceptors() {
    return this.#interceptorMap
  }

  get requestOptions() {
    return this.#requestOptions
  }

  set requestOptions(options) {
    if(typeof options === 'object') {
      this.#requestOptions = options
    }
  }

  nextRequestOptions(options) {
    if(typeof options === 'object') {
      this.#nextRequestOptions = options
    }
    return this
  }

  resetNextRequestOptions() {
    this.#nextRequestOptions = Object.create(null)
    return this
  }

  async request({ body = null, params = null, url, method }) {
    const myHeaders = new Headers()
    method = method.toUpperCase()

    if (params) {
      url = this.constructor.addParamsToURL(url, params)
    }
    let options = { cache: 'default', method, mode: 'cors', ...this.#requestOptions, ...this.#nextRequestOptions }
    options.body = body
    if (body && !(body instanceof FormData || body instanceof URLSearchParams)) {
      options.body = JSON.stringify(body)
      myHeaders.set('Content-Type', 'application/json')
    }
    // Replace with Object.hasOwn() when Safari has support
    let headerOptions = Object.create(null)
    if (typeof this.#requestOptions === 'object' && Object.prototype.hasOwnProperty.call(this.#requestOptions, 'headers')) {
      headerOptions = { ...headerOptions, ...this.#requestOptions.headers }
    }
    if (typeof this.#nextRequestOptions === 'object' && Object.prototype.hasOwnProperty.call(this.#nextRequestOptions, 'headers')) {
      headerOptions = { ...headerOptions, ...this.#nextRequestOptions.headers }
    }
    Object.entries(headerOptions).forEach(([key, value]) => {
      myHeaders.set(key, value)
    })
    options.headers = myHeaders
    this.resetNextRequestOptions()

    return this.interceptor(window.fetch, url, options)
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

  setInterceptors(interceptFunctions) {
    const uid = Util.uuid()
    this.interceptors.set(uid, interceptFunctions)
    return { remove: this.deleteInterceptor.bind(this, uid) }
  }

  deleteInterceptor(uid) {
    this.interceptors.delete(uid)
  }

  clearAllInterceptors() {
    this.interceptors.clear()
  }

  interceptor(fetch, ...fetchArgs) {
    let promise = Promise.resolve(fetchArgs)
    const resolveRequest = (...fetchArgs) => fetchArgs
    const REJECT = error => Promise.reject(error)
    const RESOLVE = response => response

    this.interceptors.forEach(({ request, requestError }) => {
      request = request || resolveRequest
      requestError = requestError || REJECT
      promise = promise.then(fetchArgs => request(...fetchArgs)).catch(requestError)
    })

    promise = promise.then(fetchArgs => fetch(...fetchArgs))

    this.interceptors.forEach(({ response, responseError }) => {
      response = response || RESOLVE
      responseError = responseError || REJECT
      promise = promise.then(response, responseError)
    })

    return promise
  }

}
