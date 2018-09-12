const { log } = console;  
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const xmlparser = require('express-xml-bodyparser');
const flash = require('connect-flash');

const cookieParser = require('cookie-parser');
const passport = require('passport');
const configDB = require('./config/database.js');
const mainConfig = require('./config/main.js');
const port     = process.env.PORT || 8080;
const favicon = require('serve-favicon');
const session = require('express-session');


/// database

mongoose.connect(configDB.url, { useNewUrlParser: true });

mongoose.set('useCreateIndex', true);
const MongoStore = require('connect-mongo')(session);

require('./config/passport')(passport); // pass passport for configuration

let db = mongoose.connection;

//check connection
db.once('open', () => {
	console.log('Connnected to mongodb');
});

//check for DB erros
db.on('error', (err) => {
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
app.set('views',path.join(__dirname, './views'));
app.set('view engine', 'pug');


//set public folder
app.use(express.static(path.join(__dirname, './public')));

app.use(flash());
app.use(session({
  secret: 'vn4v4c3',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection})
  // cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());


//global var
app.use(function(req, res, next){
	res.locals.activeUser = req.user || null;
	res.locals.user = req.user || null;
	res.locals.host = mainConfig.host;
	next();
});


// const auth = require('./routes/auth.js');
// app.use('/auth', auth);

// const users = require('./routes/users');
// app.use('/users', users);

const routes = require('./routes');
// routes(app);

app.use('/', routes)

//start server
const server = app.listen(port, () => {
	console.log('Server started on port '+ port);
});