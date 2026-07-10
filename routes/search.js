var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	const criteria = (req.query.searchcriteria || '').trim();
	const like = '%' + criteria.replace(/'/g, "''") + '%';

	let query = "SELECT vehicle_id, prodimage, description, duration, vehicle_type, daily_fee, status, renter_id, host_id, review_id, featured FROM vehicle";
	if (criteria) {
		query += " WHERE description LIKE '" + like + "' OR vehicle_type LIKE '" + like + "'";
	}

	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error', { message: 'Search failed', error: { status: 500 } });
		} else {
			res.render('search', {
				title: 'Search',
				allrecs: result,
				searchcriteria: criteria
			});
		}
	});
});

module.exports = router;
