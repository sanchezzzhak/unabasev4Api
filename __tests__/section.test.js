import request from "./request";
import userData from "../lib/user/data";
import Section from "../src/models/section";

let authUser = "";

before(done => {
  request
    .post("/auth/register")
    .send({ username: userData().username, email: userData().emails.default })
    .end(function(err, res) {
      if (err) {
        console.log("-------errr");
        console.log(err);
        done(err);
      }
      authUser = res.body.token;
      res.status.should.equal(200);
      done();
    });
});

describe("****   SECTION   ****", () => {
  it("CREATE SECTION  create@section", done => {
    request
      .post("/sections")
      .set("authorization", authUser)
      .send({
        name: "new section"
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
  it("LIST SECTION  list@section", done => {
    request
      .get("/sections")
      .set("authorization", authUser)

      .end((err, res) => {
        if (err) {
          done(err);
        }

        res.status.should.equal(200);
        res.body.should.be.a("object");
        res.body.docs.should.be.a("array");
        done();
      });
  });

  it("UPDATE SECTION  update@section", done => {
    let section = new Section({
      name: "this is a section"
    });
    section.save((err, section) => {
      if (err) {
        console.log("-------errr");
        console.log(err);
        done(err);
      }
      request
        .put("/sections/" + section.id)
        .set("authorization", authUser)
        .send({
          name: "updated section"
        })

        .end((err, res) => {
          if (err) {
            console.log("-------errr");
            console.log(err);
            done(err);
          }

          res.status.should.equal(200);
          res.body.should.be.a("object");
          res.body.name.should.be.a("string");
          // res.body.name.equal("updated section");
          expect(res.body.name).to.equal("updated section");
          done();
        });
    });
  });
});
