import '../../../src/informational/mettle-skeleton.js'

import { Constants } from '../../helper/index.js'

const DocsDescriptionMDX = `
**Single Import**
<pre class="coder">import '@johnsonandjohnson/mettle-components/src/informational/mettle-skeleton.js'</pre>

Use to create the structure of the intended layout.
`.trim()

export default {
  title: 'Custom Elements/Informational/Mettle-Skeleton',
  argTypes: {
    dataColor: {
      control: { type: 'color' },
      description: 'Set if you want to display the skeleton with a different color. Uses any CSS color value.',
      name: 'data-color',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          summary: 'lightgray',
        }
      }
    },
    dataShimmer: {
      control: { type: 'boolean' },
      description: 'Set if you want the content to display a shimmer effect.',
      name: 'data-shimmer',
      table: {
        category: Constants.CATEGORIES.ATTRIBUTES,
        defaultValue: {
          summary: 'false',
        }
      }
    },
    circle: {
      description: '&lt;area shape="circle" coords="x,y,radius" /&gt;<br /><em>e.g</em> &lt;area shape="circle" coords="10,0,30" /&gt;',
      name: '<area shape="circle"',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },
    rect: {
      description: '&lt;area shape="rect" coords="x,y,width,height" /&gt;<br /><em>e.g</em> &lt;area shape="rect" coords="90,15,300,30" /&gt;',
      name: '<area shape="rect"',
      table: {
        category: Constants.CATEGORIES.SLOTS,
      }
    },

    container: {
      description: 'Main content area can be styled',
      name: '::part(container)',
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

const Template = ({dataColor = 'lightgray', dataShimmer = 'false' }) => {
  return `
  <mettle-skeleton data-color="${dataColor}" data-shimmer="${dataShimmer}">
    <area shape="rect" coords="90 ,15,300,30" />
    <area shape="rect" coords="10 ,100,600,40" />
    <area shape="rect" coords="10 ,150,600,40" />
    <area shape="rect" coords="10 ,200,600,40" />
    <area shape="rect" coords="10 ,250,600,40" />
    <area shape="circle" coords="10,0,30" />
  </mettle-skeleton>`.trim()
}

const args = {
  dataColor: 'lightgray',
}

export const Default = Template.bind({})
Default.args = {
  ...args
}
Default.parameters = {
  docs: {
    source: {
      code: Template(Default.args)
    }
  },
}


const TemplateList = () => {
  return `
  <mettle-skeleton>
    <area shape="circle" coords="10,0,5" />
    <area shape="rect" coords="30,0,150,10" />
    <area shape="circle" coords="10,20,5" />
    <area shape="rect" coords="30,20,150,10" />
    <area shape="circle" coords="10,40,5" />
    <area shape="rect" coords="30,40,150,10" />
    <area shape="circle" coords="10,60,5" />
    <area shape="rect" coords="30,60,150,10" />
    <area shape="circle" coords="10,80,5" />
    <area shape="rect" coords="30,80,150,10" />
  </mettle-skeleton>`.trim()
}

export const SkeletonList = TemplateList.bind({})
SkeletonList.parameters = {
  docs: {
    description: {
      story: 'Sample of a list.',
    },
    source: {
      code: TemplateList()
    }
  },
}


const TemplateGallery = () => {
  return `
  <mettle-skeleton>

    <area shape="rect" coords="50,10,180,20" data-color="red" />
    <area shape="rect" coords="20,50,250,15" data-color="blue" />

    <area shape="rect" coords="0,100,90,90" data-color="#EC9595" />
    <area shape="rect" coords="100,100,90,90" />
    <area shape="rect" coords="200,100,90,90" />

    <area shape="rect" coords="0,200,90,90" />
    <area shape="rect" coords="100,200,90,90" data-color="#B1EC9D" />
    <area shape="rect" coords="200,200,90,90" />

    <area shape="rect" coords="0,300,90,90" />
    <area shape="rect" coords="100,300,90,90" />
    <area shape="rect" coords="200,300,90,90" data-color="hsl(248, 53%, 58%)" />

  </mettle-skeleton>`.trim()
}

export const SkeletonGallery = TemplateGallery.bind({})
SkeletonGallery.parameters = {
  docs: {
    description: {
      story: 'Sample of a gallery with dominant color placeholders.',
    },
    source: {
      code: TemplateGallery()
    }
  },
}

