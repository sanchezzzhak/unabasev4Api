import db from "../src/db";

db.once("open", () => {
  console.log(`Connnected to mongodb  ${process.env.NODE_ENV} `);
});

//check for DB erros
db.on("error", err => {
  console.log(env);
  console.log(err);
});

describe("db connection", () => {
  it("DB CONNECTION @db", done => {
    db.once("open", () => {
      console.log(`Connnected to mongodb  ${process.env.NODE_ENV} `);
      done();
    });

    //check for DB erros
    db.on("error", err => {
      done(err);
    });
  });
});
