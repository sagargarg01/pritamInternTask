const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
  var transport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'sagargarg1417',
      pass: process.env.GMAILPASS,
    },
  })

  const message = {
    from: `Sagar <sagargarg1417@gmail.com>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  }

  await transport.sendMail(message)
}

module.exports = sendEmail
