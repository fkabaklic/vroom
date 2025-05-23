var express = require('express');
var router = express.Router();

function adminonly(req,res,next){ 
	if (!req.session.admin) 
		{return res.render('customer/login', {message: "Need admin access. Login with admin credentials"});}
    next();
}

// ==================================================
// Route to list all records. Display view to list all records
// URL: https://localrenter:3018/renter/
// ==================================================

router.get('/', adminonly, function(req, res, next) {
let query = "SELECT renter_id, name, vehicle_type, status FROM renter"; 

  // execute query
  db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('renter/allrecords', {allrecs: result });
 	});
});

// ==================================================
// Route to view one specific record. Notice the view is one record
//	URL: http://localrenter:3018/renter/1/show
// ==================================================

router.get('/:recordid/show', adminonly, function(req, res, next) {
	let query = "SELECT renter_id, name, vehicle_type, status FROM renter WHERE renter_id = " + req.params.recordid; 
	
	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('renter/onerec', {onerec: result[0] });
	} 
	});
});

// ==================================================
// Route to show empty form to obtain input form end-user.
// URL: http://localrenter:3018/renter/addrec
// ==================================================

router.get('/addrecord', adminonly, function(req, res, next) {
	res.render('renter/addrec');
});

// ==================================================
// Route to obtain user input and save in database.
// ==================================================

router.post('/', function(req, res, next) {

	let insertquery = "INSERT INTO renter (renter_id, name, vehicle_type, status) VALUES (?, ?, ?, ?)"; 
	
	db.query(insertquery,[req.body.renter_id, req.body.name, req.body.vehicle_type, req.body.status, req.body.status],(err, result) => {
		if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.redirect('/renter');
				}
			});
});

// ==================================================
// Route to edit one specific record.
// URL: http://localrenter:3018/renter/1/
// ==================================================

router.get('/:recordid/edit', adminonly, function(req, res, next) {
	let query = "SELECT renter_id, name, vehicle_type, status FROM renter WHERE renter_id = " + req.params.recordid; 
	
	  // execute query
	  db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.render('renter/editrec', {onerec: result[0] });
			} 
		 });
});

// ==================================================
// Route to save edited data in database.
// ==================================================

router.post('/save', adminonly, function(req, res, next) {
	let updatequery = "UPDATE renter SET name = ?, vehicle_type = ?, status = ? WHERE renter_id = " + req.body.renter_id; 

	db.query(updatequery,[req.body.name, req.body.vehicle_type, req.body.status, req.body ],(err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.redirect('/renter');
		}
		});
});

// ==================================================
// Route to delete one specific record.
// ==================================================

router.get('/:recordid/delete', adminonly, function(req, res, next) {
	let query = "DELETE FROM renter WHERE renter_id = " + req.params.recordid;  
	
	  // execute query
	  db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.redirect('/renter');
			} 
		 });
	});


module.exports = router;

