

import { Constants } from '../helper/index.js'

const DocsDescriptionMDX = `
<span className="tip">1.1.0</span>

**Single Import**
<pre class="coder">import { HttpFetch } from '@johnsonandjohnson/mettle-components/services'</pre>

**Source Code**
<pre class="coder"><a href="https://github.com/johnsonandjohnson/mettle-components/blob/main/src/services/http-fetch.js" target="_blank">https://github.com/johnsonandjohnson/mettle-components/blob/main/src/services/http-fetch.js</a></pre>

HttpFetch is a class that uses the built in Fetch API under the hood.
This class allows you to focus on making fetch calls without the common setup
often needed for fetch.

When creating a new instance of HttpFetch, any request options in which should be passed with
the fetch request can be added in the constructor.  These are some of the supported options
from the Fetch API.

> Note: Please research the rules and limitations when using certain options.

| Option | Possible Values | Browser Default |
|:---------:|:---------:|:---------:|
| mode | cors, no-cors, same-origin | cors |
| cache | default, force-cache, no-cache, only-if-cached, reload | default |
| credentials | include, omit, same-origin | same-origin |
| redirect | error, follow, manual  | follow |
| referrerPolicy | no-referrer, no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url | no-referrer-when-downgrade |

Headers is also an option but the list of possible options is very vast.
Below are just a few samples of possible headers.


| Headers | Common Values |
|:---------:|:---------:|
| Content-Type | application/json, application/x-www-form-urlencoded, application/octet-stream |
| Authorization | 'Basic ' + window.btoa(username + ":" + password), 'Bearer '.concat(JWTtoken) |
| Access-Control-Allow-Origin | '*', (origin) <code>http://example.com</code> |


**Options/Header Samples**

<pre class="coder">
  new HttpFetch({
    cache: 'no-cache',
    headers: {
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Basic ' + btoa(username + ":" + password),
    }
  })
</pre>

<br />

###Update Options for a single call

If you need to update the Fetch options for a single call, use the <code>nextRequestOptions()</code>
function.


<pre class="coder">
fetchInstance
  .nextRequestOptions({headers: {Accept: 'text/html'}, cache: 'no-cache'})
  .get(URL)
  .then(fetchInstance.STATIC.parseResponse)
  .then(results => {
    //handle results
  })
</pre>

<br />

##Create a reusable instance

HttpFetch calls will always return a new fetch call on each invoked function call.
Creating a single instance will give the benefit of using configured Interceptors
and fetch request options with all of the calls needed in your application.

**Sample of an export file with a single instance**

<pre class="coder">
import { HttpFetch } from '@johnsonandjohnson/mettle-components/services'

const fetchInstance = new HttpFetch({
  headers: {
    'Access-Control-Allow-Origin': '*',
    Authorization: 'Basic ' + btoa(username + ":" + password)
  }
})
fetchInstance.setInterceptors({
  request: (url, config) => {
    const cacheBuster = new Date().getTime()
    url = fetchInstance.STATIC.addParamsToURL(url, { cacheBuster })
    return [url, config]
  }
})

export default fetchInstance
</pre>

<br />
###Static Functions

You can access the Static functions from the HttpFetch class using the <code>STATIC</code>
property. This is just supplied as a shortcut and is not part of any JavaScript spec.
<code>HttpFetch.addParamsToURL()</code> <code>fetchInstance.STATIC.addParamsToURL()</code>


Alternatively you can use the more native approach and access any Static function from any
class in JavaScript with the <code>constructor</code> property.
<code>fetchInstance.constructor.addParamsToURL()</code>


## Interceptors

Interceptor is an object with methods that are invoked at the preprocessing and postprocessing of a fetch request.
There are four(4) interceptors, two(2) before the fetch request and two(2) after the response.
You can add as many interceptors, but most applications just need one as this will be applied for all
fetch request.  Note that this is not a global request, just for an instance of an
instantiated HttpFetch class.

<pre class="coder">
  const fetchInstance = new HttpFetch()
  const fetchInterceptorInstance = fetchInstance.setInterceptors({
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

  // Optional to remove just this added interceptor
  fetchInterceptorInstance.remove()

  // Option to remove all fetch interceptors set on the HttpFetch instance
  fetchInstance.clearAllInterceptors()
</pre>


<br />

| Interceptor use cases | Reason |
|:---------:|:---------:|
| Authentication | No need to repeat passing auth values with each request |
| Url Manipulation | update the url before a request to add query params or validation |
| Response error | If a required API service is down have a global/general way of handling |

**Interceptor Code Sample**

<pre class="coder">
  import ( AuthService ) from 'yourAppServices'

  const fetchInstance = new HttpFetch()

  const fetchInterceptorInstance = fetchInstance.setInterceptors({
    request: (url, config) => {
      // Authentication
      const authToken = AuthService.getJWTToken()
      if (config && config.headers instanceof Headers && authToken) {
        config.headers.set('Authorization', authToken)
      }
      // Url Manipulation
      const cacheBuster = new Date().getTime()
      url = fetchInstance.STATIC.addParamsToURL(url, { cacheBuster })
      return [url, config]
    },
    response: response => {
      if (response instanceof Response && [401, 403].includes(response.status) ) {
        if (PERMISSION_DENIED) {
          permissionDeniedDisplay()
        } else if (AUTH_EXPIRED) {
          RouterService.goto('/logout')
        }
      }
      return response
    },
    responseError: error => {
      // If error is not aborted by the user
      if (error.name !== 'AbortError') {
        serviceErrorDisplay()
      }
      return Promise.reject(error)
    }
  })
  export default fetchInstance
</pre>


##Post Body Data

When making a post request, the <code>options.body</code> will be set with the data
to send.  If a JSON object is sent, the header will be set with <code>'Content-Type': 'application/json'</code>
and the JSON will be stringified.

Note that sending a <code>FormData</code> API object or <code>URLSearchParams</code>
API object will be handled by the Fetch API.


##See more code samples below
`.trim()
export default {
  title: 'Services/HTTP Fetch',
  argTypes: {
    addParamsToURL: {
      control: {
        type: null
      },
      description: 'Static Function used to append a query string to a url. Returns the updated url.',
      name: 'HttpFetch.addParamsToURL(url, params = {})',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    generateUrlParams: {
      control: {
        type: null
      },
      description: 'Static Function to convert an object to a query string.',
      name: 'HttpFetch.generateUrlParams(params = {})',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    parseResponse: {
      control: {
        type: null
      },
      description: 'Static Function that will convert a Response object into an appropriate JavaScript object.',
      name: 'HttpFetch.parseResponse(instanceof Response)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    searchParamsToObject: {
      control: {
        type: null
      },
      description: 'Static Function that will convert a URLSearchParams object into an appropriate JSON object.',
      name: 'HttpFetch.searchParamsToObject(instanceof URLSearchParams)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    get: {
      control: {
        type: null
      },
      description: 'Function using the GET method.',
      name: 'get(url, params = null)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    getAll: {
      control: {
        type: null
      },
      description: 'Function to make multiple get request at once.',
      name: 'getAll(requests = [], settled = true [allSettled || all])',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    post: {
      control: {
        type: null
      },
      description: 'Function using the POST method.',
      name: 'post(url, body)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    put: {
      control: {
        type: null
      },
      description: 'Function using the PUT method.',
      name: 'put(url, body)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    delete: {
      control: {
        type: null
      },
      description: 'Function using the DELETE method.',
      name: 'delete(url)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    request: {
      control: {
        type: null
      },
      description: 'Async Function generally used as the fetch wrapper.',
      name: 'async request({ body = null, params = null, url, method })',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    nextRequestOptions: {
      control: {
        type: null
      },
      description: 'Single use to update Fetch Options on the next Fetch call. Resets after.',
      name: 'nextRequestOptions(options)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    setInterceptors: {
      control: {
        type: null
      },
      description: 'Set functions to handle the request before and after the fetch call. Returns an object with methods',
      name: 'setInterceptors({ request, requestError, response, responseError })',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    clearAllInterceptors: {
      control: {
        type: null
      },
      description: 'Set functions to remove all fetch interceptors.',
      name: 'clearAllInterceptors()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
  },
  parameters: {
    docs: {
      description: {
        component: DocsDescriptionMDX
      },
      source: {
        state: 'open',
      },
    },
  },
}

const Template = () => {
  return `
  <button class="fetch">Fetch Call</button>
  <strong>Results:</strong>
  <br />
  <textarea></textarea>


  <script type="module">
    import HttpFetch from './services/http-fetch.js'

    function fetchCall() {
      return new HttpFetch()
      .get('./http-fetch.json')
      .then(HttpFetch.parseResponse)
      .catch(error => {
        //handle error
      })
    }

    const $fetchBtn = globalThis.document.querySelector('.fetch')
    const $textarea = globalThis.document.querySelector('textarea')

    $fetchBtn.addEventListener('click', async () => {
      const results = await fetchCall()
      $textarea.value = JSON.stringify(results, null, 2)
    })

  </script>
  `.trim()
}

const args = {}

export const Default = Template.bind({})
Default.args = {
  ...args
}

Default.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'Sample use of HttpFetch class.',
    },
    source: {
      code: Template(Default.args)
    },
  },
  layout: 'padded',
}



const TemplateAbort = () => {
  return `
  <button class="fetch">Fetch Call With Abort</button>
  <strong>Results:</strong>
  <br />
  <textarea></textarea>


  <script type="module">
    import HttpFetch from './services/http-fetch.js'

    function fetchCall() {
      const abortController = new window.AbortController()
      let results = new HttpFetch({signal: abortController.signal})
      .get('./http-fetch.json')
      .then(HttpFetch.parseResponse)
      .catch(error => {
        if (error.name === 'AbortError') {
          return {error: 'AbortError'}
        }
      })

      abortController.abort()
      return results
    }

    const $fetchBtn = globalThis.document.querySelector('.fetch')
    const $textarea = globalThis.document.querySelector('textarea')

    $fetchBtn.addEventListener('click', async () => {
      const results = await fetchCall()
      $textarea.value = JSON.stringify(results, null, 2)
    })

  </script>
  `.trim()
}


export const fetchAbort = TemplateAbort.bind({})
fetchAbort.args = {
  ...args
}

const fetchAbortMDX = `
Sample use of HttpFetch class with abort.

`.trim()

fetchAbort.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: fetchAbortMDX,
    },
    source: {
      code: TemplateAbort(fetchAbort.args)
    },
  },
  layout: 'padded',
}



const addParamsToURLTemplate = () => {
  return `
  <strong>Fetch addParamsToURL Results:</strong>
  <br />
  <h2 class="results"></h2>

  <script type="module">
    import HttpFetch from './services/http-fetch.js'

    const $results = globalThis.document.querySelector('.results')
    const URL = 'http://example.com?test=tester'
    const PARAMS = {one:1, two:2, test: 'replaced'}
    const results = HttpFetch.addParamsToURL(URL, PARAMS)
    $results.textContent = results

  </script>
  `.trim()
}


export const addParamsToURL = addParamsToURLTemplate.bind({})
addParamsToURL.args = {
  ...args
}

const addParamsToURLMDX = `
Sample use of HttpFetch.addParamsToURL() static function.

>Note that if a param already exist it will replace the value

`.trim()

addParamsToURL.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: addParamsToURLMDX,
    },
    source: {
      code: addParamsToURLTemplate(addParamsToURL.args)
    },
  },
  layout: 'padded',
}





const generateUrlParamsTemplate = () => {
  return `
  <strong>Fetch generateUrlParams Results:</strong>
  <br />
  <h2 class="results"></h2>

  <script type="module">
    import HttpFetch from './services/http-fetch.js'

    const $results = globalThis.document.querySelector('.results')
    const PARAMS = { one:1, two:2 }
    const results = HttpFetch.generateUrlParams(PARAMS)
    $results.textContent = results

  </script>
  `.trim()
}


export const generateUrlParams = generateUrlParamsTemplate.bind({})
generateUrlParams.args = {
  ...args
}

const generateUrlParamsMDX = `
Sample use of HttpFetch.generateUrlParams() static function.
Returns the string value from the URLSearchParams API

`.trim()

generateUrlParams.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: generateUrlParamsMDX,
    },
    source: {
      code: generateUrlParamsTemplate(generateUrlParams.args)
    },
  },
  layout: 'padded',
}








const parseResponseTemplate = () => {
  return `
  <strong>Fetch parseResponse Results:</strong>
  <br />
  <textarea class="results"></textarea>

  <script type="module">
    import HttpFetch from './services/http-fetch.js'

    (async () => {
      const $results = globalThis.document.querySelector('.results')
      const myBlob = new Blob([JSON.stringify({ foo: 'bar' }, null, 2)], { type: 'application/json' })
      const response = new Response(myBlob, { status: 200, headers: { 'Content-type': 'application/json' } })
      const results = await HttpFetch.parseResponse(response)
      $results.value = JSON.stringify(results, null, 2)
    })()

  </script>
  `.trim()
}

export const parseJsonResponse = parseResponseTemplate.bind({})
parseJsonResponse.args = {
  ...args
}

const parseResponseMDX = `
Sample use of HttpFetch.parseResponse() static function.

`.trim()

parseJsonResponse.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: parseResponseMDX,
    },
    source: {
      code: parseResponseTemplate(parseJsonResponse.args)
    },
  },
  layout: 'padded',
}






const parseBlobResponseTemplate = () => {
  return `
  <strong>Fetch parseResponse Blob Results:</strong>
  <br />
  <img class="results" />

  <script type="module">
    import HttpFetch from './services/http-fetch.js'

    (async () => {
      const $results = globalThis.document.querySelector('.results')
      const imgData = new Uint8Array([
        137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,16,0,0,0,16,8,6,0,0,0,31,243,255,97,0,0,0,9,112,72,89,115,
        0,0,11,19,0,0,11,19,1,0,154,156,24,0,0,0,180,73,68,65,84,56,141,99,96,24,5,131,0,136,214,253,137,21,169,253,
        245,92,180,238,215,63,209,186,223,255,129,244,39,145,186,223,119,128,244,22,209,218,223,61,64,177,94,160,252,
        118,160,216,61,144,28,84,13,80,237,175,103,162,245,191,67,24,132,234,255,203,32,36,80,177,72,221,175,61,64,67,
        14,226,144,123,35,86,249,95,28,226,138,218,95,155,49,21,253,250,39,86,255,93,73,168,230,135,38,54,3,128,122,
        86,192,189,33,86,243,39,6,139,1,171,224,222,172,253,181,21,93,94,172,254,119,0,82,72,252,103,20,171,253,237,
        12,84,152,5,116,90,190,112,237,111,95,134,250,255,108,48,89,149,220,255,236,64,121,127,144,28,208,224,76,96,
        152,216,211,33,122,70,14,0,0,170,160,157,21,72,170,99,188,0,0,0,0,73,69,78,68,174,66,96,130
      ]);
      const myBlob = new Blob([imgData], { type: 'image/png' })
      const response = new Response(myBlob, { status: 200, headers: { 'Content-type': 'application/octet-stream' } })
      const results = await HttpFetch.parseResponse(response)
      const url = window.URL.createObjectURL(results)
      $results.src = url
    })()

  </script>
  `.trim()
}

export const parseBlobResponse = parseBlobResponseTemplate.bind({})
parseBlobResponse.args = {
  ...args
}

const parseBlobResponseMDX = `
Sample use of HttpFetch.parseResponse() static function with blob data.

`.trim()

parseBlobResponse.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: parseBlobResponseMDX,
    },
    source: {
      code: parseBlobResponseTemplate(parseBlobResponse.args)
    },
  },
  layout: 'padded',
}
