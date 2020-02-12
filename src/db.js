import mongoose from "mongoose";

import logy from "./config/lib/logy";
// import dbConfig from "./config/database.js";

import envar from "./lib/envar";
logy(envar());
const dbConfig = {
  // dev: `mongodb://${main.host}:27020/unabase`, // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
  dev: `mongodb+srv://${envar().DB_USER}:${envar().DB_PASS}@${envar().DB_DEV}`,
  dev4: `mongodb+srv://${envar().DB_USER4}:${envar().DB_PASS4}@${envar().DB_DEV4}`,
  una: `mongodb+srv://${envar().DB_USER}:${envar().DB_PASS}@${envar().DB_UNA}`,
  test: `mongodb+srv://${envar().DB_USER}:${envar().DB_PASS}@${envar().DB_TEST}`,
  local: `mongodb+srv://${envar().DB_USER}:${envar().DB_PASS}@${envar().DB_TEST}`,
  prod: `mongodb+srv://${envar().DB_USER}:${envar().DB_PASS}@${envar().DB_PROD}`
};

const env = process.env.NODE_ENV || "";
logy(dbConfig[env]);
mongoose.connect(dbConfig[env], {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

let db = mongoose.connection;

export default db;
