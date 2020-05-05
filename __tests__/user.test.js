import request from "./request";
import userData from "../lib/user/data";
import User from "../src/models/user";
let authUser = "";
let data = userData();
before(done => {
  // User.deleteMany({}, err => {
  // if (err) {
  //   console.log("-------errr");
  //   console.log(err);
  //   done(err);
  // }
  request
    .post("/auth/register")
    .send({ username: userData().username, email: userData().emails.default, password: data.password })
    .end(function (err, res) {
      if (err) {
        done(err);
      }
      authUser = res.body;
      res.status.should.equal(200);
      done();
    });
  // });
});
describe("****   USER   ****", () => {
  it("LIST all users @user", done => {
    request
      .get("/users")
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

  it("UPDATE  update@user", done => {
    let user = new User(userData());
    let update = userData();
    user.save(err => {
      if (err) {
        done(err);
      }
      request
        .put("/users/" + user.id)
        .set("authorization", authUser.access_token)
        .send(update)
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
  it("CHANGE PASSWORD of a user password@user", done => {
    let update = userData();

    request
      .put("/users/password")
      .set("authorization", authUser.access_token)
      .send({
        password: data.password,
        newPassword: update.password
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
  //TODO refactor so the test can use ther authuser global of this file
  it("CREATE PASSWORD of a user passwordCreate@user", done => {
    request
      .post("/auth/register")
      .send({ username: userData().username, email: userData().emails.default, noPassword: true })
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        let newUser = res.body;
        res.status.should.equal(200);

        let update = userData();
        request
          .put("/users/password")
          .set("authorization", newUser.access_token)
          .send({
            newPassword: update.password
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
  it("GET ONE user by id getOne@user", done => {
    let user = new User(data);

    user.save(err => {
      if (err) {
        done(err);
      }
      request
        .get("/users/" + user.id)
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

  it("GET ONE user by username NO_AUTH username@user", done => {
    let data = userData();
    let user = new User(data);

    user.save(err => {
      if (err) {
        done(err);
      }
      request
        .get("/users/profile/" + data.username)
        // .set("authorization", authUser.access_token)

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

  it("FIND BY QUERY users -  name, username, email, idnumber find@user", done => {
    request
      .get("/users/find/" + data.name.first.slice(3, 7))
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
