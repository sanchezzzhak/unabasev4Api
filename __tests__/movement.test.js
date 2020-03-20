import request from "./request";
import Movement from "../src/models/movement";
import User from "../src/models/user";
import userData from "../lib/user/data";

let authUser = "";

before(done => {
  User.deleteMany({}, err => {
    request
      .post("/auth/register")
      .send({ username: userData().username, email: userData().emails.default })
      .end(function(err, res) {
        if (err) done(err);
        authUser = res.body.token;
        res.status.should.equal(200);
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

describe("****   MOVEMENT   ****", () => {
  it("CREATE MOVEMENT  create@movement", done => {
    request
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

        res.status.should.equal(200);
        res.body.should.be.a("object");
        done();
      });
  });

  it("LIST MOVEMENT  list@movement", done => {
    request
      .get("/movements")
      .set("authorization", authUser)

      .end((err, res) => {
        if (err) done(err);

        res.status.should.equal(200);
        res.body.should.be.a("object");
        res.body.docs.should.be.a("array");
        done();
      });
  });

  it("UPDATE MOVEMENT  update@movement", done => {
    let movement = new Movement({
      name: "asd",
      description: "",
      dates: {},
      state: "opportunity"
    });
    movement.save((err, movement) => {
      if (err) done(err);
      request
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

          res.status.should.equal(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  it("NULL MOVEMENT  null@movement", done => {
    let movement = new Movement({
      name: "asd",
      description: "",
      dates: {},
      state: "opportunity"
    });
    movement.save((err, movement) => {
      if (err) done(err);

      request
        .put("/movements/" + movement.id)
        .set("authorization", authUser)
        .send({
          isActive: false
        })

        .end((err, res) => {
          if (err) done(err);

          res.status.should.equal(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  it("FIND MOVEMENT  find@movement", done => {
    request
      .get("/movements")
      .set("authorization", authUser)

      .end((err, res) => {
        if (err) done(err);

        res.status.should.equal(200);
        res.body.should.be.a("object");
        res.body.docs.should.be.a("array");

        done();
      });
  });
});
