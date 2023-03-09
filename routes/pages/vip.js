var express = require('express');
var router = express.Router();
var path = require('path');

var logo = process.env.IMG_LOGO 
var logoText = process.env.IMG_LOGO_TEXT

router.get('/vip', routeLoginAuthcitizenVIP, function(req, res, next) {
  res.render('forms/vip/login', 
    {
    pageName: 'VIP',
    logo: logo,
    logoText: logoText
  });
});

router.get('/vip-uploads', routePagecitizenVIP, function(req, res, next) {
  res.render('forms/vip/index', 
    {
    pageName: 'VIP',
    logo: logo,
    logoText: logoText
  });
});



function routePagecitizenVIP(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache')
  if (req.session.citizenVIPAuth === true ) {
    next();
  } else {
    res.redirect('/vip');
  }
};

function routeLoginAuthcitizenVIP(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache')
  if (!req.session.citizenVIPAuth || req.session.citizenVIPAuth == false) {
    next();
  } else {
    res.redirect('/vip-uploads');
  }
};


module.exports = router;