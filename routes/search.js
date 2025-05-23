var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

	let query = "SELECT vehicle_id, prodimage, description, duration, vehicle_type, daily_fee, status, renter_id, host_id, review_id FROM vehicle WHERE description LIKE '%" + req.query.searchcriteria + "%'";   

	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('search', {allrecs: result});
		} 
	});
});

module.exports = router;
