import { send } from "../config/mailer";
import axios from "axios";
// import { user, pass } from '../secret/mail';
import envar from "../lib/envar";

export const sendMail = (req, res, next) => {
  console.log("enter mailer");
  console.log(envar().mailApiKey);
  const mailOptions = {
    to: req.body.to, // list of receivers
    subject: req.body.subject, // Subject line
    html: req.body.html, // plain text body,
    user: envar().MAIL_USER,
    pass: envar().MAIL_PASS,
    service: "gmail",
    from: "Unabase  <notificaciones@unabase.com>"
  };

  // HECTOR - CAMBIE EL METODO DE ENVIO DE EMAIL EL CLASICO, CON NODEMAILER TEMPORALMENTE PARA PRUEBAS
  send(mailOptions)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send(err);
    });
  // axios
  //   .post("https://unabase.cc/mail", mailOptions, {
  //     headers: {
  //       "x-api-key": envar().mailApiKey
  //     }
  //   })
  //   .then(resp => {
  //     res.send(resp.data);
  //   })
  //   .catch(err => {
  //     console.log("envar:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
  //     // console.log(envar);
  //     console.log("err");
  //     console.log(err);
  //     res.status(500).send(err.Error);
  //   });
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
