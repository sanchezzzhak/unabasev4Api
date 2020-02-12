import { should as _should, use } from "chai";
import chaiHttp from "chai-http";
import { assert } from "chai";
const should = _should();
import axios from "axios";
use(chaiHttp);
// import api from '../../src/config/api';
// let userId;
const routes = {};
let data = {
  password: "test123",
  email: "sgomes@una.cl",
  name: "test surtest",
  username: "testUsername",
  idnumber: Math.floor(Math.random() * (99999999 - 111111111) + 111111111)
};

const createUser = api =>
  it("CREATE a user @user", done => {
    axios
      .post(api.user.main, {
        name: data.name,
        username: data.username,
        password: {
          hash: data.password
        },
        idnumber: data.idnumber,
        phones: [
          {
            phone: "+56909909909",
            label: "default"
          }
        ],
        emails: [
          {
            email: data.email,
            label: "default"
          }
        ],
        address: {
          street: "carmen covarrubias",
          number: 32,
          district: "ñuñoa",
          city: "Santiago",
          region: "Metropolitana",
          country: "Chile"
        }
      })
      .then(res => {
        res.should.have.status(200);
        res.data.should.be.a("object");
        res.data.type.should.equal("personal");
        // userId = res.data._id;
        global.userId = res.data._id;
        done();
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response.status);
          console.log(err.response.statusText);
          console.log(err.response.data);
        } else console.log(err);
      });
  });
const listUser = api =>
  it("LIST ALL users @user", done => {
    axios
      .get(api.user.main + `?type=personal`)
      .then(res => {
        res.should.have.status(200);
        res.data.should.be.a("object");
        res.data.docs.should.be.a("array");
        res.data.total.should.be.a("number");
        res.data.limit.should.be.a("number");
        res.data.page.should.be.a("number");
        res.data.pages.should.be.a("number");
        done();
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response.status);
          console.log(err.response.statusText);
          console.log(err.response.data);
        } else console.log(err);
      });
  });
const updateUser = api =>
  it("UPDATE a user @user", done => {
    axios
      .put(api.user.main + global.userId, {
        name: "test user updated",
        username: "test username updated",
        idnumber: "9999999991",
        phones: {
          default: "+56707707707"
        },
        emails: {
          default: "testupdated@mail.com"
        },
        address: {
          street: "carmen covarrubias updated",
          number: 64,
          district: "ñuñoa updated",
          city: "Santiago updated",
          region: "Metropolitana updated",
          country: "Chile updated"
        }
      })
      .then(res => {
        res.should.have.status(200);
        res.data.should.be.a("object");
        res.data.type.should.equal("personal");
        done();
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response.status);
          console.log(err.response.statusText);
          console.log(err.response.data);
        } else console.log(err);
      });
  });
const passwordUser = api =>
  it("CHANGE PASSWORD of a user @user", done => {
    axios
      .put(api.user.password + global.userId, {
        password: data.password,
        newPassword: "changedpassword123"
      })
      .then(res => {
        res.should.have.status(200);
        res.data.should.be.a("object");
        done();
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response.status);
          console.log(err.response.statusText);
          console.log(err.response.data);
        } else console.log(err);
      });
  });
const restartUser = api =>
  it("REQUEST RESTART PASSWORD of a user @user", done => {
    console.log(api.user.restartPassword + data.email);
    // console.log(`${api.user.restartPassword}/${global.userId}`);

    axios
      .post(api.user.restartPassword + data.email, {
        password: data.password,
        newPassword: "changedpassword123"
      })
      .then(res => {
        res.should.have.status(200);
        res.data.should.be.a("object");
        done();
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response.status);
          console.log(err.response.statusText);
          console.log(err.response.data);
        } else {
          console.log(err.request._currentURl);
          console.log(err.request.method);
        }
      });
  });
const getOneUser = api =>
  it("GET ONE user by id @user", done => {
    axios(api.user.main + global.userId)
      .then(res => {
        res.should.have.status(200);
        res.data.should.be.a("object");
        done();
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response.status);
          console.log(err.response.statusText);
        } else console.log(err);
      });
  });
const findUser = api =>
  it("FIND BY QUERY users -  name, username, email, idnumber @user", done => {
    axios(`${api.user.find}/${data.name}`)
      .then(res => {
        res.should.have.status(200);
        res.data.should.be.a("object");
        res.data.docs.should.be.a("array");
        res.data.total.should.be.a("number");
        res.data.limit.should.be.a("number");
        res.data.page.should.be.a("number");
        res.data.pages.should.be.a("number");
        done();
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response.status);
          console.log(err.response.statusText);
          console.log(err.response.data);
        } else console.log(err);
      });
  });

export default {
  createUser,
  listUser,
  updateUser,
  passwordUser,
  restartUser,
  getOneUser,
  findUser
};
