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

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Basic routes
app.get('/', (req, res) => {
  if (!global.db) {
    return res.status(500).render('error', {
      message: 'Database connection error',
      error: { status: 500 }
    });
  }

  const query = "SELECT vehicle_id, prodimage, description, duration, vehicle_type, daily_fee, renter_id, host_id, review_id, status FROM vehicle WHERE featured = true";
  
  global.db.query(query, (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).render('error', {
        message: 'Error fetching featured vehicles',
        error: { status: 500 }
      });
    }
    res.render('index', {
      title: 'Home',
      allrecs: result || []
    });
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/privacy', (req, res) => {
  res.render('privacy');
});

app.get('/help', (req, res) => {
  res.render('help');
});

// User routes
app.get('/users', (req, res) => {
  res.render('users');
});

// Customer routes
app.get('/customer', (req, res) => {
  res.render('customer/index');
});

// Vehicle routes
app.get('/vehicle', (req, res) => {
  res.render('vehicle/index');
});

// Vehicle category routes
app.get('/vehiclecat', (req, res) => {
  res.render('vehiclecat/index');
});

// Host routes
app.get('/host', (req, res) => {
  res.render('host/index');
});

// Renter routes
app.get('/renter', (req, res) => {
  res.render('renter/index');
});

// Sale order routes
app.get('/saleorder', (req, res) => {
  res.render('saleorder/index');
});

// Search routes
app.get('/search', (req, res) => {
  res.render('search');
});

// Report routes
app.get('/report', (req, res) => {
  res.render('report/index');
});

// Promotion routes
app.get('/promotion', (req, res) => {
  res.render('promotion/index');
});

// Catalog routes
app.get('/catalog', (req, res) => {
  res.render('catalog');
});

// Health check endpoint
app.get('/health', (req, res) => {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    }
  });

  res.status(200).json({
    status: 'ok',
    database: db ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    routes: routes
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
