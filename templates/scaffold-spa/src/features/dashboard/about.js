import {
  Constants,
  Router,
  Utility,
} from 'services'

import HTML from './about.html'

export const MainCtrl = async (req, next) => {

  //After content is loaded any other logic
  next()
}

Router
  .setPath(Constants.ROUTES.ABOUT, Utility.LoadHTML(HTML), MainCtrl)
