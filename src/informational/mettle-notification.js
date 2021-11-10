const TAG_NAME = 'mettle-notification'
if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends window.HTMLElement {

    constructor() {
      super('')
      const shadowRoot = this.attachShadow({ mode: 'open' })
      shadowRoot.appendChild(this._generateTemplate().content.cloneNode(true))
      this.$list = this.shadowRoot.querySelector('div.list')
    }

    addNotification({ message = '', time = 10, title = '', type = 'info' }) {
      const uuid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, b =>
        (b ^ crypto.getRandomValues(new Uint16Array(1))[0] & 15 >> b / 4).toString(16))

      const notificationID = `notification-${uuid}`
      const newNotificationHTML = `
      <div id="${notificationID}" class="item" part="notification">
        <div class="exit-icon">
          <svg height="30" width="30" viewbox="0 0 40 40">
            <path d="M 12,12 L 28,28 M 28,12 L 12,28" />
            <circle class="circle" r="18" cx="20" cy="20"></circle>
          </svg>
        </div>
        <div class="content" part="content">
          <div class="icon ${type}" part="icon"></div>
          <div class="title" part="title">${title} </div>
          <div class="message" part="message">${message}</div>
        </div>
      </div>
    `
      this.$list.insertAdjacentHTML('afterbegin', newNotificationHTML)
      const $notification = this.$list.querySelector(`#${notificationID}`)
      const $exitIcon = $notification.querySelector('.exit-icon')
      const $circle = $notification.querySelector('.circle')
      const closeNotification = () => {
        $notification.classList.add('fade')
      }
      $exitIcon.addEventListener('click', closeNotification)
      $circle.style['animation-duration'] = `${~~time}s`
      $circle.addEventListener('animationend', closeNotification)

      $notification.addEventListener('transitionend', () => {
        $notification.remove()
      })

      $notification.addEventListener('mouseover', () => {
        $circle.classList.remove('circle')
      })

      $notification.addEventListener('mouseout', () => {
        $circle.classList.add('circle')
      })

      return notificationID
    }

    closeNotification(notificationID) {
      const $notification = this.$list.querySelector(`#${notificationID}`)
      const $exitIcon = $notification.querySelector('.exit-icon')
      $exitIcon.click()
    }

    _generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = `
    <style>
        div.list {
          display:flex;
          flex-direction:column-reverse;
          max-height:100vh;
          opacity:1;
          overflow-y:scroll;
          position:fixed;
          right:0;
          bottom:0;
          width:400px;
          z-index:9000;
        }
        .item {
          background-color: var(--surface, #f0f0f0);
          border: 1px solid rgba(32, 33, 36, .28);
          border-radius: 5px;
          box-shadow: 0 1px 6px 0 rgba(32, 33, 36, .28);
          margin: 0.3rem;
          padding: 0.4rem;
          position: relative;
        }
        .content {
          color var(--on-surface, black);
          display: grid;
          grid-template-columns: 3rem 1fr;
        }
        .icon {
          font-size: 2rem;
          align-items: center;
          display: flex;
          grid-row-start: 1;
          grid-row-end:   3;
          justify-content: center;
        }
        .icon.info::after {
          color: blue;
          content: " \u2139";
        }
        .icon.warning::after {
          color: #c1502e;
          content: " \u26A0";
        }
        .icon.error::after {
          color: red;
          content: " \u2716";
        }
        .icon.success::after {
          color: green;
          content: " \u2713";
        }
        .title {
          font-size: 1.2rem;
          font-weight: bold;
          padding-bottom: 0.1rem;
        }
        .fade {
          transition: opacity 0.25s ease-in-out;
          opacity: 0.1;
        }
        .exit-icon {
          cursor:pointer;
          float:right;
          font-size:1.4rem;
          height:30px;
          position:absolute;
          right:10px;
          top:6px;
          width:30px;
        }
        svg {
          fill: transparent;
          stroke: black;
          stroke-linecap: round;
          stroke-width: 3;
        }
        .circle {
          stroke-dasharray: 175;
          stroke-dashoffset: 0;
          animation: stroke 10s linear forwards;
        }
        @keyframes stroke {
          to {
            stroke-dashoffset: 175;
            stroke: red;
          }
        }
      </style>
      <div class="list" part="list"></div>
      `.trim()
      return template
    }

  })
}
