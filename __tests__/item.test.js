import request from "./request";
import Movement from "../src/models/movement";
import User from "../src/models/user";
import userData from "../lib/user/data";
import Item from "../src/models/item";
let authUser = "";
let data = {
  name: "test item name"
};
let update = {
  name: "updated item name"
};
before(done => {
  request
    .post("/auth/register")
    .send({ username: userData().username, email: userData().emails.default })
    .end(function(err, res) {
      if (err) done(err);
      authUser = res.body.token;
      res.status.should.equal(200);
      Movement.deleteMany({}, err => {
        done();
      });
    });
});
it("CREATE ITEM  create@item", done => {
  request
    .post("/items")
    .set("authorization", authUser)
    .send(data)
    .end((err, res) => {
      if (err) done(err);

      res.status.should.equal(200);
      res.body.should.be.a("object");
      done();
    });
});
it("LIST ITEM  list@item", done => {
  request
    .get("/items")
    .set("authorization", authUser)

    .end((err, res) => {
      if (err) done(err);

      res.status.should.equal(200);
      res.body.should.be.a("object");
      res.body.docs.should.be.a("array");
      done();
    });
});

it("UPDATE ITEM  update@item", done => {
  let item = new Item(data);
  item.save(err => {
    if (err) done(err);
    request
      .put("/items/" + item.id)
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

it("FIND BY QUERY items - name find@item", done => {
  request
    .get("/items/find/" + data.name.slice(3, 7))
    .set("authorization", authUser)

    .end((err, res) => {
      if (err) done(err);
      res.status.should.equal(200);
      res.body.should.be.a("object");
      done();
    });
});
it("GET ONE item by id getOne@item", done => {
  let item = new Item(data);
  item.save(err => {
    request
      .get("/items/" + item.id)
      .set("authorization", authUser)

      .end((err, res) => {
        if (err) done(err);

        res.status.should.equal(200);
        res.body.should.be.a("object");
        done();
      });
  });
});
