var express = require('express');
var router = express.Router();
var request = require('request');
var multer = require('multer');
var upload = multer();
var moment = require('moment');
var momenttz = require('moment-timezone'); 
var fs = require('fs');
var _ = require('underscore');

router.post('/vip/login', function (req, res) {
  var body = req.body
  // {email/password}
  request({
    uri: process.env.BASE_URL + '/api/users/auth/login',
    method: 'POST',
    form: body
  }, function (error, response, body) {
    if (!error) {
      if(response.statusCode == 200){
        var data = JSON.parse(body);
          req.session.citizenVIP = {}
          req.session.citizenVIPAuth = true
          req.session.citizenVIP.userId = data.data.userId
          req.session.citizenVIP.firstName = data.data.firstName
          req.session.citizenVIP.lastName = data.data.lastName
          req.session.citizenVIP.mobileNumber = data.data.mobileNumber
          req.session.citizenVIP.email = data.data.email
          req.session.citizenVIP.company = data.data.company
          req.session.citizenVIP.position = data.data.position
          req.session.citizenVIP.token = data.token
          res.status(200).send({location: "/vip-uploads"});
      }else{
        res.status(response.statusCode).send(body);
      }      
    } else {
      res.status(500).send(error);
    }
  });
});

router.post('/citizen-vip-sign-out', function (req, res) {
  req.session.citizenVIPAuth = false
  req.session.citizenVIP = null
  res.status(200).send('Successfully logged out');
});


router.get("/getEventVip", function (req, res) {
  request({
      uri: process.env.BASE_URL + "/api/users/auth/getEvent",
      method: "GET",
      headers: {
        authorization: 'bearer '+ req.session.citizenVIP.token
      }
    },
    function (error, response, body) {
      if (!error) {
        res.status(response.statusCode).send(body);
      } else {
        res.status(500).send(error);
      }
    }
  );
});

router.post("/createEventVipTransaction", function (req, res) {
  var body = req.body
  request({
      uri: process.env.BASE_URL + "/api/users/data/transaction/createEventVipTransaction",
      method: "POST",
      form: body,
      headers: {
        authorization: 'bearer '+ req.session.citizenVIP.token
      }
    },
    function (error, response, body) {
      if (!error) {
        res.status(response.statusCode).send(body);
      } else {
        res.status(500).send(error);
      }
    }
  );
});

module.exports = router;