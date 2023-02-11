

import { Constants } from '../helper/index.js'

const DocsDescriptionMDX = `
<span className="tip">1.1.0</span>

**Single Import**
<pre class="coder">import { I18n } from '@johnsonandjohnson/mettle-components/services'</pre>

**Source Code**
<pre class="coder"><a href="https://github.com/johnsonandjohnson/mettle-components/blob/main/src/services/i18n.js" target="_blank">https://github.com/johnsonandjohnson/mettle-components/blob/main/src/services/i18n.js</a></pre>

Internationalization or Localization is made easy with the Mettle Service I18n.
In order to translate text, a local JSON file is stored and loaded with the service.
Under the hood I18n utilizes Mutation Observers to check when data-i18n attributes are updated.
This allows for almost instant translation updates without needing to refresh the page.
I18n also will utilize browser and JavaScript built-in functionality.

> This service is a Singleton

> Note that each browser may behave differently based on the native implementation


**General Overview**

<img src="./i18n-Translations.svg" alt="i18n-Translations" />


**What is needed**

You will need a json file with the name the matches the locale code like so.

<pre class="coder">
  en.json
  {
    "error-input": "This is a required field",
    "global:header": "This is the home page",
    "global:nav": "img/hamburger.png"
  }
  es.json
  {
    "error-input": "Este es un campo obligatorio",
    "global:header": "Esta es la página principal",
    "global:nav": "img/compass.png"
  }
</pre>

This dictionary file just has to follow JSON conventions.
You can decide how to organize your keys but some recommendations.

- Keys should all be in alphabetical order. Makes it easier to locate.
- Stick to a style either just dashes(-) or semicolons(:)
- File names can be localized e.g: en-us.json(English - United States), en-au.json(English - Australia)
- Place all translations files into a single folder, this must be accessible within the web app


**Code setup**

Here is a list of default attributes.  These attributes should be added with the key needed for translation.

| Attribute | Purpose |
|:---------:|:---------:|
| data-i18n | Replace textContent key with pair value, does not display HTML |
| data-i18n-unsafe | Replace innerHTML key with pair value, displays HTML |
| data-i18n-date | Takes a value supported by new Date() and converts it with toLocaleDateString() |
| data-i18n-number | Converts the number using Intl.NumberFormat() |
| data-i18n-placeholder | Replace attribute placeholder="" with pair value  |
| data-i18n-src | Replace attribute src="" with pair value |

<code><div data-i18n="global:header"></div></code>


**Config Options**

Using <code>I18n.config({})</code> Some options can be configured.

attributeMap, decorators, loadBasePath, loadPath, storageKey, urlParam

| Config | Purpose | Default |
|:---------:|:---------:|:---------:|
| attributeMap | Set a translation for an attribute | |
| decorators | Set a custom attribute that will also format the translation value | |
| fallbackLocale | Will try to load in the event a set locale Id does not exist | window.navigator.language.split('-').shift() |
| loadBasePath | Base path of the web app | window.location.origin |
| loadPath | From the base path, location to the locales folder | ./ (root) |
| storageKey | Local Session Storage key used to store the set locale | i18nLocale |
| urlParam | Url Param key used to change locale | locale |

> It is recommend to set at least the **fallbackLocale**

> If all attempts to find a value for the key fail, the key will be used in translation.

**Alternate Translation Change**

While the locale can be set using the <code>setLocale()</code> function.
An Alternate way is to use the URL params.  This is executed when the
<code>enableDocumentObserver()</code> is called.

Just append ?locale=(locale Id) to the url.

<pre class="coder">
example.com?locale=es
</pre>

**Text Direction**

All dom elements that use the <code>data-i18n</code> attribute will also add the <code>dir="auto"</code> attribute
to ensure the text direction is properly displayed based on the locale.  This is handled
by the browser.


##See more code samples below
`.trim()

export default {
  title: 'Services/I18n (Internationalization)',
  argTypes: {
    enableDocumentObserver: {
      control: {
        type: null
      },
      description: 'Function needed to translate and observe document for translations.',
      name: 'I18n.enableDocumentObserver()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    disconnectObserver: {
      control: {
        type: null
      },
      description: 'Function to stop observed document for translations.',
      name: 'I18n.disconnectObserver()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    setLocale: {
      control: {
        type: null
      },
      description: 'Function used to fetch and run translation.',
      name: 'I18n.setLocale(localeId)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    translatePage: {
      control: {
        type: null
      },
      description: 'Function used for a single runtime translation.  Does not fetch translations.',
      name: 'I18n.translatePage()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    setPageTitle: {
      control: {
        type: null
      },
      description: 'Function to set data-i18n to the header document title tag.',
      name: 'I18n.setPageTitle(i18nKey)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    formatNumber: {
      control: {
        type: null
      },
      description: 'Function to get locale number format. Based from Intl.NumberFormat.',
      name: 'I18n.formatNumber(number, [lng = localeId, options = {}])',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    formatDateTime: {
      control: {
        type: null
      },
      description: 'Function to get locale Date format. Based from Date().toLocaleDateString().',
      name: 'I18n.formatDateTime(date, [lng = localeId, options = {}])',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    addDictionary: {
      control: {
        type: null
      },
      description: 'Function manually add the to translation dictionary.',
      name: 'I18n.addDictionary(localeId, dictionary = {})',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    localeId: {
      control: {
        type: null
      },
      description: 'Get the currently set locale Id',
      name: 'I18n.localeId',
      table: {
        category: Constants.CATEGORIES.GET_SET,
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

  <button class="en">English</button>
  <button class="es">Spanish</button>
  <button class="ar">Arabic</button>

  <table border="1" cellspacing="4" cellpadding="4" width="100%">
    <caption>Translation Key Samples</caption>
    <thead>
      <th>Text</th>
      <th>Date</th>
      <th>Number</th>
      <th>Placeholder</th>
      <th>Image</th>
      <th>Button</th>
    </thead>
    <tbody>
      <td>
        <div class="demo" data-i18n="global:header"></div>
      </td>
      <td>
        <div class="demo" data-i18n-date="2021-03-05T17:44:12.508Z"></div>
      </td>
      <td>
        <div class="demo" data-i18n-number="3242342344"></div>
      </td>
      <td>
        <input type="text" data-i18n-placeholder="global:header" />
      </td>
      <td>
        <img src="img/hamburger.png" data-i18n-src="global:nav">
      </td>
      <td>
        <button class="demo" data-i18n="global:header"></button>
      </td>
    </tbody>
  </table>

  <script type="module">
    import I18n from './services/i18n.js'

    const isHTMLRegex = /\.html$/
    const pathName = window.location.pathname
    const finalPathName = pathName.trim().split('/')
    .filter(path => !isHTMLRegex.test(path))
    .join('/')

    I18n.config({
      fallbackLocale: 'en',
      loadPath: \`\${finalPathName}/locales\`,
    })

    I18n.enableDocumentObserver()

    document.querySelector('button.en').addEventListener('click', () => {
      I18n.setLocale('en').then(() => {
        //console.log('en loaded')
      })
    })

    document.querySelector('button.es').addEventListener('click', () => {
      I18n.setLocale('es').then(() => {
        //console.log('es loaded')
      })
    })

    document.querySelector('button.ar').addEventListener('click', async () => {
      await I18n.setLocale('ar')
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
      story: 'Sample use of I18n class.',
    },
    source: {
      code: Template(Default.args)
    },
  },
  layout: 'padded',
}



const singleTranslateTemplate = () => {
  return `
    <button class="en">Single Translation</button>
    <h2 class="demo">global:header</h2>

  <script type="module">
    import I18n from './services/i18n.js'

    const isHTMLRegex = /\.html$/
    const pathName = window.location.pathname
    const finalPathName = pathName.trim().split('/')
    .filter(path => !isHTMLRegex.test(path))
    .join('/')

    I18n.config({
      fallbackLocale: 'en',
      loadPath: \`\${finalPathName}/locales\`,
    })

    globalThis.document.querySelector('button.en').addEventListener('click', async () => {
      const i18nTranslate = await I18n.init()
      const $result = globalThis.document.querySelector('.demo')
      $result.innerHTML = i18nTranslate('global:header')
    })

  </script>
  `.trim()
}


export const singleTranslate = singleTranslateTemplate.bind({})
singleTranslate.args = {
  ...args
}

singleTranslate.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'Sample use of a I18n single translation.',
    },
    source: {
      code: singleTranslateTemplate(singleTranslate.args)
    },
  },
  layout: 'padded',
}




const decoratorsTemplate = () => {
  return `
    <button class="en">English</button>
    <button class="es">Spanish</button>
    <button class="ar">Arabic</button>
    <h1 class="demo" data-i18n-currency="3242342344"></h1>

  <script type="module">
    import I18n from './services/i18n.js'

    const isHTMLRegex = /\.html$/
    const pathName = window.location.pathname
    const finalPathName = pathName.trim().split('/')
    .filter(path => !isHTMLRegex.test(path))
    .join('/')

    I18n.config({
      fallbackLocale: 'en',
      loadPath: \`\${finalPathName}/locales\`,
      decorators: [
        {
          attr: 'data-i18n-currency',
          config: {
            format: (number) => \`<u>\${new Intl.NumberFormat(I18n.localeId, { style: 'currency', currency: 'USD' }).format(number)}</u>\`,
            unsafe: true
          }
        }
      ]
    })

    I18n.enableDocumentObserver()

    document.querySelector('button.en').addEventListener('click', async () => {
      await I18n.setLocale('en')
    })

    document.querySelector('button.es').addEventListener('click', async () => {
      await I18n.setLocale('es')
    })

    document.querySelector('button.ar').addEventListener('click', async () => {
      await I18n.setLocale('ar')
    })

  </script>
  `.trim()
}


export const decorators = decoratorsTemplate.bind({})
decorators.args = {
  ...args
}

const decoratorsMDX = `
Decorators for I18n allow you to add custom attributes with a custom format.

Pass an array of objects in the config to utilize.

| Property | Type | Description |
|:---------:|:---------:|:---------:|
| attr | String | custom Attribute name |
| config | Object | A format function and unsafe boolean |

**config options**

| Property | Type | Description |
|:---------:|:---------:|:---------:|
| format | Function | Takes in the translated value and returns a new modeled value |
| unsafe | Boolean | Allow for HTML to be parsed by the dom, defaults to false |


`.trim()

decorators.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: decoratorsMDX,
    },
    source: {
      code: decoratorsTemplate(decorators.args)
    },
  },
  layout: 'padded',
}




const attributeMapTemplate = () => {
  return `
  <button class="en">English</button>
  <button class="es">Spanish</button>
  <button class="ar">Arabic</button>
  <h1 class="demo" data-i18n-title="global:title">Hover and pause to see the title attribute</h1>

  <script type="module">
    import I18n from './services/i18n.js'

    const isHTMLRegex = /\.html$/
    const pathName = window.location.pathname
    const finalPathName = pathName.trim().split('/')
    .filter(path => !isHTMLRegex.test(path))
    .join('/')

    I18n.config({
      fallbackLocale: 'en',
      loadPath: \`\${finalPathName}/locales\`,
      attributeMap: [
        { attr: 'title', selector: 'data-i18n-title' }
      ]
    })

    I18n.enableDocumentObserver()

    document.querySelector('button.en').addEventListener('click', async () => {
      await I18n.setLocale('en')
    })

    document.querySelector('button.es').addEventListener('click', async () => {
      await I18n.setLocale('es')
    })

    document.querySelector('button.ar').addEventListener('click', async () => {
      await I18n.setLocale('ar')
    })

  </script>
  `.trim()
}


export const attributeMap = attributeMapTemplate.bind({})
attributeMap.args = {
  ...args
}

const attributeMapMDX = `
Attribute Map for I18n allow you to add a translation but instead of mapping the value
to the textContent, it will map it to an attribute.

Pass an array of objects in the config to utilize.

| Property | Type | Description |
|:---------:|:---------:|:---------:|
| attr | String | The attribute to apply the translation |
| selector | String | The attribute used for translation mapping |

`.trim()

attributeMap.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: attributeMapMDX,
    },
    source: {
      code: attributeMapTemplate(attributeMap.args)
    },
  },
  layout: 'padded',
}
