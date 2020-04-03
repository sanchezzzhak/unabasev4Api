import request from "./request";
import userData from "../lib/user/data";
import User from "../src/models/user";
import Section from "../src/models/section";
import Link from "../src/models/link";
let authUser = "";
let data = {
  url: "https://myurl.com",
  name: "testing link",
  type: "video",
  members: []
};
let updateData = {
  url: "https://myurlUpdated.com",
  name: "updated testing link",
  type: "image",
  members: []
};
let sectionData = {
  name: "photographer"
};
before(done => {
  // User.deleteMany({}, err => {
  Link.deleteMany({}, err => {
    request
      .post("/auth/register")
      .send({ username: userData().username, email: userData().emails.default, name: userData().name })
      .end(function(err, res) {
        if (err) {
          done(err);
        }
        authUser = res.body;
        res.status.should.equal(200);
        done();
      });
  });
  // });
});

describe("****   LINK   ****", () => {
  it("CREATE LINK  create@link", done => {
    let user = new User(userData());
    user.save(err => {
      if (err) done(err);
      let section = new Section({
        name: sectionData.name
      });

      section.save(err => {
        if (err) done(err);
        data.members.push({
          user: user._id.toString(),
          positions: [section._id.toString()]
        });
        request
          .post("/links")
          .set("authorization", authUser.token)
          .send(data)
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
  });

  it("LIST LINK  list@link", done => {
    request
      .get("/links")
      .set("authorization", authUser.token)

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
  it("GET ONE LINK  getOne@link", done => {
    let link = new Link(data);
    link.save(err => {
      if (err) done(err);
      request
        .get("/links/" + link._id)
        .set("authorization", authUser.token)

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

  it("GET BY USER  getUser@link", done => {
    let user = new User(userData());
    user.save(err => {
      if (err) done(err);
      let section = new Section({
        name: sectionData.name
      });

      data.user = user._id;

      let link = new Link(data);

      link.save(err => {
        request
          .get("/links/user/" + user._id)
          .set("authorization", authUser.token)
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
  });
  it("GET BY MEMBER  getMember@link", done => {
    let user = new User(userData());
    user.save(err => {
      if (err) done(err);
      let section = new Section({
        name: sectionData.name
      });

      data.user = authUser.user._id;

      data.members.push({
        user: user._id.toString(),
        positions: [section._id.toString()]
      });
      let link = new Link(data);

      link.save(err => {
        request
          .get("/links/member/" + user._id)
          .set("authorization", authUser.token)
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
  });
  it("DELETE ONE LINK  delete@link", done => {
    let link = new Link(data);
    link.save(err => {
      if (err) done(err);
      request
        .delete("/links/" + link._id)
        .set("authorization", authUser.token)

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

  it("UPDATE ONE LINK  update@link", done => {
    let link = new Link(data);
    link.save(err => {
      if (err) done(err);
      request
        .put("/links/" + link._id.toString())
        .set("authorization", authUser.token)
        .send(updateData)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          console.log(err);
          console.log(res.body);
          res.status.should.equal(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  it("ADD MEMBER LINK  addMember@link", done => {
    let user = new User(userData());
    user.save(err => {
      if (err) done(err);
      let section = new Section({
        name: sectionData.name
      });

      section.save(err => {
        if (err) done(err);

        let link = new Link(data);
        link.save(err => {
          let data = {
            user: user._id.toString(),
            positions: [section._id.toString()]
          };
          request
            .put("/links/member/add/" + link._id)
            .set("authorization", authUser.token)
            .send(data)
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
    });
  });

  it("REMOVE MEMBER LINK  removeMember@link", done => {
    let user = new User(userData());
    user.save(err => {
      if (err) done(err);
      let section = new Section({
        name: sectionData.name
      });

      section.save(err => {
        if (err) done(err);

        data.members.push({
          user: user._id.toString(),
          positions: [section._id.toString()]
        });
        let link = new Link(data);
        link.save(err => {
          let data = {
            user: user._id.toString(),
            positions: [section._id.toString()]
          };
          request
            .put("/links/member/remove/" + link._id)
            .set("authorization", authUser.token)
            .send({
              user: user._id.toString()
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
    });
  });
});
