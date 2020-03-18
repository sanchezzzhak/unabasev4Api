import chai from "chai";
import chaiHttp from "chai-http";
import axios from "axios";
import app from "../src/server";
chai.use(chaiHttp);

// export const init = () => {
//   it("INIT", done => {
//     chai
//       .request(app)
//       .post("/auth/register")
//       .end((err, res) => {
//         if (err) {
//           console.log(err.response.status);
//           console.log(err.response.statusText);
//           console.log(err.response.data);
//         }
//         console.log(res.body);
//         res.should.have.status(200);
//         // res.data.should.be.a("object");
//         // global.loginId = res.data._id;
//         done();
//       });
//   });
// };
