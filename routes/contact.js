var express = require('express');
var router = express.Router();

/* get contact page. */
router.get('/', function(req, res, next) {
  res.render('contact');
});

module.exports = router;
