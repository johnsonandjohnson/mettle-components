const wait = ms => new Promise(r => setTimeout(r, ms))

function uuid() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, b =>
    (b ^ crypto.getRandomValues(new Uint16Array(1))[0] & 15 >> b / 4).toString(16))
}


function generateParagraph() {
  const nouns = ["bird", "clock", "boy", "plastic", "duck", "teacher", "lady", "professor", "hamster", "dog"]
  const verbs = ["kicked", "ran", "flew", "dodged", "sliced", "rolled", "died", "breathed", "slept", "killed"]
  const adjectives = ["beautiful", "lazy", "professional", "lovely", "cheerful", "rough", "soft", "hot", "vibrating", "slimy"]
  const adverbs = ["slowly", "elegantly", "precisely", "quickly", "sadly", "humbly", "proudly", "shockingly", "calmly", "passionately"]
  const preposition = ["down", "into", "up", "on", "upon", "below", "above", "through", "across", "towards"]
  const rand1 = Math.floor(Math.random() * 10)
  const rand2 = Math.floor(Math.random() * 10)
  const rand3 = Math.floor(Math.random() * 10)
  const rand4 = Math.floor(Math.random() * 10)
  const rand5 = Math.floor(Math.random() * 10)
  const rand6 = Math.floor(Math.random() * 10)
  return `The ${adjectives[rand1]}  ${nouns[rand2]} ${adverbs[rand3]}
        ${verbs[rand4]} because some ${nouns[rand1]} ${adverbs[rand1]}
        ${verbs[rand1]} ${preposition[rand1]} a ${adjectives[rand2]}
        ${nouns[rand5]} which, became a ${adjectives[rand3]} ${adjectives[rand4]}
        ${nouns[rand6]}.`
}

function generateHTMLParagraphs(amount = 1) {
  let paragraphs = []
  while(--amount) {
    paragraphs.push(`<p>${generateParagraph()}</p>`)
  }
  return paragraphs.join('')
}


function getRandomInt(min = 1, max = 10) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateTitle() {
  const nouns = ["bird", "clock", "boy", "plastic", "duck", "teacher", "lady", "professor", "hamster", "dog"]
  const adjectives = ["beautiful", "lazy", "professional", "lovely", "cheerful", "rough", "soft", "hot", "vibrating", "slimy"]
  const rand1 = Math.floor(Math.random() * 10)
  const rand2 = Math.floor(Math.random() * 10)
  return `The ${adjectives[rand1]} ${nouns[rand2]}`
}

function mockApiResponse(body = {}, status = 200, headers = { 'Content-type': 'application/json' }) {
  return new window.Response(JSON.stringify(body, null, 2), {
    headers,
    status
  })
}

function mockApiResponseBlob(blobData, status = 200, headers = { 'Content-type': 'application/octet-stream' }) {
  return new window.Response(new Blob([blobData]), {
    headers,
    status
  })
}

export {
  generateParagraph,
  generateHTMLParagraphs,
  generateTitle,
  getRandomInt,
  mockApiResponse,
  mockApiResponseBlob,
  uuid,
  wait
}
