var express = require('express');
var router = express.Router();

/* get privacy page. */
router.get('/', function(req, res, next) {
  res.render('privacy');
});

module.exports = router;
