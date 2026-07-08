var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var layouts = require('express-ejs-layouts');
const mariadb = require('mariadb');
const dotenv = require('dotenv');
const session = require('express-session')

dotenv.config();

// Serverless-safe DB access:
// - no top-level network connection attempts on import
// - a single lazily-created pool reused across invocations
let dbPool;
function getDbPool() {
  if (dbPool) return dbPool;

  const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.warn(`DB disabled: missing env ${missing.join(', ')}`);
    return null;
  }

  const poolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT || 3306),
    connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT_MS || 2000),
    connectionLimit: Number(process.env.DB_POOL_LIMIT || 2)
  };

  if (process.env.DB_SSL === 'true') {
    poolConfig.ssl = { rejectUnauthorized: true };
  }

  dbPool = mariadb.createPool(poolConfig);
  return dbPool;
}

global.db = {
  query: async (sql, params) => {
    const pool = getDbPool();
    if (!pool) {
      const err = new Error('Database not configured');
      err.code = 'DB_NOT_CONFIGURED';
      throw err;
    }
    let conn;
    try {
      conn = await pool.getConnection();
      return await conn.query(sql, params);
    } finally {
      if (conn) conn.release();
    }
  }
};

var app = express();

app.set('trust proxy', 1);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(layouts);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'vroomAppSecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
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
    database: getDbPool() ? 'configured' : 'disabled',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
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

  const status = err.status || 500;

  res.status(status);
  res.render('error', {
    title: 'Error',
    message: err.message,
    error: { status: status }
  }, function(renderErr) {
    if (renderErr) {
      console.error('Error page render failed:', renderErr.message);
      res.status(status).json({
        error: err.message || 'Internal Server Error',
        status: status
      });
    }
  });
});

module.exports = app;
