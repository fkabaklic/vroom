var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

function adminonly(req,res,next){ 
	if (!req.session.admin) 
		{return res.render('customer/login', {message: "Need admin access. Login with admin credentials"});}
    next();
}


// ==================================================
// Route Enable Registration
// URL: http://localhost:3018/customer/register
// ==================================================
router.get('/register', function(req, res, next) {
	res.render('customer/addrec', { title: 'Create account' });
});

// ==================================================
// Route Provide Login Window
// ==================================================
router.get('/login', function(req, res, next) {
	res.render('customer/login', { title: 'Sign in', message: "" });
});

// ==================================================
// Route Check Login Credentials
// ==================================================
router.post('/login', function(req, res, next) {
  let query = "select customer_id, firstname, lastname, password, admin from customer WHERE username = '" + req.body.username + "'"; 
  // execute query
  db.query(query, (err, result) => {
		if (err) {res.render('error');} 
		else {
			if(result[0])
				{
				// Username was correct. Check if password is correct
				bcrypt.compare(req.body.password, result[0].password, function(err, result1) {
					if(result1) {
						// Password is correct. Set session variables for user.
						var custid = result[0].customer_id;
						req.session.customer_id = custid;
						var custname = result[0].firstname;
						req.session.custname = custname;
						var admin = result[0].admin;
						req.session.admin = admin;
						res.redirect('/');
					} else {
						// password do not match
						res.render('customer/login', {message: "Wrong Password"});
					}
				});
				}
			else {res.render('customer/login', {message: "Wrong Username"});}
		} 
 	});
});

// ==================================================
// Route Check Login Credentials
// URL: http://localhost:3018/customer/logout
// ==================================================
router.get('/logout', function(req, res, next) {
	req.session.customer_id = 0;
	req.session.custname = "";
   	req.session.cart=[];
    req.session.qty=[];
	req.session.admin = 0
	res.redirect('/');
});


// ==================================================
// Route to list all records. Display view to list all records
// URL: https://localhost:3018/customer/
// ==================================================

router.get('/', adminonly, function(req, res, next) {
let query = "SELECT customer_id, firstname, lastname, email, phone, address, city, state, zip, username, password, admin FROM customer"; 

  // execute query
  db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('customer/allrecords', {allrecs: result });
 	});
});


// ==================================================
// Route to update specific user account admin priviliges
//	URL: http://localhost:3018/customer/1/admin
// ==================================================

router.get('/:recordid/admin', adminonly, function(req, res, next) {
	let query = "UPDATE customer set admin = true WHERE customer_id = " + req.params.recordid; 
	
	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('/customer')
		} 
	});
});

// ==================================================
// Route to update specific user account to remove admin priviliges
//	URL: http://localhost:3018/customer/1/removeadmin
// ==================================================

router.get('/:recordid/removeadmin', adminonly, function(req, res, next) {
	let query = "UPDATE customer set admin = false WHERE customer_id = " + req.params.recordid; 
	
	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('/customer')
		} 
	});
});


// ==================================================
// Route to view one specific record. Notice the view is one record
//	URL: http://localhost:3018/customer/1/show
// ==================================================

router.get('/show', function(req, res, next) {
	let query = "SELECT customer_id, firstname, lastname, email, phone, address, city, state, zip, username FROM customer WHERE customer_id = " + req.session.customer_id; 
	
	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('customer/onerec', {onerec: result[0] });
	} 
	});
});

// ==================================================
// Route to show empty form for new password.
// URL: http://localhost:3018/customer/password
// ==================================================

router.get('/password',  function(req, res, next) {
	res.render('customer/password');
});


// ==================================================
// Route to show empty form to obtain input form end-user.
// URL: http://localhost:3018/customer/addrec
// ==================================================

router.get('/addrecord', adminonly,  function(req, res, next) {
	res.render('customer/addrec');
});

// ==================================================
// Route to obtain user input and save in database.
// ==================================================

router.post('/passwordsave', function(req, res, next) {

	let query = "select customer_id, password from customer WHERE customer_id = " + req.session.customer_id; 

  // execute query
  db.query(query, (err, result) => {
		if (err) 
			{res.render('error');} 
		else {	
				bcrypt.compare(req.body.current, result[0].password, function(err, result1) {
					if(result1) {
						let updatequery = "UPDATE customer set password = ? WHERE customer_id = " + req.session.customer_id; 
							bcrypt.genSalt(10, (err, salt) => {
								bcrypt.hash(req.body.new, salt, (err, hash) => {
									db.query(updatequery,[hash],(err, result2) => {
										if (err) {
												console.log(err);
												res.render('error');
											} else {
												res.redirect('/customer/show');
											}
										});
								});
							});	
						}
					});
				}
		});
	});


// ==================================================
// Route to obtain user input and save in database.
// ==================================================

router.post('/', function(req, res, next) {

	let insertquery = "INSERT INTO customer (customer_id, firstname, lastname, email, phone, address, city, state, zip, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"; 

	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(req.body.password, salt, (err, hash) => {

	
	db.query(insertquery,[req.body.customer_id, req.body.firstname, req.body.lastname, req.body.email, req.body.phone, req.body.address, req.body.city, req.body.state, req.body.zip, req.body.username, hash],(err, result) => {
		if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.redirect('/login');
				}
			});
		});
	});	
});

// ==================================================
// Route to edit one specific record.
// URL: http://localhost:3018/customer/edit
// ==================================================

router.get('/edit', function(req, res, next) {
	let query = "SELECT customer_id, firstname, lastname, email, phone, address, city, state, zip FROM customer WHERE customer_id = " + req.session.customer_id; 
	
	  // execute query
	  db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.render('customer/editrec', {onerec: result[0] });
			} 
		 });
});

// ==================================================
// Route to save edited data in database.
// ==================================================

router.post('/save', function(req, res, next) {
	let updatequery = "UPDATE customer SET firstname = ?, lastname = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, zip = ? WHERE customer_id = " + req.body.customer_id; 

	db.query(updatequery,[req.body.firstname, req.body.lastname, req.body.email, req.body.phone, req.body.address, req.body.city, req.body.state, req.body.zip],(err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.redirect('/');
		}
		});
});

// ==================================================
// Route to delete one specific record.
// ==================================================

router.get('/:recordid/delete',adminonly, function(req, res, next) {
	let query = "DELETE FROM customer WHERE customer_id = " + req.params.recordid;  
	
	  // execute query
	  db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.redirect('/customer');
			} 
		 });
	});


module.exports = router;

