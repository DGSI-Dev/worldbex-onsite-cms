var express = require('express');
var router = express.Router();
var path = require('path');

var logo = process.env.IMG_LOGO 
var logoText = process.env.IMG_LOGO_TEXT

router.get('/appReview', function(req, res, next) {
  res.render('forms/appReviews/index', 
    {
    pageName: 'App Reviews',
    logo: logo,
    logoText: logoText
  });
});

module.exports = router;