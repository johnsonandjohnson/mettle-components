class Utility {

  LoadHTML(HTML) {
    return async (req, next) => {
      const $routeDisplay = document.querySelector('.route-display')
      await $routeDisplay.insertContent(HTML)
      next()
    }
  }

}

export default new Utility()
