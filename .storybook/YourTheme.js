import { create } from '@storybook/theming';

import LogoName from '../stories/assets/Mettle_BrandName_Logo.svg';

export default create({
  base: 'light',

  colorPrimary: '#3F4EA1',
  colorSecondary: '#2B3087',



  brandTitle: 'Mettle Custom elements',
  //brandUrl: 'https://example.com',
  brandImage: LogoName,
});
