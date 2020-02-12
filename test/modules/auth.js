import chai from "chai";
import chaiHttp from "chai-http";
import axios from "axios";
import app from "../../src/app";
chai.use(chaiHttp);
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

export const registerWithout = api =>
  it("REGISTER WITHOUT PASS a user without@auth", done => {
    chai
      .request(app)
      .post("/auth/register")
      .send({
        name: data.name,
        email: data.email1
      })
      .end((err, res) => {
        if (err) {
          console.log(err.response.status);
          console.log(err.response.statusText);
          console.log(err.response.data);
        }

        res.should.have.status(200);
        res.body.should.be.a("object");
        // global.loginId = res.data._id;
        done();
      });
  });

export const registerWith = api =>
  it("REGISTER WITH PASS a user with@auth", done => {
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

export const login = api =>
  it("LOGIN with username a user login@auth", done => {
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
export const loginEmail = api =>
  it("LOGIN with email a user mail@auth", done => {
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

// export default {
//   registerWith,
//   registerWithout,
//   login,
//   loginEmail
// };
