import {
  Constants,
  Router,
  Utility,
} from 'services'

import HTML from './home.html'

export const MainCtrl = async (req, next) => {

  //After content is loaded any other logic

  next()
}

Router
  .setPath(Constants.ROUTES.HOME, Utility.LoadHTML(HTML), MainCtrl)
