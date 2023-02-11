

import { Constants } from '../helper/index.js'


const DocsDescriptionMDX = `
**Single Import**
<pre class="coder">import { Roles } from '@johnsonandjohnson/mettle-components/services'</pre>

**Source Code**
<pre class="coder"><a href="https://github.com/johnsonandjohnson/mettle-components/blob/main/src/services/roles.js" target="_blank">https://github.com/johnsonandjohnson/mettle-components/blob/main/src/services/roles.js</a></pre>

Roles are used to control access to components of the application.  You can apply a role to a component to be displayed only to users who meet the role requirements.
`.trim()

export default {
  title: 'Services/Roles',
  argTypes: {
    UserRoles: {
      control: {
        type: null
      },
      description: 'Property to set the roles for the user',
      name: 'UserRoles',
      table: {
        category: Constants.CATEGORIES.GET_SET,
      }
    },
    setDefaultRights: {
      control: {
        type: null
      },
      description: 'Function to take in the base rights for all users',
      name: 'setDefaultRights()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    setRightsConfig: {
      control: {
        type: null
      },
      description: 'Function to set a role and config',
      name: 'setRightsConfig()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
    enforceElementRoles: {
      description: 'Function to enforce elements roles.',
      name: 'enforceElementRoles()',
      table: {
        category: Constants.CATEGORIES.METHODS,
      }
    },
  },
  parameters: {
    docs: {
      description: {
        component: DocsDescriptionMDX,
      },
      source: {
        state: 'open',
      },
    },
  },
}

const Template = () => {
  return `<p>
    Roles: <span id="roles"></span> <br />
    <p>
      <span data-roles="default">Default Display</span>
      <strong data-roles="admin">Admin Display</strong>
      <em data-roles="mod">Mod Display</em>
    </p>
    <button id="default">Default</button>
    <button id="admin">Admin</button>
    <button id="mod">Mod</button>
    <button id="both">Both</button>
  <script type="module">
   import Roles from './services/roles.js'

    Roles.setDefaultRights({
      default: true,
      admin: false,
      mod: false
    }).setRightsConfig('admin', {
      admin: true
    }).setRightsConfig('mod', {
      mod: true
    }).enforceElementRoles()

    const btnDefault = document.querySelector('#default')
    const btnAdmin = document.querySelector('#admin')
    const btnMod = document.querySelector('#mod')
    const btnBoth = document.querySelector('#both')
    const roles = document.querySelector('#roles')

    btnDefault.addEventListener('click', () => {
      Roles.UserRoles = []
      roles.innerHTML = Roles.UserRoles
    })
    btnAdmin.addEventListener('click', () => {
      Roles.UserRoles = ['admin']
      roles.innerHTML = Roles.UserRoles
    })
    btnMod.addEventListener('click', () => {
      Roles.UserRoles = ['mod']
      roles.innerHTML = Roles.UserRoles
    })
    btnBoth.addEventListener('click', () => {
      Roles.UserRoles = ['admin', 'mod']
      roles.innerHTML = Roles.UserRoles
    })
  </script>`.trim()
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
      story: 'Sample of how roles can be applied and how it affects the content.',
    },
    source: {
      code: Template(Default.args)
    },
  },
  layout: 'fullscreen',
}


const TemplateInvertedRoles = () => {
  return `<p>
    Roles: <span id="roles"></span> <br />
    <p>
      <strong data-roles="admin">For Admin Display</strong>
      <strong data-roles="!admin">Not for Admin Display</strong>
    </p>
    <button id="admin">Admin</button>
    <button id="notadmin">Not Admin</button>

  <script type="module">
   import Roles from './services/roles.js'

    Roles.setDefaultRights({
      admin: false,
    }).setRightsConfig('admin', {
      admin: true
    }).enforceElementRoles()

    const btnNotAdmin = document.querySelector('#notadmin')
    const btnAdmin = document.querySelector('#admin')

    btnNotAdmin.addEventListener('click', () => {
      Roles.UserRoles = []
      roles.innerHTML = Roles.UserRoles
    })
    btnAdmin.addEventListener('click', () => {
      Roles.UserRoles = ['admin']
      roles.innerHTML = Roles.UserRoles
    })

  </script>`.trim()
}

export const InvertedRoles = TemplateInvertedRoles.bind({})
InvertedRoles.args = {
  ...args
}


InvertedRoles.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'Sample of how roles can be inverted by using the exclamation point(!).',
    },
    source: {
      code: TemplateInvertedRoles(InvertedRoles.args)
    },
  },
  layout: 'fullscreen',
}




const TemplateDeleteElements = () => {
  return `<p>
    Roles: <span id="roles"></span> <br />
    <p>
      <strong data-roles="admin">For Admin Display</strong>
      <strong data-roles="!admin">Not for Admin Display</strong>
    </p>
    <button id="admin">Admin</button>
    <button id="notadmin">Not Admin</button>

  <script type="module">
    import Roles from './services/roles.js'

    Roles.shouldDeleteElement = true

    Roles.setDefaultRights({
      admin: false,
    }).setRightsConfig('admin', {
      admin: true
    }).enforceElementRoles()

    const btnNotAdmin = document.querySelector('#notadmin')
    const btnAdmin = document.querySelector('#admin')

    btnNotAdmin.addEventListener('click', () => {
      Roles.UserRoles = []
      roles.innerHTML = Roles.UserRoles
    })
    btnAdmin.addEventListener('click', () => {
      Roles.UserRoles = ['admin']
      roles.innerHTML = Roles.UserRoles
    })

  </script>`.trim()
}

export const DeleteElements = TemplateDeleteElements.bind({})
DeleteElements.args = {
  ...args
}


DeleteElements.parameters = {
  docs: {
    inlineStories: false,
    description: {
      story: 'Sample of how roles can be used to remove a DOM element by setting <strong>shouldDeleteElement=true</strong>. The default behavior is to toggle the elements to be hidden.',
    },
    source: {
      code: TemplateDeleteElements(DeleteElements.args)
    },
  },
  layout: 'fullscreen',
}
