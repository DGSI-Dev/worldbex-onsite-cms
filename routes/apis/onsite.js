var express = require('express');
var router = express.Router();
var request = require('request');
var multer = require('multer');
var upload = multer();
var moment = require('moment');
var momenttz = require('moment-timezone'); 
var fs = require('fs');
var _ = require('underscore');

router.get("/onsite/getEvents", function (req, res) {
  request({
      uri: process.env.BASE_URL_ONSITE + "/api/users/auth/getEvents",
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

router.post("/onsite/addPrintlogs", function (req, res) {
  var body = req.body
  request({
      uri: process.env.BASE_URL_ONSITE + "/api/users/auth/addPrintlogs",
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

router.post("/onsite/searchAttendee", function (req, res) {
  var body = req.body
  
  request({
    uri: process.env.BASE_URL_ONSITE + "/api/users/auth/searchAttendee",
    method: "POST",
    form: body,
  },
  function (error, response, body) {
    if (!error) {
      res.status(response.statusCode).send(body);
    } else {
      res.status(500).send(error);
    }
  });
});

router.post("/onsite/createAttendee", function (req, res) {
  var body = req.body
  // {title,  firstName, middleName,  lastName,  email, mobileNumber, companyName, designation, prcNumber, prcExpiry, survey } = body
  request({
      uri: process.env.BASE_URL_ONSITE + "/api/users/auth/createAttendee",
      method: "POST",
      form: body,
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

router.post("/onsite/updateAttendee/:attendeeId", function (req, res) {
  var body = req.body
  var { attendeeId } = req.params
  // {title,  firstName, middleName,  lastName,  email, mobileNumber, companyName, designation, prcNumber, prcExpiry} = body
  request({
      uri: process.env.BASE_URL_ONSITE + "/api/users/auth/updateAttendee/"+attendeeId,
      method: "POST",
      form: body,
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

//SYNC TO LOCAL
router.post("/onsite/searchDataFromCloudServer", function (req, res) {
  var body = req.body
  request({
      uri: process.env.BASE_URL + "/api/users/auth/searchDataFromCloudServer",
      method: "POST",
      form: body,
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
router.post("/onsite/syncToLocalServer", function (req, res) {
  var body = req.body
  request({
      uri: process.env.BASE_URL_ONSITE + "/api/users/syncing/syncToLocalServer",
      method: "POST",
      form: body,
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

//SYNC TO CLOUD
router.post("/onsite/searchDataFromLocalServer", function (req, res) {
  var body = req.body
  request({
      uri: process.env.BASE_URL_ONSITE + "/api/users/syncing/searchDataFromLocalServer",
      method: "POST",
      form: body,
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

router.post("/onsite/syncToCloudServer", function (req, res) {
  var body = req.body
  request({
      uri: process.env.BASE_URL + "/api/users/auth/syncToCloudServer",
      method: "POST",
      form: body,
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