import request from "./request";
import userData from "../lib/user/data";
import Relation from "../src/models/relation";
import User from "../src/models/user";
let authUser = "";

before(done => {
  Relation.deleteMany({}, err => {
    request
      .post("/auth/register")
      .send({ username: userData().username, email: userData().emails.default, name: userData().name })
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        authUser = res.body;
        res.status.should.equal(200);
        done();
      });
  });
});

describe("****   RELATION   ****", () => {
  it("CREATE a create@relation", done => {
    let user = new User(userData());
    user.save(err => {
      request
        .post("/relations")
        .set("authorization", authUser.access_token)
        .send({
          receptor: user._id.toString()
        })
        .end((err, res) => {
          if (err) {
            done(err);
          }
          res.status.should.equal(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });
  it("LIST all users get@relation", done => {
    request
      .get("/relations?petioner=" + authUser.user._id.toString())
      .set("authorization", authUser.access_token)

      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.status.should.equal(200);
        res.body.should.be.a("object");
        done();
      });
  });

  it("LIST all relations by state byState@relation", done => {
    request
      .get("/relations/state/accepted")
      .set("authorization", authUser.access_token)

      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.status.should.equal(200);
        res.body.should.be.a("object");
        done();
      });
  });
  it("GET one relation getOne@relation", done => {
    let user = new User(userData());
    user.save(err => {
      let relation = new Relation({
        petitioner: authUser.user.id,
        receptor: user.id
      });
      relation.save(err => {
        if (err) {
          done(err);
        }

        request
          .get("/relations/" + relation.id)
          .set("authorization", authUser.access_token)

          .end((err, res) => {
            if (err) {
              done(err);
            }
            res.status.should.equal(200);
            res.body.should.be.a("object");
            done();
          });
      });
    });
  });
  it("DISCONNECT   disconnect@relation", done => {
    let user = new User(userData());
    user.save(err => {
      let relation = new Relation({
        petitioner: authUser.user.id,
        receptor: user.id
      });
      relation.save(err => {
        if (err) {
          done(err);
        }
        request
          .delete("/relations/disconnect/" + user.id)
          .set("authorization", authUser.access_token)

          .end((err, res) => {
            if (err) {
              done(err);
            }
            res.status.should.equal(200);
            res.body.should.be.a("object");
            res.body.success.should.be.a("boolean");
            done();
          });
      });
    });
  });
  it("GET USER RELATIONS getByUser@relation", done => {
    let user = new User(userData());
    user.save(err => {
      let relation = new Relation({
        petitioner: authUser.user.id,
        receptor: user.id,
        isActive: true
      });
      relation.save(err => {
        if (err) {
          done(err);
        }
        console.log(user._id);
        request
          .get("/relations/user/" + user._id)
          .set("authorization", authUser.access_token)

          .end((err, res) => {
            if (err) {
              done(err);
            }
            res.status.should.equal(200);
            res.body.should.be.a("object");
            res.body.total.should.equal(1);
            done();
          });
      });
    });
  });
  it("Delete a relation by id delete@relation", done => {
    let user = new User(userData());
    user.save(err => {
      let relation = new Relation({
        petitioner: authUser.user.id,
        receptor: user.id
      });
      relation.save(err => {
        if (err) {
          done(err);
        }

        request
          .delete("/relations/" + relation.id)
          .set("authorization", authUser.access_token)

          .end((err, res) => {
            if (err) {
              done(err);
            }
            res.status.should.equal(200);
            res.body.should.be.a("object");
            done();
          });
      });
    });
  });
  it("change state of a relation state@relation", done => {
    let user = new User(userData());
    let isActive = false;
    user.save(err => {
      let relation = new Relation({
        petitioner: user.id,
        receptor: authUser.user._id.toString()
      });
      relation.save(err => {
        if (err) {
          done(err);
        }
        request
          .put("/relations/state")
          .set("authorization", authUser.access_token)

          .send({
            petitioner: user.id,
            isActive
          })
          .end((err, res) => {
            if (err) {
              done(err);
            }
            console.log(res.body);
            res.status.should.equal(200);
            res.body.should.be.a("object");
            res.body.should.have.property("petitioner");
            res.body.should.have.property("receptor");
            res.body.should.have.property("isActive");
            res.body.petitioner.should.be.a("string");
            res.body.receptor.should.be.a("string");
            res.body.isActive.should.be.a("boolean");
            res.body.isActive.should.equal(isActive);
            done();
          });
      });
    });
  });

  it("Delete all relation deleteAll@relation", done => {
    request
      .delete("/relations")
      .set("authorization", authUser.access_token)

      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.status.should.equal(200);
        res.body.should.be.a("object");
        done();
      });
  });
});
