var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('contact', { title: 'Contact', success: false });
});

router.post('/', function(req, res, next) {
  res.render('contact', { title: 'Contact', success: true });
});

module.exports = router;
