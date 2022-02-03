import { HttpFetch } from 'services'
import { mockApiResponse } from 'helper'

describe('HttpFetch', () => {

  let httpFetch

  const JSONHeaders = new Headers()
  JSONHeaders.set('Content-Type', 'application/json')
  const AuthHeaders = new Headers()
  AuthHeaders.set('authorization', 'Basic xyz')
  const AuthHeadersReplace = new Headers()
  AuthHeadersReplace.set('authorization', 'Basic 123')
  const formData = new FormData()
  formData.append('username', 'Tester')
  const PUTData = {data: 'value'}
  const GET_URL = 'http://example.com/get'
  const GET_HEADERS = { cache: 'default', method: HttpFetch.METHODS.GET, mode: 'no-cors', body: null, headers: new Headers() }
  const GET_AUTH_HEADERS = { cache: 'default', method: HttpFetch.METHODS.GET, mode: 'no-cors', body: null, headers: AuthHeaders }
  const GET_AUTH_HEADERS_REPLACE = { cache: 'default', method: HttpFetch.METHODS.GET, mode: 'no-cors', body: null, headers: AuthHeadersReplace }
  const GET_URL_PARAMS = 'http://example.com/get?test=tester'
  const GET_PARAMS = {test:'tester'}
  const GENERAL_RESPONSE = {test:'testing'}
  const ResponseMock = mockApiResponse(GENERAL_RESPONSE)
  const POST_URL = 'http://example.com/post'
  const POST_HEADERS = { cache: 'default', method: HttpFetch.METHODS.POST, mode: 'no-cors', body: formData, headers: JSONHeaders }
  const PUT_URL = 'http://example.com/put'
  const PUT_HEADERS = { cache: 'default', method: HttpFetch.METHODS.PUT, mode: 'no-cors', body: JSON.stringify(PUTData), headers: JSONHeaders }
  const DELETE_URL = 'http://example.com/delete'
  const DELETE_HEADERS = { cache: 'default', method: HttpFetch.METHODS.DELETE, mode: 'no-cors', body: null, headers: new Headers() }
  const MULTI_GET_URL = [
    { url: GET_URL },
    { params: { test: 'tester' }, url: GET_URL, }
  ]

  beforeAll(() => {
    const fetchSpy = spyOn(window, 'fetch')
    fetchSpy.withArgs(GET_URL, GET_HEADERS).and.returnValue(Promise.resolve(ResponseMock))
    fetchSpy.withArgs(GET_URL, GET_AUTH_HEADERS).and.returnValue(Promise.resolve(ResponseMock))
    fetchSpy.withArgs(GET_URL, GET_AUTH_HEADERS_REPLACE).and.returnValue(Promise.resolve(ResponseMock))
    fetchSpy.withArgs(GET_URL_PARAMS, GET_HEADERS).and.returnValue(Promise.resolve(ResponseMock))
    fetchSpy.withArgs(POST_URL, POST_HEADERS).and.returnValue(Promise.resolve(ResponseMock))
    fetchSpy.withArgs(PUT_URL, PUT_HEADERS).and.returnValue(Promise.resolve(ResponseMock))
    fetchSpy.withArgs(DELETE_URL, DELETE_HEADERS).and.returnValue(Promise.resolve(ResponseMock))
  })

  beforeEach(() => {
    httpFetch = new HttpFetch({ mode: 'no-cors' })
  })

  afterEach(() => {
    httpFetch.clearAllInterceptors()
  })

  describe('functions', () => {

    it('should accept options from the constructor', () => {
      expect(httpFetch.requestOptions).not.toEqual({})
    })

    it('should accept empty options from the constructor', () => {
      const http = new HttpFetch()
      expect(http.requestOptions).toEqual({})
    })

    it('should have the ability to create a new instance', () => {
      const http1 = new HttpFetch({cache: 'no-cache'})
      const cache1 = http1.requestOptions.cache
      const http2 = new HttpFetch({cache: 'reload'})
      const cache2 = http2.requestOptions.cache
      expect(cache1).not.toEqual(cache2)
    })

    it('should have an object path of methods', () => {
      expect(HttpFetch.METHODS).toEqual(jasmine.any(Object))
    })

    it('should have an object path of STATIC', () => {
      expect(httpFetch.STATIC).toEqual(jasmine.any(Object))
    })

    it('should expect addParamsToURL to add url params to a url with url params', () => {
      const URL = 'http://example.com?test=tester'
      const PARAMS = {one:1, two:2}
      const results = HttpFetch.addParamsToURL(URL, PARAMS)
      expect(results).toEqual('http://example.com/?test=tester&one=1&two=2')
    })

    it('should expect addParamsToURL to return url with no url params', () => {
      const URL = 'http://example.com?test=tester'
      const results = HttpFetch.addParamsToURL(URL)
      expect(results).toEqual('http://example.com/?test=tester')
    })


    it('should expect addParamsToURL to return url with new params with bad url', () => {
      const URL = 'example.com?test=tester'
      const PARAMS = {one:1, two:2}
      const results = HttpFetch.addParamsToURL(URL, PARAMS)
      expect(results).toEqual('example.com?test=tester&one=1&two=2')
    })

    it('should expect addParamsToURL to replace url params', () => {
      const URL = 'http://example.com?test=tester'
      const PARAMS = {test: 'new'}
      const results = HttpFetch.addParamsToURL(URL, PARAMS)
      expect(results).toEqual('http://example.com/?test=new')
    })

    it('should expect addParamsToURL to replace url with bad url', () => {
      const URL = 'example.com?test=tester'
      const PARAMS = {test: 'new'}
      const results = HttpFetch.addParamsToURL(URL, PARAMS)
      expect(results).toEqual('example.com?test=new')
    })


    it('should parse response to json', async () => {
      const myBlob = new Blob([JSON.stringify({ foo: 'bar' }, null, 2)], { type: 'application/json' })
      const response200 = new Response(myBlob, { status: 200, headers: { 'Content-type': 'application/json' } })
      const results = await HttpFetch.parseResponse(response200)
      expect(results).toEqual({ foo: 'bar' })
    })



    it('should expect empty response to return an empty value', async () => {
      const myBlob = new Blob([''], { type: 'text/plain' })
      const response200 = new Response(myBlob, { status: 200, headers: { 'Content-type': 'text/plain' } })
      const results = await HttpFetch.parseResponse(response200)
      expect(results).toEqual('')
    })

    it('should parse params to a url ready string', () => {
      const PARAMS = {one:1, two:2}
      const results = HttpFetch.generateUrlParams(PARAMS)
      expect(results).toEqual('?one=1&two=2')
    })

    it('should parse empty params to a url ready string', () => {
      const results = HttpFetch.generateUrlParams()
      expect(results).toEqual('?')
    })


    it('should get results from a url', async () => {
      const results = await httpFetch.get(GET_URL).then(HttpFetch.parseResponse)
      expect(results).toEqual(GENERAL_RESPONSE)
    })

    it('should post data to a url', async () => {
      const results = await httpFetch.post(POST_URL, formData).then(HttpFetch.parseResponse)
      expect(results).toEqual(GENERAL_RESPONSE)
    })

    it('should put data to a url', async () => {
      const results = await httpFetch.put(PUT_URL, PUTData).then(HttpFetch.parseResponse)
      expect(results).toEqual(GENERAL_RESPONSE)
    })

    it('should delete data to a url', async () => {
      const results = await httpFetch.delete(DELETE_URL).then(HttpFetch.parseResponse)
      expect(results).toEqual(GENERAL_RESPONSE)
    })

    it('should get results from a url with params', async () => {
      const results = await httpFetch.get(GET_URL, GET_PARAMS).then(HttpFetch.parseResponse)
      expect(results).toEqual(GENERAL_RESPONSE)
    })


    it('should add header options when defined from the constructor', async () => {
      const http = new HttpFetch({mode: 'no-cors', headers: { authorization: 'Basic xyz'}})
      const results = await http.get(GET_URL).then(HttpFetch.parseResponse)
      expect(results).toEqual(GENERAL_RESPONSE)
    })

    it('should add replace options when updated from nextRequestOptions', async () => {
      const http = new HttpFetch({mode: 'no-cors', headers: { authorization: 'Basic xyz'}})
      const options = {headers: { authorization: 'Basic 123'}}
      const results = await http.nextRequestOptions(options).get(GET_URL).then(HttpFetch.parseResponse)
      expect(results).toEqual(GENERAL_RESPONSE)
    })

    it('should allow multiple get calls all settled', async () => {
      const multiResults = await httpFetch.getAll(MULTI_GET_URL)
      const multiResultsJSON = await Promise.all(
        multiResults
          .filter(({ status }) => status === 'fulfilled')
          .map(async ({ value }) => await HttpFetch.parseResponse(value))
      )
      expect(multiResultsJSON).toEqual([GENERAL_RESPONSE, GENERAL_RESPONSE])
    })


    it('should allow multiple get calls all not settled', async () => {
      const multiResults = await httpFetch.getAll(MULTI_GET_URL, false)
      const multiResultsJSON = await Promise.all(
        multiResults
          .map(async response => await HttpFetch.parseResponse(response))
      )
      expect(multiResultsJSON).toEqual([GENERAL_RESPONSE, GENERAL_RESPONSE])
    })



    it('should get results from a url', async () => {
      const results = await httpFetch.get(GET_URL).then(HttpFetch.parseResponse)
      expect(results).toEqual(GENERAL_RESPONSE)
    })

    /** setInterceptors **/

    it('should clear registered interceptor functions', () => {

      httpFetch.setInterceptors({
        request: (url, config) => {
          return [url, config]
        },
        requestError: error => {
          return Promise.reject(error)
        },
        response: response => {
          return response
        },
        responseError: error => {
          return Promise.reject(error)
        }
      })

      httpFetch.clearAllInterceptors()
      expect(httpFetch.interceptors.size).toEqual(0)

    })

    it('should allow registered interceptor to unregister', () => {

      const subscription = httpFetch.setInterceptors({
        request: (url, config) => {
          return [url, config]
        },
        response: response => {
          return response
        }
      })

      subscription.remove()
      expect(httpFetch.interceptors.size).toEqual(0)

    })

    it('should intercept response errors', (done) => {
      let responseInterceptedError = false

      httpFetch.setInterceptors({
        responseError: error => {
          responseInterceptedError = true
          return Promise.reject(error)
        }
      })

      httpFetch.get('http://404').catch(() => {
        expect(responseInterceptedError).toBeTrue()
        done()
      })

    })

    it('should intercept request errors', (done) => {
      let requestInterceptedError = false

      httpFetch.setInterceptors({
        request: () => {
          throw new Error('Error')
        },
        requestError: error => {
          requestInterceptedError = true
          return Promise.reject(error)
        }
      })

      httpFetch.get(GET_URL).catch(() => {
        expect(requestInterceptedError).toBeTrue()
        done()
      })

    })

  })
})
