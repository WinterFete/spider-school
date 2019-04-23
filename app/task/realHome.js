const cheerio = require('cheerio')
const schedule = require('node-schedule')

const http = require('../lib/http')
const email = require('../lib/email')
const isEmailSend = false
const currentDate = new Date('2019-4-12').getDate()

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
    isEmailSend =  true
  }
}

// Real notes
module.exports.notes = () => {
  let count = 0
  // schedule.scheduleJob('5 * * * * *', () => {
    sendMail()
    // console.log(`send${count++}`)
  // })
}
