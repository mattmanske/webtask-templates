"use latest"

//-----------  ReadMe  -----------//

// Uses Mailer to send emails from website forms.

// Body Object
// -----------
// to       : Email address to send to [string]
// from     : Email address to send from [string]
// subject  : Email subject [string]
// template : Email template [string]

//-----------  Imports  -----------//

const Mailer = require('nodemailer@2.5.0')

//-----------  Export  -----------//

module.exports = (ctx, cb) => {
  try {
    const { to, from, subject, template, ...body } = JSON.parse(ctx.body_raw)

    const email = { to, from, subject, text: template }

    Mailer.createTransport().sendMail(email, (err, info) => {
      return (err) ? cb(err), cb(null, info)
    })
  } catch (err){
    return cb(err)
  }
}
