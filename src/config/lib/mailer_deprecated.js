import { createTransport } from 'nodemailer';

const { log } = console;

import { mail, host as _host } from '../main.js';

import { readFileSync } from 'fs';
import $ from 'cheerio';
import bool from 'normalize-bool';
import pug from 'pug';

console.log(envar());
export const transporter = createTransport(
  {
    host: mail.host,
    port: mail.port,
    secure: mail.secure,
    ignoreTLS: true,
    auth: {
      user: mail.user,
      pass: mail.pass
    },
    logger: false,
    debug: false // include SMTP traffic in the logs
  },
  {
    // default message fields

    // sender info
    from: `Unabase M <${mail.user}>`
  }
);
// module.exports = transporter;

export function send(message, res) {
  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log('Error occurred trying to send');
      console.log(error.message);
      return process.exit(1);
    }

    console.log('Message sent successfully!--------------------------------');
    console.log(message.to);
    // console.log(nodemailer.getTestMessageUrl(info));

    // only needed when using pooled connections
    // transporter.close();
  });
}

export function sendTemplate(message, res) {
  let template = readFileSync(
    __dirname.replace('controllers/lib', 'views') + '/mails/base.html',
    { encoding: 'utf-8' }
  );

  let templateText = $(template);
  templateText
    .find('#uLogo')
    .attr('src', 'http://' + _host + '/img/logom2.png');

  templateText
    .find('#uBody')
    .empty()
    .append(message.html);
  templateText
    .find('#uFooter')
    .append(message.footer)
    .find('div')
    .css({
      height: '3.5rem'
    });
  templateText.find('.uNoDeco').css({
    'text-decoration': 'none'
  });
  templateText.find('.uBtn').css({
    'background-color': '#00a972',
    color: 'white',
    padding: '10px',
    'border-radius': '5px',
    'font-weight': 'bold'
  });
  templateText.find('.uLink').css({
    color: '#00a972',
    'font-weight': 'bold'
  });
  message.html = templateText.html();

  return message;
  // transporter.sendMail(message, (error, info) => {
  // 	if (error) {
  // 		console.log('Error occurred trying to send template');
  // 		console.log(error.message);
  // 		return false;
  // 	}

  // 	console.log('>>>>>>>>>>>>>>>>>>Message sent successfully!<<<<<<<<<<<');
  // 	console.log(message.to);
  // 	return info;
  // })
}
