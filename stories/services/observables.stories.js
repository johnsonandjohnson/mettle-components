

import { Constants } from '../helper/index.js'

const DocsDescriptionMDX = `
**Single Import**
<pre class="coder">import { Observable } from '@johnsonandjohnson/mettle-components/services'</pre>

**Source Code**
<pre class="coder"><a href="https://github.com/johnsonandjohnson/mettle-components/blob/main/src/services/observable.js" target="_blank">https://github.com/johnsonandjohnson/mettle-components/blob/main/src/services/observable.js</a></pre>

The observer pattern is a software design pattern in which an object, called the subject, maintains a list of its dependents, called observers, and notifies them automatically of any state changes, usually by calling one of their methods.

While JavaScript has support for dispatchEvent, observables can be considered much easier to maintain and implement when it comes to data distribution.  This solution is considered lightweight and does not use "named" events.

This is for interface(UI) developers using web technologies who want to implement a way to keep components in sync with data.


### How does it work

The idea here is we use the Observable class to create a Subject. Components can subscribe to the Subject(often a Service) and wait to be notified of changes to the subject. All components can stay in sync with the most current data.
<img src="./observable.svg" alt="Observable" />

### How to use
Subscribe to the observable and define the complete, error and next functions.
These keys require a function callback.

| Callback Key | Description |
|:---------:|:---------:|
| next | Invoked when notify is called |
| error | Invoked when notifyError is called |
| complete | Invoked after unsubscribe is called |

**When Subscribing**

When you subscribe to an observable the subscription will return some methods

| Property | Description |
|:---------:|:---------:|
| uid | Unique subscription identifier |
| unsubscribe() | Removes the subscription from the observable and Invokes complete callback if defined. **Important** Do this to avoid memory leaks if no more notifications are needed. |
| only(times) | Subscribe to the observable for only a limited amount of notifications |


**Use case for only getting data one time.**

<pre class="coder">
    const subscription = observed.subscribe(()=>{
      // do something
    }).only(1)

</pre>

**Use case to unsubscribe.**

<pre class="coder">
    const subscription = observed.subscribe(()=>{
      // do something
    })

    subscription.unsubscribe()
</pre>

> More code samples below
`.trim()

export default {
  title: 'Services/Observables',
  argTypes: {
    subscribe: {
      control: {
        type: null
      },
      description: 'Function used to subscript for notifications. This function returns an object with the only Method, UID of the subscription, and an unsubscribe function.',
      name: 'subscribe(next() || {complete, error, next})',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    notify: {
      control: {
        type: null
      },
      description: 'Function to update all subscriptions about a subject. The subject can be any JS type.',
      name: 'notify(subject)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    notifyError: {
      control: {
        type: null
      },
      description: 'Function to update all subscriptions about an error subject. The subject can be any JS type.',
      name: 'notifyError(subject)',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    complete: {
      control: {
        type: null
      },
      description: 'Function to unsubscribe all subscriptions and run a final callback.',
      name: 'complete()',
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
  return `<h3 id="render"></h3>
  <button class="observe">Start Subscription</button>

  <script type="module">
        import Observable from './services/observable.js'

        const observed = new Observable()
        const $render = document.querySelector('#render')
        const $startBtn = document.querySelector('.observe')

        const update = (fn) => {
          return new Promise(resolve => {
              setTimeout(resolve, 2000)
          }).then(fn)
        }

        $startBtn.addEventListener('click', async () => {

          $startBtn.toggleAttribute('disabled', true)

          const subscription = observed.subscribe({
            complete : () => {
              $render.textContent = 'Complete!'
            },
            error: error => {
              $render.textContent = error
            },
            next: subject => {
              $render.textContent = subject
            }
          })

          await update(()=>{
            observed.notify('Notification sent')
          })
          await update(()=>{
            observed.notifyError('Error Notification Sent')
          })
          await update(()=>{
            observed.complete()
          })
          $startBtn.toggleAttribute('disabled', false)

        })

        /*
        observed.notify('Notification sent') //Invoke notification function
        observed.notifyError('Error Notification Sent') // Invokes error notification function
        observed.complete() // Invokes complete function and removes all subscribed functions

        subscription.uid // uuid to identify subscription id
        subscription.unsubscribe() // Removes the subscription from the observable
        subscription.only(1) // Subscribe to the observable for only a limited amount of notifications
        */

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
      story: 'Sample use of observable class.',
    },
    source: {
      code: Template(Default.args)
    },
  },
  layout: 'fullscreen',
}





const TemplateOnly = () => {
  return `<h3 id="render"></h3>
  <button class="observe">Start Subscription</button>

  <script type="module">
        import Observable from './services/observable.js'

        const observed = new Observable()
        const $render = document.querySelector('#render')
        const $startBtn = document.querySelector('.observe')

        const update = (fn) => {
          return new Promise(resolve => {
              setTimeout(resolve, 2000)
          }).then(fn)
        }

        $startBtn.addEventListener('click', async () => {

          $startBtn.toggleAttribute('disabled', true)

          const subscription = observed.subscribe({
            complete : () => {
              $startBtn.toggleAttribute('disabled', false)
            },
            next: subject => {
              $render.textContent = subject
            }
          }).only(2)

          await update(()=>{
            observed.notify(\`current seconds: \${new Date().getSeconds()}\`) //First Notification sent
          })
          await update(()=>{
            observed.notify(\`current seconds: \${new Date().getSeconds()}\`) //Second Notification sent
          })

        })

    </script>
    `.trim()
}


export const SubscriptionWithOnly = TemplateOnly.bind({})
SubscriptionWithOnly.args = {
  ...args
}

const SubscriptionWithOnlyMDX = `
Sample use of a subscription to unsubscribe after two(2) notification.

**When re-running the test**

Notice that it seems like you will get only one(1) notification afterwards.
We are unsubscribing but the observable can still notify other subscriptions.

> There is a 2 second delay with the sample below. So When you start the subscription(quickly), it will invoke the *next()* function immediately with the last value notified after the first time.

By Design unless the observable is complete, the last subject is saved for new subscribers.
when resubscribing to the observable, the previously notified subject will immediately be invoked and notify.
`.trim()

SubscriptionWithOnly.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: SubscriptionWithOnlyMDX,
    },
    source: {
      code: TemplateOnly(SubscriptionWithOnly.args)
    },
  },
  layout: 'fullscreen',
}



const TemplateObservableService = () => {
  return `
  <table>
    <thead>
      <th>Component One</th>
      <th>Component Two</th>
    </thead>
    <tbody>
      <td id="component1"></td>
      <td id="component2"></td>
    </tbody>
  </table>

  <button class="observe">Send Notifications</button>
  <button class="subToggle">Toggle Component One subscription</button>

  <script type="module">
        import Observable from './services/observable.js'

        class TemplateService extends Observable {

          constructor() {
            super()
            this.payload
          }

          announcePayload() {
            this.notify(this.payload)
          }

          // This could be a Fetch call for payload data
          sendSeconds() {
            const seconds = new Date().getSeconds()
            this.payload = 'current seconds: ' + seconds
            this.announcePayload()
          }

        }

        const templateClass = new TemplateService()
        const $render1 = document.querySelector('#component1')
        const $render2 = document.querySelector('#component2')
        const $startBtn = document.querySelector('.observe')
        const $subToggleBtn = document.querySelector('.subToggle')

        // If just a function is passed it will be registered as the next for notify
        let subscription1 = templateClass.subscribe(subject => {
            $render1.textContent = subject
        })

        const subscription2 = templateClass.subscribe(subject => {
          $render2.textContent = subject
        })

        $subToggleBtn.addEventListener('click', () => {
          if(null === subscription1) {
            subscription1 = templateClass.subscribe(subject => {
                $render1.textContent = subject
            })
          } else {
            subscription1.unsubscribe()
            subscription1 = null
          }
        })

        $startBtn.addEventListener('click', () => {
          templateClass.sendSeconds()
        })

    </script>

    `.trim()
}


export const ObservableService = TemplateObservableService.bind({})
ObservableService.args = {
  ...args
}

const ObservableServiceMDX = `
Sample using Observables with Class Extends.
Click on send notification each time you want to see the update.
`.trim()

ObservableService.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: ObservableServiceMDX,
    },
    source: {
      code: TemplateObservableService(ObservableService.args)
    },
  },
  layout: 'fullscreen',
}
