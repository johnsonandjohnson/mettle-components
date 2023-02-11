import Util from './util.js'

export default class Observable {

  constructor() {
    this.reset()
    this.includeErrorCount = false
  }

  reset() {
    this.observers = new Map()
    this.errors = new Map()
    this.completes = new Map()
    this.counter = new Map()
    this.maxLife = new Map()
    this.uidSet = new Set()
    this._currentSubject = undefined
  }

  subscribe(f) {
    let complete, error, next = f, useCurrentSubject = true
    if (!Util.isFunction(f)) {
      ({ next, error, complete, useCurrentSubject = true } = f)
    }
    const uid = Util.uuid()
    this.counter.set(uid, 0)
    this.uidSet.add(uid)

    if (Util.isFunction(next)) {
      this.observers.set(uid, next)
      if(undefined !== this._currentSubject && useCurrentSubject) {
        next.apply(null, this._currentSubject)
      }
    }
    if (Util.isFunction(error)) {
      this.errors.set(uid, error)
    }
    if (Util.isFunction(complete)) {
      this.completes.set(uid, complete)
    }
    if(undefined !== this._currentSubject && useCurrentSubject) {
      this.updateCount(uid)
    }
    const methods = {
      only: (times, includeErrors = false) => {
        this.includeErrorCount = includeErrors
        this.only(uid, times)
        return methods
      },
      uid,
      unsubscribe: this.unsubscribe.bind(this, uid),
    }

    return methods
  }

  updateCount(uid = null) {
    Array.from(this.uidSet).filter(uuid => uid ? uuid===uid : true).forEach(uid => {
      const count = ~~this.counter.get(uid) + 1
      this.counter.set(uid, count)
      this.only(uid)
    })
  }

  unsubscribe(uid) {
    const complete = this.completes.get(uid)
    if (Util.isFunction(complete)) {
      complete()
    }
    this.observers.delete(uid)
    this.errors.delete(uid)
    this.completes.delete(uid)
    this.counter.delete(uid)
    this.maxLife.delete(uid)
    this.uidSet.delete(uid)
  }

  complete() {
    this.completes.forEach(observer => observer())
    this.reset()
  }

  notify() {
    const subject = Array.from(arguments)
    this._currentSubject = subject
    this.observers.forEach(observer => observer.apply(null, subject))
    this.updateCount()
  }

  notifyError() {
    const subject = Array.from(arguments)
    this.errors.forEach(observer => observer.apply(null, subject))
    if(this.includeErrorCount) {
      this.updateCount()
    }
  }

  only(uid, times) {
    if (!isNaN(times) && times > 0) {
      this.maxLife.set(uid, times)
    }
    if (this.maxLife.has(uid)) {
      const maxCount = ~~this.maxLife.get(uid)
      const count = ~~this.counter.get(uid)
      if (maxCount > 0 && count >= maxCount) {
        this.unsubscribe(uid)
      }
    }
  }
}
