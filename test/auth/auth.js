import chai from "chai";
import chaiHttp from "chai-http";
import axios from "axios";
chai.use(chaiHttp);

import userData from "../user/data";
import app from "../../src/server";
import User from "../../src/models/user";

const userLogin = userData().username;
const passwordLogin = userData().password;
const emailLogin = userData().emails.default;

beforeEach(done => {
  User.deleteMany({}, err => {
    console.log(err);
    if (err) done(err);
    done();
  });
});

describe("auth without", () => {
  it("REGISTER WITHOUT PASS a user without@auth", done => {
    chai
      .request(app)
      .post("/auth/register")
      .send({
        name: {
          first: userData().name,
          middle: userData().name,
          last: userData().name,
          secondLast: userData().name
        },
        email: userData().emails.default
      })
      .end((err, res) => {
        if (err) done(err);

        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("token");
        res.body.should.have.property("user");
        res.body.token.should.be.a("string");
        res.body.user.security.hasPassword.should.be.false;
        res.body.user.security.isRandom.should.be.true;
        done();
      });
  });
});

describe("auth with password", () => {
  it("REGISTER WITH PASS a user with@auth", done => {
    chai
      .request(app)
      .post("/auth/register")
      .send({
        name: {
          first: userData().name,
          middle: userData().name,
          last: userData().name,
          secondLast: userData().name
        },
        email: userData().emails.default,
        password: userData().password
      })
      .end((err, res) => {
        if (err) done(err);

        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("token");
        res.body.should.have.property("user");
        res.body.token.should.be.a("string");
        res.body.user.security.hasPassword.should.be.true;
        res.body.user.security.isRandom.should.be.false;
        done();
      });
  });
});

describe("auth login", () => {
  it("LOGIN with username a user login@auth", done => {
    chai
      .request(app)
      .post("/auth/register")
      .send({
        username: userLogin,
        email: emailLogin,
        password: passwordLogin
      })
      .end((err, res) => {
        if (err) done(err);
        chai
          .request(app)
          .post("/auth/login")
          .send({
            username: userLogin,
            password: passwordLogin
          })
          .end((err, res) => {
            if (err) done(err);

            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("token");
            res.body.should.have.property("user");
            done();
          });
      });
  });
});

describe("auth login with email", () => {
  it("LOGIN with email a user mail@auth", done => {
    chai
      .request(app)
      .post("/auth/register")
      .send({
        username: userLogin,
        email: emailLogin,
        password: passwordLogin
      })
      .end((err, res) => {
        if (err) done(err);
        chai
          .request(app)
          .post("/auth/login")
          .send({
            username: emailLogin,
            password: passwordLogin
          })
          .end((err, res) => {
            if (err) done(err);

            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("token");
            res.body.should.have.property("user");
            done();
          });
      });
  });
});
