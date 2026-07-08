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

    const dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT || 3306
    };

    if (process.env.DB_SSL === 'true') {
      dbConfig.ssl = { rejectUnauthorized: true };
    }

    db = mariadb.createConnection(dbConfig);

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

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Import routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const aboutRouter = require('./routes/about');
const contactRouter = require('./routes/contact');
const privacyRouter = require('./routes/privacy');
const helpRouter = require('./routes/help');
const customerRouter = require('./routes/customer');
const vehicleRouter = require('./routes/vehicle');
const vehiclecatRouter = require('./routes/vehiclecat');
const hostRouter = require('./routes/host');
const renterRouter = require('./routes/renter');
const saleorderRouter = require('./routes/saleorder');
const searchRouter = require('./routes/search');
const reportRouter = require('./routes/report');
const promotionRouter = require('./routes/promotion');
const catalogRouter = require('./routes/catalog');

// Register routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/privacy', privacyRouter);
app.use('/help', helpRouter);
app.use('/customer', customerRouter);
app.use('/vehicle', vehicleRouter);
app.use('/vehiclecat', vehiclecatRouter);
app.use('/host', hostRouter);
app.use('/renter', renterRouter);
app.use('/saleorder', saleorderRouter);
app.use('/search', searchRouter);
app.use('/report', reportRouter);
app.use('/promotion', promotionRouter);
app.use('/catalog', catalogRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    database: db ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    routes: app._router.stack
      .filter(r => r.route)
      .map(r => ({
        path: r.route.path,
        methods: Object.keys(r.route.methods)
      }))
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('404 error for path:', req.path);
  console.log('Request headers:', req.headers);
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('Request path:', req.path);
  console.error('Request method:', req.method);
  
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
