import '../../../src/informational/mettle-notification.js'
import { Constants, generateParagraph, generateTitle  } from '../../helper/index.js'

const generateTemplate = ({type = null, time = 10}) => {

  const fragment = document.createDocumentFragment()
  const notification = document.createElement('mettle-notification')

  const btn = document.createElement('button')
  btn.textContent = 'Random Notification'
  btn.addEventListener('click', () => {
    const types = ["warning", "info", "error", "success"]
    if(!type) {
      type = types[Math.floor(Math.random() * types.length)]
    }

    notification.addNotification({
      message: generateParagraph(),
      time: ~~time,
      title: generateTitle(),
      type
    })
  })

  fragment.appendChild(notification)
  fragment.appendChild(btn)
  return fragment;
}

const DocsDescriptionMDX = `
<span className="tip">1.0.0</span>

<span className="tip tip-updated">Updated 1.14.0</span>

**Single Import**
<pre class="coder">import '@johnsonandjohnson/mettle-components/src/informational/mettle-notification.js'</pre>

**Source Code**
<pre class="coder"><a href="https://github.com/johnsonandjohnson/mettle-components/blob/main/src/informational/mettle-notification.js" target="_blank">https://github.com/johnsonandjohnson/mettle-components/blob/main/src/informational/mettle-notification.js</a></pre>

Used to provide a message over the page content.
`.trim()

export default {
  title: 'Custom Elements/Informational/Mettle-Notification',
  argTypes: {
    type: {
      control: { type: 'select', options: ['info', 'warning', 'error', 'success'] },
      description: 'Set the icon to display.',
      name: 'type',
      table: {
        category: Constants.CATEGORIES.PARAMS,
      }
    },
    time: {
      control: { type: 'select', options: ['10', '30', '60'] },
      description: 'Set the time in seconds to display.',
      name: 'time',
      table: {
        category: Constants.CATEGORIES.PARAMS,
      }
    },

    addNotification: {
      description: 'Adds a notification to the display list',
      name: 'addNotification({message, time, title, type})',
      table: {
        category: Constants.CATEGORIES.METHODS,
      },
      type: {
        required: true
      }
    },
    closeNotification: {
      description: 'Close a notification based on the ID',
      name: 'closeNotification({notificationID, instant = false})',
      table: {
        category: Constants.CATEGORIES.METHODS,
      },
    },

    list: {
      description: 'Wrapper div for the notifications content.',
      name: '::part(list)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
    notification: {
      description: 'General wrapper for the notification',
      name: '::part(notification)',
      table: {
        category: Constants.CATEGORIES.CSS,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: DocsDescriptionMDX,
      },
    },
  },
}

const Template = ({type = null, time = 10}) => {
  return generateTemplate({type, time})
}

const args = {
}

export const Default = Template.bind({})
Default.args = {
  ...args
}
Default.parameters = {
  docs: {
    source: {
      code: `${[...Template(Default.args).childNodes].map( n=> n.outerHTML ).join('\n')}
<script>
  const $component = globalThis.document.querySelector('mettle-notification')
  const $btn = globalThis.document.querySelector('button')
  $btn.addEventListener('click', () => {
    $component.addNotification({
      message: 'message here',
      time: 10,
      title: 'title here',
      type: 'info'
    })
  })
</script>`.trim()
    }
  },
}

const TemplateClose = () => {
  return `
  <mettle-notification id="close"></mettle-notification>
  <button id="closeBtn">New Notification</button>
  <script>
  const $component = globalThis.document.querySelector('#close')
  const $btn = globalThis.document.querySelector('#closeBtn')
  let notificationID
  $btn.addEventListener('click', () => {
    $component.closeNotification({notificationID})
    notificationID = $component.addNotification({
      message: \`\${new Date()}\`,
      time: 10,
      title: 'New Message',
      type: 'info'
    })
  })
</script>
  `.trim()
}

export const NotificationCloseFade = TemplateClose.bind({})

NotificationCloseFade.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'Sample of how to use the `closeNotification` function default. Click the button to remove the previous message and create a new one.',
    },
    source: {
      code: TemplateClose()
    }
  },
  layout: 'padded',
}



const TemplateCloseInstant = ({instant}) => {
  return `
  <mettle-notification id="close"></mettle-notification>
  <button id="closeBtn">New Notification</button>
  <script>
  const $component = globalThis.document.querySelector('#close')
  const $btn = globalThis.document.querySelector('#closeBtn')
  let notificationID
  let instant = ${instant}
  $btn.addEventListener('click', () => {
    $component.closeNotification({notificationID, instant})
    notificationID = $component.addNotification({
      message: \`\${new Date()}\`,
      time: 10,
      title: 'New Message',
      type: 'info'
    })
  })
</script>
  `.trim()
}

export const NotificationCloseInstant = TemplateCloseInstant.bind({})
NotificationCloseInstant.args = {
  ...args,
  instant: true,
}
NotificationCloseInstant.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'Sample of how to use the `closeNotification` function with instant removal. Click the button to remove the previous message and create a new one.',
    },
    source: {
      code: TemplateCloseInstant(NotificationCloseInstant.args)
    }
  },
  layout: 'padded',
}
