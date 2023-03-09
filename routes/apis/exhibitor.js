var express = require('express');
var router = express.Router();
var request = require('request');
var multer = require('multer');
var upload = multer();
var moment = require('moment');
var momenttz = require('moment-timezone'); 
var fs = require('fs');
var _ = require('underscore');
  
router.post("/exhibitor/signup", function (req, res) {
  var body = req.body
  request({
      uri: process.env.BASE_URL_EXHIBITOR + "/api/users/auth/signup",
      method: "POST",
      form: body
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
  
router.post("/exhibitor/updateExhibitor/:exhibitorId", function (req, res) {
  var body = req.body
  var { exhibitorId } = req.params
  request({
      uri: process.env.BASE_URL_EXHIBITOR + "/api/users/auth/updateExhibitor/"+exhibitorId,
      method: "POST",
      form: body
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

router.get("/exhibitor/getExhibitorList", function (req, res) {
  request({
      uri: process.env.BASE_URL_EXHIBITOR + "/api/users/auth/getExhibitorList",
      method: "GET",
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