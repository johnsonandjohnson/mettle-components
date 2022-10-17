class Utility {

  LoadHTML(HTML) {
    return async (req, next) => {
      const $routeDisplay = document.querySelector('.route-displays')
      if($routeDisplay) {
        await $routeDisplay.insertContent(HTML)
        next()
      } else {
        throw 'test'
        const $notification = document.querySelector('mettle-notification')
        $notification.addNotification({
          message: 'issue loading HTML',
          time: 60,
          title: 'Can not load',
          type: 'error'
        })

      }
    }
  }

}

export default new Utility()
