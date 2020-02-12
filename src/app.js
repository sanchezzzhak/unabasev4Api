// import mongoose from 'mongoose';
import * as path from "path";
import express, { Router } from "express";
import bodyParser, { urlencoded, json } from "body-parser";
import xmlparser from "express-xml-bodyparser";
import logy from "./config/lib/logy";
global.logy = logy;
import cookieParser from "cookie-parser";
import passport from "passport";
import passportConfig from "./config/passport";
// import dbConfig from "./config/database.js";
import logger from "./lib/logger";
const port = process.env.PORT || 3000;
import favicon from "serve-favicon";
import session from "express-session";
import cors from "cors";
import morgan from "morgan";
import localeMiddleware from "express-locale";
import db from "./db";
const env = process.env.NODE_ENV || "";
/// database
// logy("env");

// logy(env);

// ()(dbConfig[env]);
// mongoose.connect(
//   dbConfig[env],
//   { useNewUrlParser: true }
// );

// mongoose.set('useCreateIndex', true);
// // const MongoStore = require('connect-mongo')(session);

// let db = mongoose.connection;

//check connection
db.once("open", () => {
  logy(`Connnected to mongodb  ${process.env.NODE_ENV} `);
});

//check for DB erros
db.on("error", err => {
  logy(env);
  logy(err);
});

//init app
const app = express();
import templates from "./lib/mails";

const router = Router();

// body parser middleware
// parse application/x-www-form-urlencoded
app.use(
  urlencoded({
    extended: false
  })
);

// parse application/json
app.use(json());
app.use(xmlparser());
app.use(cookieParser());

app.use(cors());
app.use(localeMiddleware());
//load view engine
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "pug");

// app.options('*', cors());
//set public folder
app.use(express.static(path.join(__dirname, "./public")));

// app.use(flash());
// app.use(
//   session({
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: new MongoStore({ mongooseConnection: mongoose.connection })
//     // cookie: { secure: true }
//   })
// );

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");
if (env === "test" || env === "dev") {
  logy("using morgan");
  app.use(morgan("dev"));
}
//global var
let allowedOrigins = ["https://unabase1.firebaseapp.com", "http://localhost:8080", "https://unabase.net", "https://www.unabase.net", "http://localhost:8081"];
app.use(function(req, res, next) {
  res.locals.activeUser = req.user || null;
  res.locals.user = req.user || null;
  // let origin = req.headers.origin;

  // if (allowedOrigins.indexOf(origin) > -1) {
  //   res.header('Access-Control-Allow-Origin', origin);
  // }
  // res.header('Access-Control-Allow-Origin', true);
  res.header("Access-Control-Allow-Origin", "*");
  // res.header('Access-Control-Allow-Origin', mainConfig.web);
  // res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Methods", ["POST", "GET", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]);
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");

  next();
});

import routes from "./routes";
import axios from "axios";
import { handleError } from "./middleware/error";

// logy(process.env);

app.use("/", routes);

// const schema = makeExecutableSchema({
//   typeDefs,
//   resolvers
// });
// app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
// app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // if you want GraphiQL enabled

// error handler

app.use((err, req, res, next) => {
  handleError(err, res);
});

//start server
app.listen(port, () => {
  logy("Server started on port " + port + " env: " + env);
});

export default app;
