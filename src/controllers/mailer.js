import { send } from '../config/mailer';
import axios from 'axios';
// import { user, pass } from '../secret/mail';
import { envar } from '../lib/envar';

export default {
  send: (req, res) => {
    console.log('enter mailer');
    const mailOptions = {
      to: req.body.to, // list of receivers
      subject: req.body.subject, // Subject line
      html: req.body.html, // plain text body,
      user: envar.user,
      pass: envar.pass,
      service: 'gmail',
      from: 'Unabase  <notificaciones@unabase.com>'
    };

    // send(mailOptions)
    //   .then(data => {
    //     res.send(data);
    //   })
    //   .catch(err => {
    //     res.status(500).send(err);
    //   });
    axios
      .post('https://unabase.cc/mail', mailOptions, {
        headers: {
          'x-api-key': envar.mailApiKey
        }
      })
      .then(resp => {
        res.send(resp);
      })
      .catch(err => {
        console.log(envar;
        console.log(err);
        res.status(500).send(err);
      });
  }
};
// {
// 	"to": "simon@unabase.com",
// 	"subject": "test for microservice serveless mailer from aws lambda22",
// 	"html": "hello from the other side !!!",

// 		"pass": "$dVhsIYs#88B!!@iF2LO",
// 		"user": "noreply@unabxase.net",

// 	"service": "gmail",
// 	"from": "Unabase  <noreply@unabase.net>",
// 	"attachments": [
// 		{
// 			"filename": "test.pdf",
// 			"path": "http://www.extranjeria.gob.cl/media/2018/03/Requisitos-De-Permanencia-Definitiva-Por-Correo-Para-Residentes-Con-Contrato-Como-Dependiente.pdf"
// 		}
// 		]

// }
