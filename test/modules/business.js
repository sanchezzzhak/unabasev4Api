import chai from "chai";
import chaiHttp from "chai-http";
import axios from "axios";
chai.use(chaiHttp);
import api from "../../src/config/api";
import app from "../../src/app";
import { testError } from "../testError";

let businessId;
let data = {
  password: "test123"
};

export const createBusiness = () => {
  it("/POST business create@business", done => {
    chai
      .request(app)
      .post("/business")
      .send({
        name: "test business",
        username: "businessusername",
        password: {
          hash: data.password
        },
        idnumber: "255456562",
        type: "business",
        phones: {
          default: "+56909909909"
        },
        emails: {
          default: "business@mail.com"
        },
        address: {
          street: "carmen covarrubias",
          number: 32,
          district: "ñuñoa",
          city: "Santiago",
          region: "Metropolitana",
          country: "Chile"
        }
      })
      .end((err, res) => {
        testError(err);
        res.should.have.status(200);
        done();
      });
  });
};

export const getBusiness = () => {
  it("/GET business get@business", done => {
    chai
      .request(app)
      .get("/business")

      .end((err, res) => {
        testError(err);
        res.should.have.status(200);
        res.should.be.a("object");
        done();
      });
  });
};
