var express = require('express');
var router = express.Router();

/* get home page. */
router.get('/', function(req, res, next) {
  // Check if database is connected
  if (!global.db) {
    console.error('Database not connected');
    return res.status(500).render('error', {
      message: 'Database connection error',
      error: { status: 500 }
    });
  }

  let query = "SELECT vehicle_id, prodimage, description, duration, vehicle_type, daily_fee, renter_id, host_id, review_id, status FROM vehicle WHERE featured = true"; 

  // execute query
  global.db.query(query, (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).render('error', {
        message: 'Error fetching featured vehicles',
        error: { status: 500 }
      });
    }
    
    // If no results, still render the page with empty array
    res.render('index', {
      title: 'Home',
      allrecs: result || []
    });
  });
});

module.exports = router;
