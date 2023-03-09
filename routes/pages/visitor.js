var express = require('express');
var router = express.Router();
var path = require('path');

var logo = process.env.IMG_LOGO 
var logoText = process.env.IMG_LOGO_TEXT

router.get('/visitor', routeLoginAuthcitizenVISITOR, function(req, res, next) {
  res.render('forms/visitor/login', 
    {
    pageName: 'VISITOR',
    logo: logo,
    logoText: logoText
  });
});

router.get('/visitor-uploads', routePagecitizenVISITOR, function(req, res, next) {
  res.render('forms/visitor/index', 
    {
    pageName: 'VISITOR',
    logo: logo,
    logoText: logoText
  });
});



function routePagecitizenVISITOR(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache')
  if (req.session.citizenVISITORAuth === true ) {
    next();
  } else {
    res.redirect('/visitor');
  }
};

function routeLoginAuthcitizenVISITOR(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache')
  if (!req.session.citizenVISITORAuth || req.session.citizenVISITORAuth == false) {
    next();
  } else {
    res.redirect('/visitor-uploads');
  }
};


module.exports = router;