import mongoose from "mongoose";

import dbConfig from "./config/database.js";

const env = process.env.NODE_ENV || "";
mongoose.connect(dbConfig[env], { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

let db = mongoose.connection;

export default db;
