import { should as _should, use } from "chai";
import chaiHttp from "chai-http";
import axios from "axios";
use(chaiHttp);
const routes = {
  register: "auth/register",
  login: "auth/login"
};

const data = {
  password: "testpass",
  email1: `${Math.random()
    .toString(36)
    .substring(2, 15)}@mail.com`,
  email2: `${Math.random()
    .toString(36)
    .substring(2, 15)}@mail.com`,
  username: `${Math.random()
    .toString(36)
    .substring(2, 15)}`,
  name: "pedro perez"
};

const registerWithout = api =>
  it("REGISTER WITHOUT PASS a user @auth", done => {
    axios
      .post(api + routes.register, {
        name: data.name,
        email: data.email1
      })
      .then(res => {
        res.should.have.status(200);
        res.data.should.be.a("object");
        // global.loginId = res.data._id;
        done();
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response.status);
          console.log(err.response.statusText);
          console.log(err.response.data);
        }
        // console.log(err.response.status);
        // console.log(err.response.statusText);
      });
  });
const registerWith = api =>
  it("REGISTER WITH PASS a user @auth", done => {
    axios
      .post(api + routes.register, {
        name: data.name,
        email: data.email2,
        password: data.password
      })
      .then(res => {
        res.should.have.status(200);
        res.data.should.be.a("object");
        global.loginId = res.data._id;
        done();
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response.status);
          console.log(err.response.statusText);
          console.log(err.response.data);
        }
        // console.log(err.response.status);
        // console.log(err.response.statusText);
      });
  });

const login = api =>
  it("LOGIN with username a user @auth", done => {
    axios
      .post(api + routes.login, {
        username: data.email2,
        password: data.password
      })
      .then(res => {
        res.should.have.status(200);
        res.data.should.be.a("object");
        res.data.should.have.property("token");
        res.data.should.have.property("user");
        done();
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response.status);
          console.log(err.response.statusText);
          console.log(err.response.data);
        }
      });
  });
const loginEmail = api =>
  it("LOGIN with email a user @auth", done => {
    axios
      .post(api + routes.login, {
        email: data.email,
        password: data.password
      })
      .then(res => {
        res.should.have.status(200);
        res.data.should.be.a("object");
        res.data.should.have.property("token");
        res.data.should.have.property("user");
        done();
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response.status);
          console.log(err.response.statusText);
          console.log(err.response.data);
        }
      });
  });

export default {
  registerWith,
  registerWithout,
  login,
  loginEmail
};
