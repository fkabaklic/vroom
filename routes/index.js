var express = require('express');
var router = express.Router();

/* get home page. */
router.get('/', function(req, res, next) {
let query = "SELECT vehicle_id, prodimage, description, duration, vehicle_type, daily_fee, renter_id, host_id, review_id, status FROM vehicle WHERE featured = true"; 

    // execute query
    db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('index', {allrecs: result });
 	});
});

module.exports = router;
