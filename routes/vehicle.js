var express = require('express');
var router = express.Router();

function adminonly(req,res,next){ 
	if (!req.session.admin) 
		{return res.render('customer/login', {message: "Need admin access. Login with admin credentials"});}
    next();
}

// ==================================================
// Route to list all records. Display view to list all records
// URL: https://localhost:3018/vehicle/
// ==================================================

router.get('/',adminonly, function(req, res, next) {
let query = "SELECT vehicle_id, prodimage, description, duration, vehicle_type, daily_fee, status, renter_id, host_id, review_id, featured FROM vehicle"; 

  // execute query
  db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('vehicle/allrecords', {allrecs: result });
 	});
});

// ==================================================
// Route to view one specific record. Notice the view is one record
//	URL: http://localhost:3018/vehicle/1/show
// ==================================================

router.get('/:recordid/show',  function(req, res, next) {
	let query = "SELECT vehicle_id, prodimage, description, duration, vehicle_type, daily_fee, status, renter_id, host_id, review_id, featured FROM vehicle WHERE vehicle_id = " + req.params.recordid; 
	
	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('vehicle/onerec', {
				title: result[0] ? result[0].description : 'Vehicle',
				onerec: result[0]
			});
	} 
	});
});

// ==================================================
// Route to show empty form to obtain input form end-user.
// URL: http://localhost:3018/vehicle/addrec
// ==================================================

router.get('/addrecord', adminonly, function(req, res, next) {
	res.render('vehicle/addrec');
});

// ==================================================
// Route to obtain user input and save in database.
// ==================================================

router.post('/', adminonly, function(req, res, next) {

	var featured_value = 0;
	if (req.body.featured)
		{
			featured_value = 1;
		}

	let insertquery = "INSERT INTO vehicle (vehicle_id, prodimage, description, duration, vehicle_type, daily_fee, status, renter_id, host_id, review_id, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"; 
	
	db.query(insertquery,[req.body.vehicle_id, req.body.prodimage, req.body.description, req.body.duration, req.body.vehicle_type, req.body.daily_fee, req.body.status, req.body.renter_id, req.body.host_id, req.body.review_id, featured_value],(err, result) => {
		if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.redirect('/vehicle');
				}
			});
});

// ==================================================
// Route to edit one specific record.
// URL: http://localhost:3018/vehicle/1/
// ==================================================

router.get('/:recordid/edit', adminonly, function(req, res, next) {
	let query = "SELECT vehicle_id, prodimage, description, duration, vehicle_type, daily_fee, status, renter_id, host_id, review_id, featured FROM vehicle WHERE vehicle_id = " + req.params.recordid; 
	
	  // execute query
	  db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.render('vehicle/editrec', {onerec: result[0] });
			} 
		 });
});

// ==================================================
// Route to save edited data in database.
// ==================================================

router.post('/save', adminonly, function(req, res, next) {

	var featured_value = 0;
	if (req.body.featured)
		{
			featured_value = 1;
		}

	let updatequery = "UPDATE vehicle SET prodimage = ?, description = ?, duration = ?, vehicle_type = ?, daily_fee = ?, status = ?, renter_id = ?, host_id = ?, review_id = ?, featured = ? WHERE vehicle_id = " + req.body.vehicle_id; 

	db.query(updatequery,[req.body.prodimage, req.body.description, req.body.duration, req.body.vehicle_type, req.body.daily_fee, req.body.status, req.body.renter_id, req.body.host_id, req.body.review_id, featured_value],(err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.redirect('/vehicle');
		}
		});
});

// ==================================================
// Route to delete one specific record.
// ==================================================

router.get('/:recordid/delete', adminonly, function(req, res, next) {
	let query = "DELETE FROM vehicle WHERE vehicle_id = " + req.params.recordid;  
	
	  // execute query
	  db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.redirect('/vehicle');
			} 
		 });
	});


module.exports = router;

