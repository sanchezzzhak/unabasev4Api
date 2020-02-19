import chai from "chai";
import chaiHttp from "chai-http";
import axios from "axios";
chai.use(chaiHttp);

import userData from "../user/data";
import app from "../../src/server";
import User from "../../src/models/user";

beforeEach(done => {
  User.deleteMany({}, err => {
    done();
  });
});

// export const registerWithout = () => {
describe("auth without", () => {
  // console.log("-------------------");
  // console.log(userData().emails.default);
  it("REGISTER WITHOUT PASS a user without@auth", done => {
    chai
      .request(app)
      .post("/auth/register")
      .send({
        name: userData().name,
        email: userData().emails.default
      })
      .end((err, res) => {
        if (err) {
          console.log(err.response.status);
          console.log(err.response.statusText);
          console.log(err.response.data);
        }

        res.should.have.status(200);
        res.body.should.be.a("object");
        // global.loginId = res.data._id;
        done();
      });
  });
});
// };
