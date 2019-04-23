const http = require('http')

/**
 * Get method
 * @param {String} url http request 'Get' method URI
 */
async function get(url) {
  return await new Promise((resolve, reject) => {
    http.get(url, res => {
      let resData

      res.setEncoding('utf8')
      res.on('data', data => { resData += data })
      res.on('end', () => { resolve(resData) })
      res.on('error', error => { reject(error) })
    }).on('error', error => { reject(error) })
      .end()
  })
}

module.exports = { get }
