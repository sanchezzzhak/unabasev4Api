import request from "./request";
import userData from "../lib/user/data";
import Currency from "../src/models/currency";
import User from "../src/models/user";
let authUser = "";

let data = {
  name: "test currency name",
  decimal: ",",
  thousand: ".",
  prefix: "$",
  suffix: ".",
  presicion: 2,
  countryOrigin: "chile"
};
let update = {
  name: "updated currency name",
  decimal: ".",
  thousand: ",",
  prefix: "#",
  suffix: "/",
  presicion: 3,
  countryOrigin: "peru"
};
before(done => {
  User.deleteMany({}, err => {
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
});

describe("****   CURRENCY   ****", () => {
  it("CREATE a @currency", done => {
    request
      .post("/currencies")
      .set("authorization", authUser)
      .send({
        name: data.name,
        decimal: data.decimal,
        thousand: data.thousand,
        prefix: data.prefix,
        suffix: data.suffix,
        precision: data.precision,
        countryOrigin: data.countryOrigin
      })
      .end((err, res) => {
        if (err) done(err);
        res.status.should.equal(200);
        res.body.should.be.a("object");
        done();
      });
  });
  it("LIST all currencies @currency", done => {
    request
      .get("/currencies")
      .set("authorization", authUser)

      .end((err, res) => {
        if (err) done(err);
        res.status.should.equal(200);
        res.body.should.be.a("object");
        done();
      });
  });

  it("UPDATE  a @currency", done => {
    let currency = new Currency({
      name: data.name,
      decimal: data.decimal,
      thousand: data.thousand,
      prefix: data.prefix,
      suffix: data.suffix,
      precision: data.precision,
      countryOrigin: data.countryOrigin
    });
    currency.save(err => {
      if (err) done(err);
      request
        .put("/currencies/" + currency.id)
        .set("authorization", authUser)
        .send({
          name: update.name,
          decimal: update.decimal,
          thousand: update.thousand,
          prefix: update.prefix,
          suffix: update.suffix,
          precision: update.precision,
          countryOrigin: update.countryOrigin
        })
        .end((err, res) => {
          if (err) done(err);
          res.status.should.equal(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  it("FIND BY QUERY currencies - name find@currency", done => {
    request
      .get("/currencies/find/" + data.name.slice(3, 7))
      .set("authorization", authUser)

      .end((err, res) => {
        if (err) done(err);
        res.status.should.equal(200);
        res.body.should.be.a("object");
        done();
      });
  });

  it("GET ONE currency by id @currency", done => {
    let currency = new Currency({
      name: data.name,
      decimal: data.decimal,
      thousand: data.thousand,
      prefix: data.prefix,
      suffix: data.suffix,
      precision: data.precision,
      countryOrigin: data.countryOrigin
    });

    currency.save(err => {
      if (err) done(err);
      request
        .get("/currencies/" + currency.id)
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
