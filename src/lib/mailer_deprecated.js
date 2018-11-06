import { send } from '../config/mailer';
// import template from './mails';

export default msg =>
  new Promise((resolve, reject) => {
    console.log('enter mailer');
    const mailOptions = {
      to: msg.to, // list of receivers
      subject: msg.subject, // Subject line
      html: msg.html // plain text body
    };

    send(mailOptions)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
