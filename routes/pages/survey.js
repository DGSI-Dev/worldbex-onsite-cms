var express = require('express');
var router = express.Router();
var path = require('path');

var logo = process.env.IMG_LOGO 
var logoText = process.env.IMG_LOGO_TEXT

router.get('/survey', function(req, res, next) {
  res.render('forms/survey/index', 
    {
    pageName: 'SURVEY',
    logo: logo,
    logoText: logoText
  });
});

router.get('/manualsync', function (req, res, next) {
  res.render('forms/survey/manualsync', 
    {
    pageName: 'Manual Syncing',
    logo: logo,
    logoText: logoText
  });
});

router.get('/surveyadmin', function(req, res, next) {
  res.render('forms/survey/surveyAdmin/index', 
    {
    pageName: 'SURVEY ADMIN',
    logo: logo,
    logoText: logoText
  });
});

module.exports = router;