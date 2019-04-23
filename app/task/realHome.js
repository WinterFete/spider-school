const cheerio = require('cheerio')
const schedule = require('node-schedule')

const http = require('../lib/http')
const email = require('../lib/email')
const currentDate = new Date().getDate()

var isEmailSend = false

async function sendMail() {
  let data = await http.get('http://www.jnjy.net.cn/')
  let $ = cheerio.load(data)
  let $link = $('.links')
  let $linkSpan = $link.find('span')

  let forwardDate = new Date($linkSpan.first().text()).getDate()
  let absUri = 'http://www.jnjy.net.cn'

  $link.find('a').attr('href', (idx, value) => {
    return value.indexOf(absUri) < 0 ? `${absUri}${value}` : value
  })
  $linkSpan.removeAttr('style')

  if ((currentDate === forwardDate) && (!isEmailSend)) {
    await email.toSend({
      subject: '江宁教育服务平台',
      html: $('.links').html()
    })
    isEmailSend = true
  }
}

// Real notes
module.exports.notes = () => {
  let rule = new schedule.RecurrenceRule()
  let count = 0
  
  rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
  schedule.scheduleJob(rule, () => {
    sendMail()
    if (isEmailSend) {
      console.log(`${currentDate} date infomation send ok`)
    } else {
      console.log(`watch: ${count++}`)
    }
  })
}