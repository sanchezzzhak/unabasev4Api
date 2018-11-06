import nodemailer from 'nodemailer';
import { user, pass } from '../secret/mail';

const transporter = nodemailer.createTransport(
  {
    service: 'gmail',
    auth: {
      user,
      pass
    }
  },
  {
    from: `Unabase  <${user}>`
  }
);
const mailer = {
  send: message => {
    return new Promise((resolve, reject) => {
      transporter.sendMail(message, (err, info) => {
        if (err) {
          console.log('err occurred trying to send');
          console.log(err.message);
          reject(err);
        } else {
          console.log(
            'Message sent successfully!--------------------------------'
          );
          console.log(message.to);
          console.log(info);
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
