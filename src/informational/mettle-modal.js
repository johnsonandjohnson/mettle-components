/**
 * Copyright: Copyright © 2019
 * This file contains trade secrets of Johnson & Johnson. No part may be reproduced or transmitted in any
 * form by any means or for any purpose without the express written permission of Johnson & Johnson.
 */


 import { MixinDefs, OnRemoveMixin } from '../mixins/index.js'
 const TAG_NAME = 'mettle-modal'
 const HALF = 2

 const BASE = OnRemoveMixin(HTMLElement)
 if (!window.customElements.get(TAG_NAME)) {
   window.customElements.define(TAG_NAME, class extends BASE {

    constructor() {
      super()
    }

    connectedCallback() {
      this.__attachShadowRoot()
      if (this.shadowRoot instanceof ShadowRoot) {
        this.btnClose = this.shadowRoot.querySelector('div.close')
        this.modal = this.shadowRoot.querySelector('div.modal')
        this.modalPopup = this.shadowRoot.querySelector('div.popup')
        this.modalBG = this.shadowRoot.querySelector('div.background')
        this.closePopupBind = this.closePopup.bind(this)
        this.btnClose.addEventListener('click', this.closePopupBind)
        this.modalBG.addEventListener('click', this.closePopupBind)
        this.render()
      }
    }

    __attachShadowRoot() {
      if (null === this.shadowRoot) {
        this.attachShadow({ mode: 'open' })
          .appendChild(this._generateTemplate().content.cloneNode(true))
        document.body.appendChild(this)
      }
    }


  _generateTemplate() {

    const template = document.createElement('template')

    template.innerHTML = `
      <style>
        .modal {
          align-items: center;
          bottom:0;
          display: none;
          flex-direction: column;
          justify-content: center;
          left: 0;
          margin: auto;
          max-height: 50vh;
          max-width: 54vw;
          overflow: hidden;
          position: fixed;
          right:0;
          top: 0;
          z-index: 200;
        }
        .side {
          flex-direction: initial;
          max-height: 100vh;
          height: 100%;
          margin: 0;
          right: 0;
          width: 54vw;
        }
        .bg-is-active {
          max-height: 100vh;
          max-width: 100vw;
          width: 100vw;
        }
        .left {
          justify-content: flex-start;
        }
        .right {
          justify-content: flex-end;
          left: initial;
          right:0;
        }
        .popup {
          background: #fff;
          border-radius: 3px;
          box-shadow: 0px 0px 20px rgba(0,0,0,0.3);
          max-height: 50vh;
          max-width: 50vw;
          min-height: 100px;
          min-width: 300px;
          overflow: auto;
          position: fixed;
          z-index: 2;
        }

        .large {
          max-height: 80vh;
          max-width: 80vw;
          min-width: 70vw;
        }

        .cancel {
          max-height: 120vh;
          max-width: 50vw;
        }

        .popup-side {
          height: 100vh;
          max-height: 100vh;
          width: 50vw;
        }
        .is-active {
          animation: slide-in-left 0.5s forwards;
          display: flex;
        }
        .is-active.right {
          animation: slide-in-right 0.5s forwards;
        }
        .background {
          background-color: rgba(10,10,10,.50);
          left: 0;
          position: absolute;
          top: 0;
        }
        .bg-is-active .background {
          max-height: 100vh;
          bottom: 0;
          right: 0;
        }
        .content {
          box-sizing: border-box;
          height: 100%;
          width: 100%;
        }
        .slide .content {
          height: 100vh;
        }
        .close {
          background-color: #fff;
          border-radius: 50px;
          color: #555;
          cursor: pointer;
          font: 500 2.2rem sans-serif;
          outline: none;
          position: absolute;
          right: 2.4rem;
          text-align: center;
          top: 1rem;
          width: 38px;
        }
        .close-wrapper {
          position: sticky;
          position: -webkit-sticky;
          top: 0;
          z-index: 1;
        }
        .hide-content {
          display: none;
        }

        @keyframes slide-in-left {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(0%); }
        }
        @keyframes slide-in-right {
          0% { transform: translateX(200%); }
          100% { transform: translateX(0%); }
        }

        @media screen and (max-width: 800px) {
          .modal {
            max-height: 75vh;
            max-width: 79vw;
          }
          .side {
            max-height: 100vh;
            width: 79vw;
          }
          .bg-is-active {
            max-height: 100vh;
            max-width: 100vw;
            width: 100vw;
          }
          .popup {
            max-height: 75vh;
            max-width: 75vw;
            min-height: 100px;
            min-width: 300px;
          }
          .popup-side {
            max-height: 100vh;
            width: 75vw;
          }
        }
      </style>
      <div class="modal">
        <div class="background"></div>
        <div class="popup">
          <div class="close-wrapper">
            <div class="close" aria-label="close">&#215;</div>
          </div>
          <div class="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `
    return template
  }



  resetScroll() {
    this.modalPopup.scroll({
      top: 0,
    })
  }

  static get observedAttributes() {
    return ['data-show', 'data-allow-close', 'data-position', 'data-allow-screen-click', 'data-is-cancel', 'data-is-large']
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render()
    }
  }

  disconnectedCallback() {
    this.btnClose.removeEventListener('click', this.closePopupBind)
    this.modalBG.removeEventListener('click', this.closePopupBind)
  }

  render() {
    let allowClose = true
    let showModal = false
    let position = 'center'
    let hideBG = false

    if(this.dataset.isLarge) {
      this.modalPopup.classList.add('large')
    } else if (this.dataset.isCancel) {
      this.modalPopup.classList.add('cancel')
    } else {
      this.modalPopup.classList.remove('large')
      this.modalPopup.classList.remove('cancel')
    }

    if (this.dataset.show && this.dataset.show.toLowerCase() === 'true') {
      showModal = true
    }
    if (this.dataset.allowClose && this.dataset.allowClose.toLowerCase() === 'false') {
      allowClose = false
    }
    if (this.dataset.allowScreenClick && this.dataset.allowScreenClick.toLowerCase() === 'true') {
      hideBG = true
    }
    if (this.dataset.position) {
      position = this.dataset.position.toLowerCase()
    }


    // reset Modal
    this.modal.classList.remove('is-active', 'side', 'right', 'left')
    this.modal.classList.add('bg-is-active')
    this.modalPopup.classList.remove('popup-side')
    this.btnClose.classList.remove('hide-content')

    if (!allowClose) {
      this.btnClose.classList.add('hide-content')
    }

    if (hideBG) {
      this.modal.classList.remove('bg-is-active')
    }

    if (position && ['right', 'left'].indexOf(position) > -1) {
      this.modal.classList.add('side', position)
      this.modalPopup.classList.add('popup-side')
    }

    if (showModal) {
      this.modal.classList.add('is-active')
    }
  }

  closePopup() {
    let allowClose = true
    if (this.dataset.allowClose && this.dataset.allowClose.toLowerCase() === 'false') {
      allowClose = false
    }
    if (allowClose) {
      this.dataset.show = false
    }
    this.dispatchEvent(new CustomEvent('popup-closed'))
  }

  isOpen() {
    return this.getAttribute('data-show') &&  this.dataset.show.toLowerCase() === 'true'
  }

})
}
