const nodemailer = require('nodemailer')
const USER_MAIL = 'wangqingzhu1025@126.com'

const transport = nodemailer.createTransport({
  host: 'smtp.126.com',
  secureConnection: true,
  port: 465,
  auth: {
    user: USER_MAIL,
    pass: 'woaini10021025'
  }
})

async function toSend({ to = 'wangqingzhu36@126.com', subject = '', text = '', html = '' }) {
  let options = {
    from: USER_MAIL,
    to,
    subject,
    text,
    html
  }
  return await transport.sendMail(options, (error, response) => {
    if (error) { toSend(options) }
  })
}

module.exports.toSend = toSend
