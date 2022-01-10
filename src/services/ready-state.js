import Observable from './observable.js'

const PREPARING = Symbol('PREPARING')
const READY = Symbol('READY')
const UPDATED = Symbol('UPDATED')

export default class ReadyState extends Observable {

  constructor() {
    super()
    if (this.instance) {
      return this.instance
    }
    this.instance = this
    this._currentState = this.READY
  }

  get PREPARING() {
    return PREPARING
  }

  get READY() {
    return READY
  }

  get UPDATED() {
    return UPDATED
  }

  get StateList() {
    return new Set([this.PREPARING, this.READY, this.UPDATED])
  }

  get CurrentState() {
    return this._currentState
  }

  changeState(state) {
    if (this._currentState !== state && this.StateList.has(state)) {
      this._currentState = state
      this.notify(this._currentState)
    }
  }

  preparing() {
    this.changeState(this.PREPARING)
  }

  ready() {
    this.changeState(this.READY)
  }

  updated() {
    this.changeState(this.UPDATED)
  }

}
