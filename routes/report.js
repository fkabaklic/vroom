var express = require('express');
var router = express.Router();

function adminonly(req,res,next){ 
	if (!req.session.admin) 
		{return res.render('customer/login', {message: "Need admin access. Login with admin credentials"});}
    next();
}

// ==================================================
// Route to display view to report menu
// URL: https://localhost:3018/report
// ==================================================

router.get('/', adminonly, function(req, res, next) {
	res.render('report/menu');
});


// ==================================================
// Route to list all records. Display view to list all records
// URL: https://localhost:3018/report/customer/
// ==================================================

router.get('/customer', adminonly, function(req, res, next) {
let query = "SELECT customer_id, firstname, lastname, email, phone, address, city, state, zip, username, password FROM customer"; 

  // execute query
  db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('report/cust_list', {allrecs: result });
 	});
});


// ==================================================
// Route to list all records. Display view to list all records
// URL: https://localhost:3018/report/vehicle_list
// ==================================================

router.get('/vehicle', adminonly, function(req, res, next) {
	let query = "SELECT vehicle_id, prodimage, description, duration, vehicle_type, daily_fee, status, renter_id, host_id, review_id, featured FROM vehicle"; 
	
	  // execute query
	  db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			}
		res.render('report/vehicle_list', {allrecs: result });
		 });
	});


// ==================================================
// Route to list all records. Display view to list all records
// URL: https://localsaleorder:3018/sale/
// ==================================================

router.get('/sale', adminonly, function(req, res, next) {
	let query = "SELECT s.saleorder_id saleorder_id, c.customer_id customer_id, c.firstname firstname, c.lastname lastname, s.saledate saledate, v.description description, v.duration duration, v.vehicle_id vehicle_id FROM saleorder s, vehicle v, customer c WHERE s.saleorder_id AND v.vehicle_id AND s.customer_id = c.customer_id"; 
	
	  // execute query
	  db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			}
		res.render('report/sale_list', {allrecs: result });
		 });
	});

module.exports = router;

