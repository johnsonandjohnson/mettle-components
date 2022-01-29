

import { Constants } from '../helper/index.js'

const DocsDescriptionMDX = `


> See more code samples below
`
export default {
  title: 'Services/Router',
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

  <header class="role-story-header">
    <input type="text" readonly="readonly" class="url-display" />
    <nav>
      <a href="#" rel="page1/" title="Main Page" class="active">Page 1</a>
      <a href="#" rel="page2/" title="Page two">Page 2</a>
      <a href="#" rel="page3/34/" title="Page two">Page 3</a>
    </nav>
  </header>

  <main class="role-story-main">
    <div class="route-display"></div>
  </main>

  <script type="module">
    import Router from './router.js'

    const HtmlCache = new Map()
    HtmlCache.set('page1.html', '<strong>Page 1</strong><section class="page1"><div>Header</div><div>Main</div><div>Footer</div></section>')
    HtmlCache.set('page2.html', '<strong>Page 2</strong><section class="page2"><div>Header</div><div>Main</div><div>Footer</div></section>')
    HtmlCache.set('page3.html', '<strong>Page 3</strong><div>ID:<span id="idDisplay"></span></div><section class="page3"><div>Header</div><div>Main</div><div>Footer</div></section>')

    const $routeDisplay = document.querySelector('.route-display')
    const $urlDisplay = document.querySelector('.url-display')

    const RouteCtrlPage1 = async (req, next) => {
      $routeDisplay.innerHTML = HtmlCache.get('page1.html')
      next()
    }

    const RouteCtrlPage2 = async (req, next) => {
      $routeDisplay.innerHTML = HtmlCache.get('page2.html')
      next()
    }

    const RouteCtrlPage3 = async (req, next) => {
      $routeDisplay.innerHTML = HtmlCache.get('page3.html')
      document.querySelector('span#idDisplay').innerHTML = req.params.get('id')
      next()
    }

    Router.setPath('page1/', RouteCtrlPage1)
    Router.setPath('page2/', RouteCtrlPage2)
    Router.setPath('page3/:id?', RouteCtrlPage3)

    Router.defaultPath('page1/')

    Router.use((req, next) => {
      $urlDisplay.value = Router.urlFullPath()
      next()
    })

    const $links = Array.from(document.querySelectorAll('a[rel$="/"]'))
    $links.map(a => {
      a.addEventListener('click', evt => {
        evt.preventDefault()
        removeActiveClass()
        a.classList.add('active')
        Router.goto(a.getAttribute('rel'), a.getAttribute('title'))
      })
    })

    function removeActiveClass() {
      $links.forEach(link => {
        link.classList.remove('active')
      })
    }

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

