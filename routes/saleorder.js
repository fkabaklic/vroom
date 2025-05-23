var express = require('express');
var router = express.Router();

function adminonly(req,res,next){ 
	if (!req.session.admin) 
		{return res.render('customer/login', {message: "Need admin access. Login with admin credentials"});}
    next();
}

// ==================================================
// Route to list all records. Display view to list all records
// URL: https://localsaleorder:3018/saleorder/
// ==================================================

router.get('/', adminonly, function(req, res, next) {
let query = "SELECT saleorder_id, saledate, customer_id, vehicle_id, saleprice FROM saleorder"; 

  // execute query
  db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('saleorder/allrecords', {allrecs: result });
 	});
});

// ==================================================
// Route to view one specific record. Notice the view is one record
//	URL: http://localsaleorder:3018/saleorder/1/show
// ==================================================

router.get('/:recordid/show', adminonly, function(req, res, next) {
	let query = "SELECT saleorder_id, saledate, customer_id, vehicle_id, saleprice FROM saleorder WHERE saleorder_id = " + req.params.recordid; 
	
	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('saleorder/onerec', {onerec: result[0] });
	} 
	});
});

// ==================================================
// Route to show empty form to obtain input form end-user.
// URL: http://localsaleorder:3018/saleorder/addrec
// ==================================================

router.get('/addrecord', function(req, res, next) {
	res.render('saleorder/addrec');
});

// ==================================================
// Route to obtain user input and save in database.
// ==================================================

router.post('/', adminonly, function(req, res, next) {

	let insertquery = "INSERT INTO saleorder (saleorder_id, saledate, customer_id, vehicle_id, saleprice) VALUES (?, ?, ?, ?, ?)"; 
	
	db.query(insertquery,[req.body.saleorder_id, req.body.saledate, req.body.customer_id, req.body.vehicle_id, req.body.saleprice],(err, result) => {
		if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.redirect('/saleorder');
				}
			});
});

// ==================================================
// Route to edit one specific record.
// URL: http://localsaleorder:3018/saleorder/1/
// ==================================================

router.get('/:recordid/edit', adminonly, function(req, res, next) {
	let query = "SELECT saleorder_id, saledate, customer_id, vehicle_id, saleprice FROM saleorder WHERE saleorder_id = " + req.params.recordid; 
	
	  // execute query
	  db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.render('saleorder/editrec', {onerec: result[0] });
			} 
		 });
});

// ==================================================
// Route to save edited data in database.
// ==================================================

router.post('/save', adminonly, function(req, res, next) {
	let updatequery = "UPDATE saleorder SET saledate = ?, customer_id = ?, vehicle_id = ?, saleprice = ? WHERE saleorder_id = " + req.body.saleorder_id; 

	db.query(updatequery,[req.body.saledate, req.body.customer_id, req.body.vehicle_id, req.body.saleprice],(err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.redirect('/saleorder');
		}
		});
});

// ==================================================
// Route to delete one specific record.
// ==================================================

router.get('/:recordid/delete', adminonly, function(req, res, next) {
	let query = "DELETE FROM saleorder WHERE saleorder_id = " + req.params.recordid;  
	
	  // execute query
	  db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.redirect('/saleorder');
			} 
		 });
	});


module.exports = router;

