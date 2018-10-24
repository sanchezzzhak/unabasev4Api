import { send } from '../config/mailer';

export default {
  send: (req, res) => {
    console.log('enter mailer');
    const mailOptions = {
      to: req.body.to, // list of receivers
      subject: req.body.subject, // Subject line
      html: req.body.html // plain text body
    };

    send(mailOptions)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send(err);
      });
    // transporter.sendMail(mailOptions, function (err, info) {
    //   if(err)
    //     console.log(err)
    //   else
    //     console.log(info);
    // });
  }
};
