

import { Constants } from '../helper/index.js'

const DocsDescriptionMDX = `
This Router service allows you to create a navigation system for SPA(single page application)
web sites.  It utilizes the browser's session history with the History API.
This service is responsible for defining the route to match the url path,
invoke the controller functions and help manage the url.
This service is not responsible for displaying content, just managing routes and controllers.

**Vocabulary**

| Word | Definition |
|:---------:|:---------:|
| Route Param | This is value that replaces url placeholders, part of the base url |
| Search Param | Also known as query params. Added after the base url with key pair values  |


**Understand the URL components**

<img src="./route-components.svg" alt="i18n-Translations" />


**Using the Router**

To utilize the Router service, set up the routes and controllers to invoke.
The controller will be passed two parameters.  A request and the next function.
The request is an object with the following properties and methods

| Property | Purpose |
|:---------:|:---------:|
| canExit | Function to invoke that returns a boolean indicating if the user is allowed to exit the route |
| exit | Function to invoke when leaving the current route |
| params | A Map() object of the current route params |
| route | The route set for the controller |
| search | A URLSearchParams object with the route query params  |


Assume the url: <code>products/45?filter=size</code> from Route: <code>products/:id</code>

<pre><code>
const RouteCtrlPage1 = async (req, next) => {

  req.exit(() => {
    // Anything you want to do before this controller is complete
  })

  req.canExit(() => {
    return confirm('do you want to exit?')
  })

  const activeID = req.params.get('id') // 45
  const productFilter = req.search.get('filter') // size
  const route = req.route // products/:id


  next() // This is required to move to the next function
}
</code></pre>


**Set the Route with the controller**

<pre><code>
Router.setPath('page1/', RouteCtrlPage1)
</code></pre>

Each controller is piped only if the next function is executed.
You can add as many controllers needed to a single route.
Most common case would be authentication.

<pre>
<code>Router.setPath('page1/', AuthService.checkAuthenticationSession.bind(AuthService), RouteCtrlPage1) </code>
</pre>


The controller should combine your model and view to be displayed to the user.
In general Keep your controllers lite.

**Route Params**

Route params start with a semicolon(:) followed by the variable name.
If the param is optional add a question mark(?) after.

| Config | Path | Value |
|:---------:|:---------:|:---------:|
| /products/add/:packageId | /products/add/PK3456 | req.params.get('packageId') //PK3456 |
| /products/:productId/update | /products/5674/update | req.params.get('productId') //5674 |
| /products/:id? | /products/5674 | req.params.get('id') //5674 |
| /products/:id? | /products  | req.params.get('id') //null |


**Routing Redirects**

To change the path use the <code>Router.goto()</code> function.



##See more code samples below
`
export default {
  title: 'Services/Router',
  argTypes: {
    routeChangeEventName: {
      control: {
        type: null
      },
      description: 'Name of event used to dispatch from the window when a route has changed.',
      name: 'Router.routeChangeEventName',
      table: {
        category: Constants.CATEGORIES.GET_SET,
      }
    },
    urlFullPath: {
      control: {
        type: null
      },
      description: 'Get the full route path results including the query params.',
      name: 'Router.urlFullPath()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    getCurrentPath: {
      control: {
        type: null
      },
      description: 'Get the configured route path results.',
      name: 'Router.getCurrentPath()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    getRoute: {
      control: {
        type: null
      },
      description: 'Get the current configured route string.',
      name: 'Router.getRoute()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    resolveIn: {
      control: {
        type: null
      },
      description: 'Set the general route delay in milliseconds.',
      name: 'Router.resolveIn(number)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    goto: {
      control: {
        type: null
      },
      description: 'Function to route to a specified path.',
      name: 'Router.goto(path, [title = ""])',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    setPath: {
      control: {
        type: null
      },
      description: 'Function to route to a specified path.',
      name: 'Router.setPath(path, [...controllers])',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    defaultPath: {
      control: {
        type: null
      },
      description: 'Set the default route path when a specified route path does not exist.',
      name: 'Router.defaultPath(path)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    use: {
      control: {
        type: null
      },
      description: 'Controller function to execute before the route path controllers.',
      name: 'Router.use(controller)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    updateRouteParams: {
      control: {
        type: null
      },
      description: 'Function to update the url route params with new values.',
      name: 'Router.updateRouteParams(object)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    updateURLSearchParams: {
      control: {
        type: null
      },
      description: 'Function to update the url search params with new values.',
      name: 'Router.updateURLSearchParams(object)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    removeURLSearchParams: {
      control: {
        type: null
      },
      description: 'Function to remove all url search params.',
      name: 'Router.removeURLSearchParams()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    customElementsReady: {
      control: {
        type: null
      },
      description: 'Async Controller Function to be used to ensure all custom elements are loaded before routing.',
      name: 'Router.customElementsReady()',
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
      <a href="#" rel="page3/34/" title="Page three">Page 3</a>
      <a href="#" rel="fake/" title="Fake">Fake Path</a>
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
      $urlDisplay.value = Router.getCurrentPath() // Router.urlFullPath()
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

