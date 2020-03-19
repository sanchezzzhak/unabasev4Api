import request from "./request";
import userData from "../lib/user/data";
import User from "../src/models/user";
let authUser = "";
before(done => {
  request
    .post("/auth/register")
    .send({ username: userData().username, email: userData().emails.default })
    .end(function(err, res) {
      if (err) done(err);
      authUser = res.body.token;
      res.status.should.equal(200);
      done();
    });
});
describe("****   USER   ****", () => {
  it("LIST all users @user", done => {
    request
      .get("/users")
      .set("authorization", authUser)

      .end((err, res) => {
        if (err) done(err);
        res.status.should.equal(200);
        res.body.should.be.a("object");
        done();
      });
  });

  it("UPDATE  update@user", done => {
    let user = new User(userData());
    let update = userData();
    user.save(err => {
      if (err) done(err);
      request
        .put("/users/" + user.id)
        .set("authorization", authUser)
        .send(update)
        .end((err, res) => {
          if (err) done(err);
          console.log(res);
          res.status.should.equal(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });
});
