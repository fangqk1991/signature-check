# signature-check

## 签名算法
### 算法简介
参与签名的元素：HTTP 请求方式、API 路径、Query 参数，Body 文本内容、共享密钥

#### 签名步骤
**片段一**：将 HTTP 请求方式转化成大写，如 `GET`，`POST`，`PUT`，`DELETE`

**片段二**：将 queryParams 移除 key 为 `_token` 的键值对，将剩余键值按照 key=value 的格式，按 ASCII 字典序排列并以 `&` 符号拼接

```
a=1&b=2&c=3
```

**片段三**：收到的 Body 内容文本（注意，这里是原始的纯文本，通常由 POST 或 PUT 请求携带）

**片段四**：共享密钥（由服务方提供，并与客户共享）

* 将以上四个片段用 `,` 进行连接，并作 MD5 计算得到的结果即为签名
* 服务端使用密钥和上述签名算法针对指定请求计算出签名后，会将签名放置到请求的 queryParams 中，键值为 `_token`
* 客户端收到请求时，应使用密钥对接收的 HTTP 请求信息进行签名验证，若使用上述签名算法得出的签名与 queryParams 中携带的签名一致，则可以认为该请求是从服务方发出的合法请求

#### 示例代码
以下为签名算法，详情请见 `signature-check.js`

```
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
```

```
// 运行脚本
node signature-check.js
```

### Tips
* 若本地无 Node 环境，可粘贴 `signature-check.js` 代码到 <https://tool.lu/coderunner/> 在线运行

