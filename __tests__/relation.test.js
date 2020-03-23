import request from "./request";
import userData from "../lib/user/data";
import Relation from "../src/models/relation";
import User from "../src/models/user";
let authUser = "";

before(done => {
  // User.deleteMany({}, err => {
  request
    .post("/auth/register")
    .send({ username: userData().username, email: userData().emails.default, name: userData().name })
    .end(function(err, res) {
      if (err) {
        done(err);
      }
      authUser = res.body;
      res.status.should.equal(200);
      done();
    });
  // });
});

describe("****   RELATION   ****", () => {
  it("CREATE a create@relation", done => {
    let user = new User(userData());
    user.save(err => {
      request
        .post("/relations")
        .set("authorization", authUser.token)
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
      .set("authorization", authUser.token)

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
          .set("authorization", authUser.token)

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
          .set("authorization", authUser.token)

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
    user.save(err => {
      let relation = new Relation({
        petitioner: user.id,
        receptor: authUser.user.id
      });
      relation.save(err => {
        if (err) {
          done(err);
        }

        request
          .put("/relations/state")
          .set("authorization", authUser.token)

          .send({
            petitioner: user.id,
            isActive: false
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
  });

  it("Delete all relation deleteAll@relation", done => {
    request
      .delete("/relations")
      .set("authorization", authUser.token)

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
