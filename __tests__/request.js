import supertest from "supertest";
import chai from "chai";
import app from "../src/server";
const request = supertest(app);

chai.should();
import "chai/register-expect";
export default request;
