import mongoose from 'mongoose';
import * as path from 'path';
import express, { Router } from 'express';
import bodyParser, { urlencoded, json } from 'body-parser';
import xmlparser from 'express-xml-bodyparser';
import flash from 'connect-flash';

import cookieParser from 'cookie-parser';
import passport from 'passport';
import { url } from './src/config/database.js';

import { secret as _secret, host, web } from './src/config/main.js';
const port = process.env.PORT || 3000;
import favicon from 'serve-favicon';
import session from 'express-session';
// const cors = require("cors");
/// graphql
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from './src/graphql/schemas';
import resolvers from './src/graphql/resolvers';

/// database

mongoose.connect(
  url,
  { useNewUrlParser: true }
);

mongoose.set('useCreateIndex', true);
const MongoStore = require('connect-mongo')(session);

require('./src/config/passport')(passport); // pass passport for configuration

let db = mongoose.connection;

//check connection
db.once('open', () => {
  console.log('Connnected to mongodb');
});

//check for DB erros
db.on('error', err => {
  console.log(err);
});

//init app
const app = express();

const router = Router();

// body parser middleware
// parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: false }));

// parse application/json
app.use(json());
app.use(xmlparser());
app.use(cookieParser());

//load view engine
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

//set public folder
app.use(express.static(path.join(__dirname, './public')));

app.use(flash());
app.use(
  session({
    secret: _secret,
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
  res.locals.host = host;
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Origin", "http://localhost:8081");
  res.header('Access-Control-Allow-Origin', web);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', [
    'POST',
    'GET',
    'PUT',
    'DELETE',
    'PATCH',
    'HEAD',
    'OPTIONS'
  ]);
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, Origin, X-Requested-With, Content-Type, Accept'
  );

  next();
});

import routes from './src/routes';

app.use('/', routes);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // if you want GraphiQL enabled

//start server
const server = app.listen(port, () => {
  console.log('Server started on port ' + port);
});
