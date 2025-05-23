var express = require('express');
var router = express.Router();

function adminonly(req,res,next){ 
	if (!req.session.admin) 
		{return res.render('customer/login', {message: "Need admin access. Login with admin credentials"});}
    next();
}

// ==================================================
// Route to list all records. Display view to list all records
// URL: https://localhost:3018/vehiclecat/
// ==================================================

router.get('/', adminonly, function(req, res, next) {
let query = "SELECT vehiclecat_id, vehicle_make, vehicle_model, vehicle_type FROM vehiclecat"; 

  // execute query
  db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('vehiclecat/allrecords', {allrecs: result });
 	});
});

// ==================================================
// Route to view one specific record. Notice the view is one record
//	URL: http://localhost:3018/vehiclecat/1/show
// ==================================================

router.get('/:recordid/show', adminonly, function(req, res, next) {
	let query = "SELECT vehiclecat_id, vehicle_make, vehicle_model, vehicle_type FROM vehiclecat WHERE vehiclecat_id = " + req.params.recordid; 
	
	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('vehiclecat/onerec', {onerec: result[0] });
	} 
	});
});

// ==================================================
// Route to show empty form to obtain input form end-user.
// URL: http://localhost:3018/vehiclecat/addrec
// ==================================================

router.get('/addrecord', function(req, res, next) {
	res.render('vehiclecat/addrec');
});

// ==================================================
// Route to obtain user input and save in database.
// ==================================================

router.post('/', adminonly, function(req, res, next) {

	let insertquery = "INSERT INTO vehiclecat (vehiclecat_id, vehicle_make, vehicle_model, vehicle_type) VALUES (?, ?, ?, ?)"; 
	
	db.query(insertquery,[req.body.vehiclecat_id, req.body.vehicle_make, req.body.vehicle_model, req.body.vehicle_type],(err, result) => {
		if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.redirect('/vehiclecat');
				}
			});
});

// ==================================================
// Route to edit one specific record.
// URL: http://localhost:3018/vehiclecat/1/
// ==================================================

router.get('/:recordid/edit', function(req, res, next) {
	let query = "SELECT vehiclecat_id, vehicle_make, vehicle_model, vehicle_type FROM vehiclecat WHERE vehiclecat_id = " + req.params.recordid; 
	
	  // execute query
	  db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.render('vehiclecat/editrec', {onerec: result[0] });
			} 
		 });
});

// ==================================================
// Route to save edited data in database.
// ==================================================

router.post('/save', adminonly, function(req, res, next) {
	let updatequery = "UPDATE vehiclecat SET vehicle_make = ?, vehicle_model = ?, vehicle_type = ? WHERE vehiclecat_id = "  + req.body.vehiclecat_id; 

	db.query(updatequery,[req.body.vehicle_make, req.body.vehicle_model, req.body.vehicle_type],(err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.redirect('/vehiclecat');
		}
		});
});

// ==================================================
// Route to delete one specific record.
// ==================================================

router.get('/:recordid/delete', adminonly, function(req, res, next) {
	let query = "DELETE FROM vehiclecat WHERE vehiclecat_id = " + req.params.recordid;  
	
	  // execute query
	  db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.redirect('/vehiclecat');
			} 
		 });
	});


module.exports = router;

