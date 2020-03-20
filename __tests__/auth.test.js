import request from "./request";
import userData from "../lib/user/data";

describe("****   AUTH   ****", () => {
  it("REGISTER WITHOUT PASS a user without@auth", done => {
    request
      .post("/auth/register")
      .set("Accept", "application/json")
      .send({
        name: {
          first: userData().name.first,
          middle: userData().name.middle,
          last: userData().name.last,
          secondLast: userData().name.secondLast
        },
        email: userData().emails.default
      })
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.a("object");
        res.body.token.should.be.a("string");
        res.body.user.should.be.a("object");
        res.body.user.security.hasPassword.should.be.false;
        res.body.user.security.isRandom.should.be.true;
        done();
      });
  });

  it("REGISTER WITH PASS a user with@auth", done => {
    request
      .post("/auth/register")
      .send({
        name: {
          first: userData().name.first,
          middle: userData().name.middle,
          last: userData().name.last,
          secondLast: userData().name.secondLast
        },
        email: userData().emails.default,
        password: userData().password
      })
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.a("object");
        res.body.token.should.be.a("string");
        res.body.user.should.be.a("object");
        res.body.user.security.hasPassword.should.be.true;
        res.body.user.security.isRandom.should.be.false;
        done();
      });
  });
});
