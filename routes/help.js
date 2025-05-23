var express = require('express');
var router = express.Router();

/* get help page. */
router.get('/', function(req, res, next) {
  res.render('help');
});

module.exports = router;
