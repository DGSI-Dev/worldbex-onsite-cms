var express = require('express');
var router = express.Router();
var request = require('request');
var multer = require('multer');
var upload = multer();
var moment = require('moment');
var momenttz = require('moment-timezone'); 
var fs = require('fs');
var _ = require('underscore');
  

router.get("/getEvent", function (req, res) {
  request({
      uri: process.env.BASE_URL + "/api/users/auth/getEvent",
      method: "GET"
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

router.post("/getEventPrices", function (req, res) {
  var body = req.body
  request({
      uri: process.env.BASE_URL + "/api/users/auth/getEventPrices",
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

router.post("/claimEventPrice", function (req, res) {
  var body = req.body
  request({
      uri: process.env.BASE_URL + "/api/users/auth/claimEventPrice",
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

router.post("/getEventSurvey", function (req, res) {
  var body = req.body
  request({
      uri: process.env.BASE_URL + "/api/users/auth/getEventSurvey",
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

router.post("/answerEventSurvey", function (req, res) {
  var body = req.body
  request({
      uri: process.env.BASE_URL + "/api/users/auth/answerEventSurvey",
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


///ADMIN
router.get("/surveyadmin/getEventPrices/:areaCode", function (req, res) {
  let { areaCode } = req.params 
  request({
    uri: process.env.BASE_URL + "/api/users/cms/survey/getEventPrices/" + areaCode,
      method: "GET"
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

router.post("/surveyadmin/addEventPrices", function (req, res) {
  var body = req.body
  request({
      uri: process.env.BASE_URL + "/api/users/cms/survey/addEventPrices",
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

router.post("/surveyadmin/updateSelectedPrices", function (req, res) {
  var body = req.body
  // {selected : [{id:1,isSelected:1},{id:2,isSelected:1},{id:3,isSelected:3}]}
  request({
      uri: process.env.BASE_URL + "/api/users/cms/survey/updateSelectedPrices",
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

router.post("/surveyadmin/updateViewablePrices", function (req, res) {
  var body = req.body
  // { id, isVisible}
  request({
      uri: process.env.BASE_URL + "/api/users/cms/survey/updateViewablePrices",
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

router.post("/surveyadmin/editEventPrices/:id", function (req, res) {
  var body = req.body
  var { id } = req.params
  request({
      uri: process.env.BASE_URL + "/api/users/cms/survey/editEventPrices/"+id,
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