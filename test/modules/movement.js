import { should as _should, use } from 'chai';
import chaiHttp from 'chai-http';
import axios from 'axios';
use(chaiHttp);
// import api from '../../src/config/api';

let movementId;
let linesIds;
let data = {
  name: 'test Movement name',
  date: new Date()
};
console.log('date');
console.log(data.date);
console.log(data.date.toISOString());
export default {
  create: api =>
    it('CREATE an movement @movement', function(done) {
      axios
        .post(api.movement.main, {
          name: data.name,
          description: 'test desc incm',
          dates: {
            expiration: data.date
          },
          // client: global.userId,
          // resposable: global.loginId,
          lines: [
            {
              name: 'tomate',
              tax: '5bbe5c732edaed42baf2b6c0',
              quantity: 2,
              price: 500,
              number: 19,
              item: '5bbe5c8f2edaed42baf2b6c2'
            },
            {
              name: 'cebolla',
              tax: '5bbe5c732edaed42baf2b6c0',
              quantity: 2,
              price: 500,
              number: 19,
              item: '5bbe5c682edaed42baf2b6bf'
            },
            {
              name: 'papa',
              tax: '5bbe5c732edaed42baf2b6c0',
              quantity: 2,
              price: 500,
              number: 19,
              item: '5bbe5c8b2edaed42baf2b6c1'
            }
          ],
          total: {
            net: 5000,
            tax: 5950
          },
          state: 'draft',
          currency: '5bbe5c8b2edaed42baf2b6c1'
        })
        .then(res => {
          movementId = res.data._id;
          res.should.have.status(200);
          res.data.should.be.a('object');
          linesIds = res.data.lines;
          done();
        })
        .catch(err => {
          console.log(err.response.status);
          console.log(err.response.statusText);
        });
    }),
  list: api =>
    it('LIST ALL movements @movement', function(done) {
      axios(api.movement.main)
        .then(res => {
          // console.log(res.data);
          res.should.have.status(200);
          res.data.should.be.a('object');
          res.data.docs.should.be.a('array');
          done();
        })
        .catch(err => {
          console.log(err.response.status);
          console.log(err.response.statusText);
        });
    }),

  update: api =>
    it('UPDATE an movement @movement', function(done) {
      axios
        .put(api.movement.main + movementId, {
          name: 'test inc updated',
          description: 'test desc incm updated',
          dates: {
            expiration: new Date()
          },
          client: global.loginId,
          resposable: global.userId,
          lines: [
            {
              _id: linesIds[0],
              name: 'tomate333',
              tax: '5bbe5c732edaed42baf2b6c0',
              quantity: 76,
              price: 1000000,
              item: '5bbe5c8f2edaed42baf2b6c2'
            },
            {
              _id: linesIds[1],
              name: 'cebolla333',
              tax: '5bbe5c732edaed42baf2b6c0',
              quantity: 23,
              price: 500999,
              item: '5bbe5c682edaed42baf2b6bf'
            },
            {
              _id: linesIds[2],
              name: 'papa333',
              tax: '5bbe5c732edaed42baf2b6c0',
              quantity: 56,
              price: 500666,
              item: '5bbe5c8b2edaed42baf2b6c1'
            }
          ],
          total: {
            net: 5000,
            tax: 5950
          },
          state: 'draft',
          currency: '5bbe5c8b2edaed42baf2b6c1'
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
          } else console.log(err);
        });
    }),
  null: api =>
    it('SET MOVEMENT TO NULL @movement', done => {
      axios
        .put(api.movement.main + movementId, {
          isActive: false
        })
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          res.data.isActive.should.be.a('boolean');
          done();
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.status);
            console.log(err.response.statusText);
          } else console.log(err);
        });
    }),
  find: api =>
    it('FIND BY QUERY movements @movement', done => {
      axios(`${api.movement.find}${data.name.slice(3, 7)}`)
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          res.data.docs.should.be.a('array');
          done();
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.status);
            console.log(err.response.statusText);
          } else console.log(err);
        });
    }),

  getOne: api =>
    it('GET ONE movement by id @movement', done => {
      axios(api.movement.main + movementId)
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          done();
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.status);
            console.log(err.response.statusText);
          } else console.log(err);
        });
    })
};
