const cheerio = require('cheerio')
const schedule = require('node-schedule')

const http = require('../lib/http')
const email = require('../lib/email')

var currentHtml
var isEmailSend = false

async function sendMail() {
  let absUri = 'http://www.jnjy.net.cn'
  let data = await http.get(absUri)

  let $ = cheerio.load(data)
  let $link = $('.links')
  let forwardHtml

  $link.find('a').attr('href', (idx, value) => {
    return value.indexOf(absUri) < 0 ? `${absUri}${value}` : value
  })
  $link.find('span').removeAttr('style')

  forwardHtml = $('.links').html()
  if (!currentHtml) {
    currentHtml = forwardHtml
  }

  if (currentHtml === forwardHtml) {
    await email.toSend({
      subject: '江宁教育服务平台',
      html: forwardHtml
    })
    isEmailSend = true
  } else {
    isEmailSend = false
  }
}

// Real notes
module.exports.notes = () => {
  let rule = new schedule.RecurrenceRule()
  let count = 1

  rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
  schedule.scheduleJob(rule, () => {
    sendMail()
    if (isEmailSend) {
      console.log('Date infomation send ok')
    } else {
      console.log(`watch: ${count++}`)
    }
  })
}
