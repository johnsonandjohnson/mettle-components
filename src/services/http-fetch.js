const METHODS = {
  DELETE: 'DELETE',
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
}

export default class HttpFetch {

  constructor(options = Object.create(null)) {
    this.requestOptions = options
  }

  static get METHODS() {
    return METHODS
  }

  async request({ body = null, params = null, url, method }) {
    const myHeaders = new Headers()
    method = method.toUpperCase()

    if (params && typeof params === 'object' && Object.keys(params).length) {
      url = this.constructor.addParamsToURL(url, params)
    }

    let options = { cache: 'default', method, mode: 'cors', ...this.requestOptions }
    options.body = body
    if (body && !(body instanceof FormData)) {
      options.body = JSON.stringify(body)
      myHeaders.set('Content-Type', 'application/json')
    }
    // Replace with Object.hasOwn() when Safari has support
    if (typeof this.requestOptions === 'object' && Object.prototype.hasOwnProperty.call(this.requestOptions, 'headers')) {
      Object.entries(this.requestOptions.headers).forEach(([key, value]) => {
        myHeaders.set(key, value)
      })
    }
    options.headers = myHeaders

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
      Object.entries(params)
        .map(param => param.map(window.encodeURIComponent))
        .forEach(([key, value]) => {
          if (!searchParams.has(key)) {
            searchParams.append(key, value)
          }
        })
      const urlSearchParams = searchParams.toString().length ? `?${searchParams.toString()}` : ''
      result = `${pathURL.origin}${pathURL.pathname}${urlSearchParams}`
    } catch (error) {
      if (url) {
        const queryString = [...new URLSearchParams(url.slice(0).split('?')[1]).entries()].reduce((acc, [key, val]) => Object.assign(acc, { [key]: String(val) }), Object.create(null))
        result = url.split('?')[0] + this.prototype.generateUrlParams({ ...queryString, ...params })
      }
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
    return `?${Object.entries(params).map(param => param.map(window.encodeURIComponent).join('=')).join('&')}`
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

