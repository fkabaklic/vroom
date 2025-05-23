var express = require('express');
var router = express.Router();

// ==================================================
// Route to list all products on the catalog
// ==================================================
router.get('/', function(req, res, next) {
	let query = "SELECT vehicle_id, prodimage, description, duration, vehicle_type, daily_fee, status, renter_id, host_id, review_id, featured FROM vehicle"; 
   

  // execute query
  db.query(query, (err, result) => {
  if (err) {
          res.redirect('/');
      }
  res.render('catalog', {allrecs: result });
   });
});

// ==================================================
// Route to add an item to the cart
// URL: http://localhost300:3018/catalog/add
// ==================================================
router.post('/add', function(req, res, next) {
	if (typeof req.session.cart !== 'undefined' && req.session.cart ) {
		if (req.session.cart.includes(req.body.vehicle_id))
			{
				// Item Exists in Basket - Increase Quantity 
				var n = req.session.cart.indexOf(req.body.vehicle_id);
				
			}
		else
			{
				// Item Being Added First Time
				req.session.cart.push(req.body.vehicle_id);
				req.session.qty.push(req.body.qty);
			}
	}else {
		var cart = [];
		cart.push(req.body.vehicle_id);
		req.session.cart = cart;
	}
  res.redirect('/catalog/cart');
});

// ==================================================
// Route to show shopping cart
// URL: http://localhost:3018/catalog/cart
// ==================================================
router.get('/cart', function(req, res, next) {
	if (!Array.isArray(req.session.cart) || !req.session.cart.length){
		res.render('cart', {cartitems: 0 });
	} else {	

 		let query = "SELECT vehicle_id, prodimage, description, duration, vehicle_type, daily_fee, status, renter_id, host_id, review_id, featured FROM vehicle WHERE vehicle_id IN (" + req.session.cart + ") order by find_in_set(vehicle_id, '" + req.session.cart + "');"; 

		// execute query
		db.query(query, (err, result) => {
			if (err) 
          {res.render('error');} 
      else  {
          res.render('cart', {cartitems: result, qtys: req.session.qty  });}
		});
	}
});

// ==================================================
// Route to remove an item from the cart
// URL: Localhost:3018/catalog/remove
// ==================================================
router.post('/remove', function(req, res, next) {
	// Find the element index of the auto_id that needs to be removed
  var n = req.session.cart.indexOf(req.body.vehicle_id_id);
  
  // Remove element from cart and quantity arrays
  req.session.cart.splice(n,1);

	 res.redirect('/catalog/cart');

});

// ==================================================
// Route save cart items to SALEORDER and ORDERDETAILS tables
// URL: http://localhost:3018/catalog/checkout
// ==================================================
router.get('/checkout', function(req, res, next) {
	var proditemprice = 0;
	// Check to make sure the customer has logged-in
	if (typeof req.session.customer_id !== 'undefined' && req.session.customer_id ) {
		// Save SALEORDER Record:
		
				req.session.cart.forEach((cartitem, index) => { 
					// Perform ORDERDETAIL table insert
					let insertquery = "INSERT INTO saleorder( saledate, customer_id, vehicle_id, saleprice) VALUES (now(), ?, ?, (SELECT daily_fee from vehicle where vehicle_id = " + cartitem + "))";
					db.query(insertquery,[req.session.customer_id, parseInt(cartitem)],(err, result) => {
						if (err) {
							
							console.log(err);
							
							res.render('error');}
					});
				});
				// Empty out the items from the cart and quantity arrays
				req.session.cart = [];
				req.session.qty = [];
				// Display confirmation page
				res.render('checkout', {ordernum: 1 });		
				}
	else {
		// Prompt customer to login
		res.redirect('/customer/login');
	}
});

module.exports = router;
