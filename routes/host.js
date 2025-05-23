var express = require('express');
var router = express.Router();

function adminonly(req,res,next){ 
	if (!req.session.admin) 
		{return res.render('customer/login', {message: "Need admin access. Login with admin credentials"});}
    next();
}

// ==================================================
// Route to list all records. Display view to list all records
// URL: https://localhost:3018/host/
// ==================================================

router.get('/', adminonly, function(req, res, next) {
let query = "SELECT host_id, name, vehicle_type, status, num_vehicles FROM host"; 

  // execute query
  db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('host/allrecords', {allrecs: result });
 	});
});

// ==================================================
// Route to view one specific record. Notice the view is one record
//	URL: http://localhost:3018/host/1/show
// ==================================================

router.get('/:recordid/show', adminonly, function(req, res, next) {
	let query = "SELECT host_id, name, vehicle_type, status, num_vehicles FROM host WHERE host_id = " + req.params.recordid; 
	
	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('host/onerec', {onerec: result[0] });
	} 
	});
});

// ==================================================
// Route to show empty form to obtain input form end-user.
// URL: http://localhost:3018/host/addrec
// ==================================================

router.get('/addrecord', adminonly, function(req, res, next) {
	res.render('host/addrec');
});

// ==================================================
// Route to obtain user input and save in database.
// ==================================================

router.post('/', adminonly, function(req, res, next) {

	let insertquery = "INSERT INTO host (host_id, name, vehicle_type, status, num_vehicles) VALUES (?, ?, ?, ?, ?)"; 
	
	db.query(insertquery,[req.body.host_id, req.body.name, req.body.vehicle_type, req.body.status, req.body.status, req.body.num_vehicle],(err, result) => {
		if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.redirect('/host');
				}
			});
});

// ==================================================
// Route to edit one specific record.
// URL: http://localhost:3018/host/1/
// ==================================================

router.get('/:recordid/edit', adminonly, function(req, res, next) {
	let query = "SELECT host_id, name, vehicle_type, status, num_vehicles FROM host WHERE host_id = " + req.params.recordid; 
	
	  // execute query
	  db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.render('host/editrec', {onerec: result[0] });
			} 
		 });
});

// ==================================================
// Route to save edited data in database.
// ==================================================

router.post('/save', adminonly, function(req, res, next) {
	let updatequery = "UPDATE host SET name = ?, vehicle_type = ?, status = ?, num_vehicles = ? WHERE host_id = " + req.body.host_id; 

	db.query(updatequery,[req.body.name, req.body.vehicle_type, req.body.status, req.body.num_vehicles],(err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.redirect('/host');
		}
		});
});

// ==================================================
// Route to delete one specific record.
// ==================================================

router.get('/:recordid/delete', adminonly, function(req, res, next) {
	let query = "DELETE FROM host WHERE host_id = " + req.params.recordid;  
	
	  // execute query
	  db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.redirect('/host');
			} 
		 });
	});


module.exports = router;

