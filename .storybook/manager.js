import { addons } from '@storybook/addons';
import yourTheme from './YourTheme';

addons.setConfig({
  enableShortcuts: false,
  sidebar: false,
  showPanel: true,
  theme: yourTheme,
});
