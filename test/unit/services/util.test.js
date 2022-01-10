
import Util  from '../../../src/services/util.js'

describe('Util', () => {

  describe('functions', () => {

    it('should calculate the byte unit', async () => {
      let value = Util.bytesToSize(2)
      expect(value).toEqual('2 Bytes')
      value = Util.bytesToSize(0)
      expect(value).toEqual('N/A')
    })

    it('should return filtered object', () => {
      const arr = [{ foo: 'bar', zar: 'foo'}]
      const exp = [{ zar: 'foo' }]
      expect(Util.filterArrObjByKeys(['zar'], arr)).toEqual(exp)
    })

    it('should return random number', () => {
      const num = Util.getRandomNumberBetween()
      expect(num).toBeGreaterThan(-1)
      expect(num).toBeLessThan(10)
    })

    it('should determine if a DOM element is ready', done => {
      const elem = document.createElement('div')

      Util.insertedDomReady(elem).then(() => {
        expect(elem.nodeType).toEqual(Node.ELEMENT_NODE)
        elem.remove()
        done()
      })

      document.body.appendChild(elem)
      elem.innerHTML = 'test'
    })

    it('should return a boolean for isFunction', () => {
      expect(Util.isFunction(Util.getRandomNumberBetween)).toBeTrue()
    })

    it('should parse a json', async () => {
      const parsed = await Util.parseJSON('{"a":1,"b":{"c":3}}')
      expect(parsed).toEqual(jasmine.any(Object))
    })

    it('should return safe html', () => {
      expect(Util.safeInnerHTML('<')).toEqual('&lt;')
      expect(Util.safeInnerHTML('"')).toEqual('&quot;')
      expect(Util.safeInnerHTML('\'')).toEqual('&#39;')
    })

    it('should return parsed html', () => {
      const html = Util.stringToHTML('<p>\\Foo B\ar</\p>')
      expect(html).toEqual('<p>\\Foo Bar</p>')
    })

    it('should safely stringify json objects (explicit indentation of 1)', async () => {
      const input = { a: 1, b: { c: 3 } }
      const output = '{\n "a": 1,\n "b": {\n  "c": 3\n }\n}'
      const test = await Util.stringifyJSON(input, 1)
      expect(test).toEqual(output)
    })

    it('should safely stringify json objects (default indentation of 2)', async () => {
      const input = { a: 1, b: { c: 3 } }
      const output = '{\n  "a": 1,\n  "b": {\n    "c": 3\n  }\n}'
      const test = await Util.stringifyJSON(input)
      expect(test).toEqual(output)
    })

    it('should safely stringify json objects (explicit no indentation)', async () => {
      const input = { a: 1, b: { c: 3 } }
      const output = '{"a":1,"b":{"c":3}}'
      const test = await Util.stringifyJSON(input, 0)
      expect(test).toEqual(output)
    })

    it('should truncate a string', async () => {
      const value = Util.truncate('abc123', 3)
      expect(value).toEqual('abc...')
    })

    it('should generate a unique id', async () => {
      const uuid = Util.uuid()
      expect(uuid).toEqual(jasmine.any(String))
    })

  })
})
