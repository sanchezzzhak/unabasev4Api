import request from "./request";
import userData from "../lib/user/data";
import Relation from "../src/models/relation";
let authUser = "";

before(done => {
  request
    .post("/auth/register")
    .send({ username: userData().username, email: userData().emails.default })
    .end(function(err, res) {
      if (err) done(err);
      authUser = res.body;
      res.status.should.equal(200);
      done();
    });
});

describe("****   RELATION   ****", () => {
  it("LIST all users get@relation", done => {
    request
      .get("/relations?petioner=" + authUser.user._id.toString())
      .set("authorization", authUser.token)

      .end((err, res) => {
        if (err) done(err);
        res.status.should.equal(200);
        res.body.should.be.a("object");
        done();
      });
  });
});
