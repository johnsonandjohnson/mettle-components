const Debounce = (func, wait = 50) => {
  let timer
  return (...params) => {
    window.clearTimeout(timer)
    timer = window.setTimeout(func.bind.apply(func, [null].concat(params)), wait)
  }
}
export default Debounce
