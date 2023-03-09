var express = require('express');
var router = express.Router();
var path = require('path');

var logo = process.env.IMG_LOGO 
var logoText = process.env.IMG_LOGO_TEXT

router.get('/onsite', function (req, res, next) {
  res.redirect('/onsite-registration')
  // res.render('forms/onsite/login', 
  //   {
  //   pageName: 'ONSITE',
  //   logo: logo,
  //   logoText: logoText
  // });
});

// router.get('/onsite-registration', routePageOnsite, function(req, res, next) {
router.get('/onsite-registration', function(req, res, next) {
  res.render('forms/onsite/registration', 
    {
    pageName: 'REGISTRATION',
    logo: logo,
    logoText: logoText
  });
});

router.get('/onsite-guests', function(req, res, next) {
  res.render('forms/onsite/guests', 
    {
    pageName: 'GUESTS',
    logo: logo,
    logoText: logoText
  });
});

router.get('/onsite-manualsync', function(req, res, next) {
  res.render('forms/onsite/manualsync', 
    {
    pageName: 'Manual Syncing',
    logo: logo,
    logoText: logoText
  });
});

router.get('/onsite-customprint', function (req, res, next) {
  res.render('forms/onsite/customprint', 
    {
    pageName: 'CUSTOM PRINT',
    logo: logo,
    logoText: logoText
  });
});

router.get('/ambulant', function (req, res, next) {
  res.render('forms/onsite/ambulant', 
    {
    pageName: 'AMBULANT',
    logo: logo,
    logoText: logoText
  });
});

function routePageOnsite(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache')
  if (req.session.citizenVIPAuth === true ) {
    next();
  } else {
    res.redirect('/onsite');
  }
};

function routeLoginAuthOnsite(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache')
  if (!req.session.citizenVIPAuth || req.session.citizenVIPAuth == false) {
    next();
  } else {
    res.redirect('/onsite-registration');
  }
};


module.exports = router;