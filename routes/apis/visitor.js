var express = require('express');
var router = express.Router();
var request = require('request');
var multer = require('multer');
var upload = multer();
var moment = require('moment');
var momenttz = require('moment-timezone'); 
var fs = require('fs');
var _ = require('underscore');

router.post('/visitor/login', function (req, res) {
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
          req.session.citizenVISITOR = {}
          req.session.citizenVISITORAuth = true
          req.session.citizenVISITOR.userId = data.data.userId
          req.session.citizenVISITOR.firstName = data.data.firstName
          req.session.citizenVISITOR.lastName = data.data.lastName
          req.session.citizenVISITOR.mobileNumber = data.data.mobileNumber
          req.session.citizenVISITOR.email = data.data.email
          req.session.citizenVISITOR.company = data.data.company
          req.session.citizenVISITOR.position = data.data.position
          req.session.citizenVISITOR.token = data.token
          res.status(200).send({location: "/visitor-uploads"});
      }else{
        res.status(response.statusCode).send(body);
      }      
    } else {
      res.status(500).send(error);
    }
  });
});

router.post('/citizen-visitor-sign-out', function (req, res) {
  req.session.citizenVISITORAuth = false
  req.session.citizenVISITOR = null
  res.status(200).send('Successfully logged out');
});


router.get("/visitor/getEventVip", function (req, res) {
  request({
      uri: process.env.BASE_URL + "/api/users/auth/getEvent",
      method: "GET",
      headers: {
        authorization: 'bearer '+ req.session.citizenVISITOR.token
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

router.post("/visitor/createEventVisitorTransaction", function (req, res) {
  var body = req.body
  request({
      uri: process.env.BASE_URL + "/api/users/data/transaction/createEventVisitorTransaction",
      method: "POST",
      form: body,
      headers: {
        authorization: 'bearer '+ req.session.citizenVISITOR.token
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