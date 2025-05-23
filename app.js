var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var layouts = require('express-ejs-layouts');
const mariadb = require('mariadb/callback');
const dotenv = require('dotenv');
const session = require('express-session')

dotenv.config();

// Database connection with better error handling
let db;
const connectDB = async () => {
  try {
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_DATABASE) {
      console.error("Missing database environment variables");
      return;
    }

    db = mariadb.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT || 3306
    });

    db.connect((err) => {
      if (err) {
        console.error("Database connection error:", err);
      } else {
        console.log("Connected to DB successfully");
      }
    });
  } catch (error) {
    console.error("Failed to create database connection:", error);
  }
};

// Connect to database
connectDB();

global.db = db;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(layouts);

// Session configuration
app.use(session({
  secret: 'vroomAppSecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/about', require('./routes/about'));
app.use('/contact', require('./routes/contact'));
app.use('/privacy', require('./routes/privacy'));
app.use('/help', require('./routes/help'));
app.use('/customer', require('./routes/customer'));
app.use('/vehicle', require('./routes/vehicle'));
app.use('/vehiclecat', require('./routes/vehiclecat'));
app.use('/host', require('./routes/host'));
app.use('/renter', require('./routes/renter'));
app.use('/saleorder', require('./routes/saleorder'));
app.use('/search', require('./routes/search'));
app.use('/report', require('./routes/report'));
app.use('/promotion', require('./routes/promotion'));
app.use('/catalog', require('./routes/catalog'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    database: db ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('404 error for path:', req.path);
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    title: 'Error',
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

module.exports = app;
