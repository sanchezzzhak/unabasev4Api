import { should as _should, use } from 'chai';
import chaiHttp from 'chai-http';
import axios from 'axios';
use(chaiHttp);
import api from '../../src/config/api.js';
// import mailer from '../../src/lib/mailer';
import { send } from '../../src/config/mailer';

import template from '../../src/lib/mails';
const data = {
  to: 'sgomes@una.cl'
};

export default {
  send: () =>
    it(`SEND EMAIL by endpoint to ${data.to} @mailer`, done => {
      console.log(api);

      const text = template().register({});

      const msg = {
        to: data.to,
        subject: 'test mail from endpoint',
        html: text
      };
      axios
        .post(api.mailer.main, msg)
        .then(res => {
          res.envelope.from.should.be.a('string');
          res.envelope.to.should.be.a('array');
          done();
        })
        .catch(err => {
          // if (err.response) {
          //   console.log(err.response.status);
          //   console.log(err.response.statusText);
          //   console.log(err.response.data);
          // } else console.log(err);
        });
    }),
  sendFunc: () =>
    it(`SEND EMAIL by function to ${data.to} @mailer`, done => {
      const text = template().register({});

      const msg = {
        to: data.to,
        subject: 'test mail from function',
        html: text
      };

      send(msg)
        .then(res => {
          res.envelope.from.should.be.a('string');
          res.envelope.to.should.be.a('array');
          done();
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.status);
            console.log(err.response.statusText);
            console.log(err.response.data);
          } else console.log(err);
        });
    })
};
