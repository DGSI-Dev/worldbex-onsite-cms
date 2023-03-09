var express = require('express');
var router = express.Router();
var request = require('request');
var multer = require('multer');
var upload = multer();
var moment = require('moment');
var momenttz = require('moment-timezone'); 
var fs = require('fs');
var _ = require('underscore');
  
router.get("/appReview/getExhibitorAppSurvey/:exhibitorUid", function (req, res) {
  var { exhibitorUid } = req.params
  request({
      uri: process.env.BASE_URL_EXHIBITOR_APP + "/api/exhibitor/scans/getExhibitorAppSurvey/"+exhibitorUid,
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

router.post("/appReview/answerAppSurvey", function (req, res) {
  var body = req.body
  request({
      uri: process.env.BASE_URL_EXHIBITOR_APP + "/api/exhibitor/scans/answerAppSurvey",
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

module.exports = router; 