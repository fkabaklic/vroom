var express = require('express');
var router = express.Router();

function adminonly(req,res,next){ 
	if (!req.session.admin) 
		{return res.render('customer/login', {message: "Need admin access. Login with admin credentials"});}
    next();
}

// ==================================================
// Route to list all records. Display view to list all records
// URL: https://localhost:3018/promotion/
// ==================================================

router.get('/', adminonly, function(req, res, next) {
let query = "SELECT promotion_id, promotitle, promoimage, description, startdate, enddate, discountrate FROM promotion"; 

  // execute query
  db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('promotion/allrecords', {allrecs: result });
 	});
});

// ==================================================
// Route to view one specific record. Notice the view is one record
//	URL: http://localhost:3018/promotion/1/show
// ==================================================

router.get('/:recordid/show', adminonly, function(req, res, next) {
	let query = "SELECT promotion_id, promotitle, promoimage, description, startdate, enddate, discountrate FROM promotion WHERE promotion_id = " + req.params.recordid; 
	
	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('promotion/onerec', {onerec: result[0] });
	} 
	});
});

// ==================================================
// Route to show empty form to obtain input form end-user.
// URL: http://localhost:3018/promotion/addrec
// ==================================================

router.get('/addrecord', adminonly, function(req, res, next) {
	res.render('promotion/addrec');
});

// ==================================================
// Route to obtain user input and save in database.
// ==================================================

router.post('/', adminonly, function(req, res, next) {

	let insertquery = "INSERT INTO promotion (promotion_id, promotitle, promoimage, description, startdate, enddate, discountrate) VALUES (?, ?, ?, ?, ?, ?, ?)"; 
	
	db.query(insertquery,[req.body.promotion_id, req.body.promotitle, req.body.promoimage, req.body.description, req.body.startdate, req.body.enddate, req.body.discountrate],(err, result) => {
		if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.redirect('/promotion');
				}
			});
});

// ==================================================
// Route to edit one specific record.
// URL: http://localhost:3018/promotion/1/
// ==================================================

router.get('/:recordid/edit', adminonly, function(req, res, next) {
	let query = "SELECT promotion_id, promotitle, promoimage, description, startdate, enddate, discountrate FROM promotion WHERE promotion_id = " + req.params.recordid; 
	
	  // execute query
	  db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.render('promotion/editrec', {onerec: result[0] });
			} 
		 });
});

// ==================================================
// Route to save edited data in database.
// ==================================================

router.post('/save', adminonly, function(req, res, next) {
	let updatequery = "UPDATE promotion SET promotitle = ?, promoimage = ?, description = ?, startdate = ?, enddate = ?, discountrate = ? WHERE promotion_id = " + req.body.promotion_id; 

	db.query(updatequery,[req.body.promotitle, req.body.promoimage, req.body.description, req.body.startdate, req.body.enddate, req.body.discountrate],(err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.redirect('/promotion');
		}
		});
});

// ==================================================
// Route to delete one specific record.
// ==================================================

router.get('/:recordid/delete', adminonly, function(req, res, next) {
	let query = "DELETE FROM promotion WHERE promotion_id = " + req.params.recordid;  
	
	  // execute query
	  db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.redirect('/promotion');
			} 
		 });
	});


module.exports = router;

