const { log } = console;
const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const xmlparser = require("express-xml-bodyparser");
const flash = require("connect-flash");

const cookieParser = require("cookie-parser");
const passport = require("passport");
const configDB = require("./src/config/database.js");

const mainConfig = require("./src/config/main.js");
const port = process.env.PORT || 3000;
const favicon = require("serve-favicon");
const session = require("express-session");
// const cors = require("cors");
/// database

mongoose.connect(
  configDB.url,
  { useNewUrlParser: true }
);

mongoose.set("useCreateIndex", true);
const MongoStore = require("connect-mongo")(session);

require("./src/config/passport")(passport); // pass passport for configuration

let db = mongoose.connection;

//check connection
db.once("open", () => {
  console.log("Connnected to mongodb");
});

//check for DB erros
db.on("error", err => {
  console.log(err);
});

//init app
const app = express();

const router = express.Router();

// body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(xmlparser());
app.use(cookieParser());

//load view engine
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "pug");

//set public folder
app.use(express.static(path.join(__dirname, "./public")));

app.use(flash());
app.use(
  session({
    secret: mainConfig.secret,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
    // cookie: { secure: true }
  })
);
app.use(passport.initialize());
app.use(passport.session());

//global var
app.use(function(req, res, next) {
  res.locals.activeUser = req.user || null;
  res.locals.user = req.user || null;
  res.locals.host = mainConfig.host;
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Origin", "http://localhost:8081");
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Origin", "https://unabase1.firebaseapp.com");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", [
    "POST",
    "GET",
    "PUT",
    "DELETE",
    "PATCH",
    "HEAD",
    "OPTIONS"
  ]);
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

const routes = require("./src/routes");

app.use("/", routes);

//start server
const server = app.listen(port, () => {
  console.log("Server started on port " + port);
});
