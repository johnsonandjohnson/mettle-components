class Utility {

  LoadHTML(HTML) {
    return async (req, next) => {
      const $routeDisplay = document.querySelector('.route-display')
      if($routeDisplay) {
        await $routeDisplay.insertContent(HTML)
        next()
      } else {
        throw new Error('No HTML to load')
      }
    }
  }

}

export default new Utility()
