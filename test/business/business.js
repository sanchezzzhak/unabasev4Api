import chai from "chai";
import chaiHttp from "chai-http";
import axios from "axios";
chai.use(chaiHttp);

import app from "../../src/server";
import { testError } from "../testError";
import Business from "../../src/models/business";
import User from "../../src/models/user";
import testData from "./data";
import userData from "../user/data";
// let businessId;
// let data = {
//   password: "test123"
// };

beforeEach(done => {
  Business.deleteMany({}, err => {
    done();
  });
});
// export const createBusiness = () => {
describe("business create", () => {
  it("/POST business create@business", done => {
    chai
      .request(app)
      .post("/business")
      .send(testData())
      .end((err, res) => {
        console.log(res);
        if (err) done(err);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("_id");
        res.body.should.have.property("name");
        done();
      });
  });
});

// };

export const getBusiness = () => {
  it("/GET business get@business", done => {
    chai
      .request(app)
      .get("/business")

      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.should.be.a("object");
        res.body.should.have.property("total");
        res.body.should.have.property("docs");
        done();
      });
  });
};

export const getOneBusiness = () => {
  it("/GET business getOne@business", done => {
    let business = new Business(testData());
    business.save((err, business) => {
      chai
        .request(app)
        .get("/business/" + business.id)

        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a("object");
          done();
        });
    });
  });
};

export const updateOneBusiness = () => {
  it("/GET business updateOne@business", done => {
    let business = new Business(testData());
    business.save((err, business) => {
      chai
        .request(app)
        .put("/business/" + business.id)
        .send(testData())
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a("object");
          res.body.should.have.property("_id");
          res.body.should.have.property("name");
          done();
        });
    });
  });
};

export const addUser = () => {
  it("/PUT business addUser@business", done => {
    let businessDoc = new Business(testData());
    let userDoc = new User(userData());
    // TODO promise all, to use async/await with the saves
    businessDoc.save((err, business) => {
      userDoc.save((err, user) => {
        chai
          .request(app)
          .put("/business/user/" + business.id)
          .send({
            action: "add",
            user: user
          })
          .end((err, res) => {
            if (err) done(err);

            res.should.have.status(200);
            res.should.be.a("object");
            done();
          });
      });
    });
  });
};
