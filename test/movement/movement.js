import chai from "chai";
import chaiHttp from "chai-http";
import Movement from "../../src/models/movement";
import User from "../../src/models/user";
import app from "../../src/server";
import userData from "../user/data";

chai.use(chaiHttp);
let authUser = "";
before(done => {
  User.deleteMany({}, err => {
    chai
      .request(app)
      .post("/auth/register")
      .send({ username: userData().username, email: userData().emails.default })
      .end(function(err, res) {
        authUser = res.body.token;

        chai.expect(res.statusCode).to.equal(200);
        Movement.deleteMany({}, err => {
          done();
        });
      });
  });
});
// beforeEach(done => {
//   Movement.deleteMany({}, err => {
//     done();
//   });
// });

describe("create movement", () => {
  it("CREATE MOVEMENT  create@movement", done => {
    chai
      .request(app)
      .post("/movements")
      .set("authorization", authUser)
      .send({
        name: "asd",
        description: "",
        dates: {},
        state: "opportunity",
        currency: ""
      })
      .end((err, res) => {
        if (err) done(err);

        res.should.have.status(200);
        res.body.should.be.a("object");
        // res.body.should.have.property("token");
        // res.body.should.have.property("user");
        // res.body.token.should.be.a("string");
        // res.body.user.security.hasPassword.should.be.false;
        // res.body.user.security.isRandom.should.be.true;
        done();
      });
  });
});

describe("list movement", () => {
  it("LIST MOVEMENT  list@movement", done => {
    chai
      .request(app)
      .get("/movements")
      .set("authorization", authUser)

      .end((err, res) => {
        if (err) done(err);

        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.docs.should.be.a("array");
        // res.body.should.have.property("token");
        // res.body.should.have.property("user");
        // res.body.token.should.be.a("string");
        // res.body.user.security.hasPassword.should.be.false;
        // res.body.user.security.isRandom.should.be.true;
        done();
      });
  });
});

describe("update movement", () => {
  it("UPDATE MOVEMENT  update@movement", done => {
    let movement = new Movement({
      name: "asd",
      description: "",
      dates: {},
      state: "opportunity"
    });
    movement.save((err, movement) => {
      if (err) done(err);
      chai
        .request(app)
        .put("/movements/" + movement.id)
        .set("authorization", authUser)
        .send({
          name: "asd",
          description: "",
          dates: {},
          state: "opportunity"
        })

        .end((err, res) => {
          if (err) done(err);

          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });
});

describe("null movement", () => {
  it("NULL MOVEMENT  null@movement", done => {
    let movement = new Movement({
      name: "asd",
      description: "",
      dates: {},
      state: "opportunity"
    });
    movement.save((err, movement) => {
      if (err) done(err);
      chai
        .request(app)
        .put("/movements/" + movement.id)
        .set("authorization", authUser)
        .send({
          isActive: false
        })

        .end((err, res) => {
          if (err) done(err);

          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });
});

describe("find movement", () => {
  it("FIND MOVEMENT  find@movement", done => {
    chai
      .request(app)
      .get("/movements")
      .set("authorization", authUser)

      .end((err, res) => {
        if (err) done(err);

        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.docs.should.be.a("array");

        done();
      });
  });
});
