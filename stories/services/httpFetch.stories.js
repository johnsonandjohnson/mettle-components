

import { Constants } from '../helper/index.js'

const DocsDescriptionMDX = `
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

**Header Samples**

<pre><code>
  new HttpFetch({
    headers: {
      Authorization: 'Basic ' + btoa(username + ":" + password)
    }
  })
</code></pre>


> See more code samples below
`
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
      name: 'generateUrlParams(params = {})',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    parseResponse: {
      control: {
        type: null
      },
      description: 'Static Function that will convert a Response object into an appropriate JavaScript object.',
      name: 'parseResponse(instanceof Response)',
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
    import HttpFetch from './http-fetch.js'

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
    import HttpFetch from './http-fetch.js'

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
    import HttpFetch from './http-fetch.js'

    const $results = globalThis.document.querySelector('.results')
    const URL = 'http://example.com?test=tester'
    const PARAMS = {one:1, two:2}
    const results = HttpFetch.addParamsToURL(URL, PARAMS)
    $results.innerText = results

  </script>
  `.trim()
}


export const addParamsToURL = addParamsToURLTemplate.bind({})
addParamsToURL.args = {
  ...args
}

const addParamsToURLMDX = `
Sample use of HttpFetch.addParamsToURL() static function.

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
    import HttpFetch from './http-fetch.js'

    const $results = globalThis.document.querySelector('.results')
    const PARAMS = {one:1, two:2}
    const results = HttpFetch.generateUrlParams(PARAMS)
    $results.innerText = results

  </script>
  `.trim()
}


export const generateUrlParams = generateUrlParamsTemplate.bind({})
generateUrlParams.args = {
  ...args
}

const generateUrlParamsMDX = `
Sample use of HttpFetch.generateUrlParams() static function.

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
    import HttpFetch from './http-fetch.js'

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

export const parseResponse = parseResponseTemplate.bind({})
parseResponse.args = {
  ...args
}

const parseResponseMDX = `
Sample use of HttpFetch.parseResponse() static function.

`.trim()

parseResponse.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: parseResponseMDX,
    },
    source: {
      code: parseResponseTemplate(parseResponse.args)
    },
  },
  layout: 'padded',
}
