const crypto = require('crypto')
const urlHelper = require('url')

const _secret = '11f65b7039768d970d40051fe6bb3d95'

const sign = (method, apiPath, queryParams, bodyText) => {
  method = method.toUpperCase()

  queryParams = Object.assign({}, queryParams)
  delete queryParams['_token']
  const sortedKeys = Object.keys(queryParams).sort()
  const query = sortedKeys.map(key => {
    return `${key}=${queryParams[key]}`
  }).join('&')

  const items = []
  items.push(method)
  items.push(query)
  items.push(bodyText)
  items.push(_secret)
  return crypto.createHash('md5').update(items.join(',')).digest('hex')
}

const method = 'POST'
const url = 'https://example.com/api/test/http/test_post_json?_expires=1572528461&_token=0d92f237ae715ad5ff78aa2e5703f486'
const urlObj = urlHelper.parse(url, true)
const apiPath = urlObj.pathname
const queryParams = urlObj.query
const bodyText = '{"issueId":1,"issueSummary":"this is summary"}';
const verifyToken = sign(method, apiPath, queryParams, bodyText)
console.log(`请求方式: `, method)
console.log(`API 路径: `, apiPath)
console.log(`Query 参数: `, queryParams)
console.log(`Body 文本内容: `, bodyText)
console.log(`共享密钥: `, _secret)
console.log(`Token in Query: `, queryParams['_token'])
console.log(`Token verified: `, verifyToken)
