import chai from "chai";
import chaiHttp from "chai-http";
import Section from "../../src/models/section";

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
        Section.deleteMany({}, err => {
          done();
        });
      });
  });
});

describe("create section", () => {
  it("CREATE SECTION create@section", done => {
    chai
      .request(app)
      .post("/sections")
      .set("authorization", authUser)
      .send({
        name: "asd"
      })
      .end((err, res) => {
        if (err) done(err);

        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
});
