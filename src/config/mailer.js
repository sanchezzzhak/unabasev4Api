import nodemailer from 'nodemailer';
import {
  user,
  pass
} from '../secret/mail';
// import template from './mails';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  port: 465,
  auth: {
    user,
    pass
  }
}, {
  from: `Unabase  <${user}>`
});
const mailer = {
  send: message => {
    return new Promise((resolve, reject) => {
      transporter.sendMail(message, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }

        // console.log(nodemailer.getTestMessageUrl(info));

        // only needed when using pooled connections
        // transporter.close();
      });
    });
  }
};
// const mailOptions = {
//   from: 'sender@email.com', // sender address
//   to: 'to@email.com', // list of receivers
//   subject: 'Subject of your email', // Subject line
//   html: '<p>Your html here</p>'// plain text body
// };

// transporter.sendMail(mailOptions, function (err, info) {
//   if(err)
//     console.log(err)
//   else
//     console.log(info);
// });

export default mailer;