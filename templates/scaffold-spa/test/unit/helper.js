const wait = ms => new Promise(r => setTimeout(r, ms))

function getRandomInt(min = 1, max = 10) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function mockApiResponse(body = {}, status = 200, headers = { 'Content-type': 'application/json' }) {
  return new globalThis.Response(JSON.stringify(body, null, 2), {
    headers,
    status
  })
}

function mockApiResponseBlob(blobData, status = 200, headers = { 'Content-type': 'application/octet-stream' }) {
  return new globalThis.Response(new Blob([blobData]), {
    headers,
    status
  })
}

function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b =>
    (b ^ crypto.getRandomValues(new Uint16Array(1))[0] & 15 >> b / 4).toString(16))
}

export {
  getRandomInt,
  mockApiResponse,
  mockApiResponseBlob,
  uuid,
  wait
}
