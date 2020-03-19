import request from "./request";
import userData from "../lib/user/data";
import Tax from "../src/models/tax";
let authUser = "";

let data = {
  name: "test tax name",
  number: 17
};
let update = {
  name: "update tax name",
  number: 15
};
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

describe("****   TAX   ****", () => {
  it("CREATE a @tax", done => {
    request
      .post("/taxes")
      .set("authorization", authUser)
      .send(data)
      .end((err, res) => {
        if (err) done(err);
        res.status.should.equal(200);
        res.body.should.be.a("object");
        done();
      });
  });
  it("LIST all taxes @tax", done => {
    request
      .get("/taxes")
      .set("authorization", authUser)

      .end((err, res) => {
        if (err) done(err);
        res.status.should.equal(200);
        res.body.should.be.a("object");
        done();
      });
  });

  it("UPDATE  a update@tax", done => {
    let tax = new Tax(data);
    tax.save(err => {
      if (err) done(err);
      request
        .put("/taxes/" + tax.id)
        .set("authorization", authUser)
        .send(update)
        .end((err, res) => {
          if (err) done(err);
          res.status.should.equal(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  it("FIND BY QUERY taxes - name find@tax", done => {
    request
      .get("/taxes/find/" + data.name.slice(3, 7))
      .set("authorization", authUser)

      .end((err, res) => {
        if (err) done(err);
        res.status.should.equal(200);
        res.body.should.be.a("object");
        done();
      });
  });
  it("GET ONE tax by id getOne@tax", done => {
    let tax = new Tax(data);

    tax.save(err => {
      if (err) done(err);
      request
        .get("/taxes/" + tax.id)
        .set("authorization", authUser)

        .end((err, res) => {
          if (err) done(err);
          res.status.should.equal(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });
});
