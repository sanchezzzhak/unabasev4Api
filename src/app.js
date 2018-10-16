import mongoose from 'mongoose';
import * as path from 'path';
import express, { Router } from 'express';
import bodyParser, { urlencoded, json } from 'body-parser';
import xmlparser from 'express-xml-bodyparser';
import flash from 'connect-flash';

import logger from './config/lib/logger.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import dbConfig from './config/database.js';

import mainConfig from './config/main.js';
const port = process.env.PORT || 3000;
import favicon from 'serve-favicon';
import session from 'express-session';

import cors from 'cors';
const env = process.env.NODE_ENV || '';
/// database
logger('db con');

logger(env);
logger(dbConfig[env]);
mongoose.connect(
  dbConfig[env],
  { useNewUrlParser: true }
);

mongoose.set('useCreateIndex', true);
const MongoStore = require('connect-mongo')(session);

let db = mongoose.connection;

//check connection
db.once('open', () => {
  logger('Connnected to mongodb ' + process.env.NODE_ENV);
});

//check for DB erros
db.on('error', err => {
  logger(err);
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

// app.use(cors());
//load view engine
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

// app.options('*', cors());
//set public folder
app.use(express.static(path.join(__dirname, './public')));

// app.use(flash());
// app.use(
//   session({
//     secret: mSecret,
//     resave: false,
//     saveUninitialized: true,
//     store: new MongoStore({ mongooseConnection: mongoose.connection })
//     // cookie: { secure: true }
//   })
// );
app.use(passport.initialize());
app.use(passport.session());

//global var
let allowedOrigins = [
  'https://unabase1.firebaseapp.com',
  'http://localhost:8080',
  'http://localhost:8081'
];
app.use(function(req, res, next) {
  res.locals.activeUser = req.user || null;
  res.locals.user = req.user || null;
  res.locals.host = mainConfig.host;
  let origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  // res.header('Access-Control-Allow-Origin', true);
  // res.header("Access-Control-Allow-Origin", "http://localhost:8081");
  // res.header('Access-Control-Allow-Origin', mainConfig.web);
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

import routes from './routes';

app.use('/', routes);

// const schema = makeExecutableSchema({
//   typeDefs,
//   resolvers
// });
// app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
// app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // if you want GraphiQL enabled

//start server
app.listen(port, () => {
  logger('Server started on port ' + port);
});

export default app;
