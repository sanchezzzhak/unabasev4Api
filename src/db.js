import mongoose from "mongoose";

import logy from "./config/lib/logy";
// import dbConfig from "./config/database.js";

import envar from "./lib/envar";
logy(envar());
const dbConfig = {
  dev: `mongodb+srv://${envar().DB_USER}:${envar().DB_PASS}@${envar().DB_DEV}`,
  test: `mongodb+srv://${envar().DB_USER}:${envar().DB_PASS}@${envar().DB_TEST}`
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
