import { should as _should, use } from 'chai';
import chaiHttp from 'chai-http';
import axios from 'axios';
use(chaiHttp);
import api from '../../src/config/api';

let businessId;
let data = {
  password: 'test123'
};

export default {
  create: api =>
    it('CREATE business @business', done => {
      axios
        .post(api.user.main, {
          name: 'test business',
          username: 'businessusername',
          password: {
            hash: data.password
          },
          idnumber: '255456562',
          type: 'business',
          phones: {
            default: '+56909909909'
          },
          emails: {
            default: 'business@mail.com'
          },
          address: {
            street: 'carmen covarrubias',
            number: 32,
            district: 'ñuñoa',
            city: 'Santiago',
            region: 'Metropolitana',
            country: 'Chile'
          }
        })
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          res.data.type.should.equal('business');
          global.businessId = res.data._id;
          done();
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.status);
            console.log(err.response.statusText);
            console.log(err.response.data);
          } else console.log(err);
        });
    }),

  list: api =>
    it('LIST ALL business @business', done => {
      axios
        .get(api.user.main + `?type=business`)
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          res.data.docs.should.be.a('array');
          res.data.total.should.be.a('number');
          res.data.limit.should.be.a('number');
          res.data.page.should.be.a('number');
          res.data.pages.should.be.a('number');
          done();
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.status);
            console.log(err.response.statusText);
            console.log(err.response.data);
          } else console.log(err);
        });
    }),

  update: api =>
    it('UPDATE a business @business', done => {
      axios
        .put(api.user.main + global.businessId, {
          name: 'test business updated',
          username: 'businessUsernameUpdated',
          idnumber: '9999999991',
          phones: {
            default: '+56707707707'
          },
          emails: {
            default: 'testupdated@mail.com'
          },
          address: {
            street: 'carmen covarrubias updated',
            number: 64,
            district: 'ñuñoa updated',
            city: 'Santiago updated',
            region: 'Metropolitana updated',
            country: 'Chile updated'
          }
        })
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          res.data.type.should.be.a('string');
          res.data.type.should.equal('business');
          done();
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.status);
            console.log(err.response.statusText);
            console.log(err.response.data);
          } else console.log(err);
        });
    }),

  password: api =>
    it('CHANGE PASSWORD of a business @business', done => {
      axios
        .put(api.user.password + global.businessId, {
          password: data.password,
          newPassword: 'changedpassword123'
        })
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          done();
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.status);
            console.log(err.response.statusText);
            console.log(err.response.data);
          } else console.log(err);
        });
    }),

  user: api =>
    it('ASOCIATE A USER TO A BUSINESS @business', done => {
      axios
        .put(api.user.user + global.businessId, {
          user: global.userId
        })
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          res.data.type.should.be.a('string');
          res.data.type.should.equal('business');
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
