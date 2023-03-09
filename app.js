var dotenv = require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var hbs = require('hbs');

//PAGES
var routesPages = []
routesPages.push(require('./routes/pages/survey'))
routesPages.push(require('./routes/pages/vip'))
routesPages.push(require('./routes/pages/appReviews'))
// routesPages.push(require('./routes/pages/visitor'))
routesPages.push(require('./routes/pages/exhibitor'))
routesPages.push(require('./routes/pages/onsite'))

//APIS
var routesAPI = []
routesAPI.push(require('./routes/apis/survey'))
routesAPI.push(require('./routes/apis/vip'))
routesAPI.push(require('./routes/apis/appReviews'))
// routesAPI.push(require('./routes/apis/visitor'))
routesAPI.push(require('./routes/apis/exhibitor'))
routesAPI.push(require('./routes/apis/onsite'))
  
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);

hbs.registerPartials(path.join(__dirname, 'views/partials'));
hbs.registerPartials(path.join(__dirname, 'views/forms'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.urlencoded({limit: '50mb', extended: false, parameterLimit: '50000000000' }));
app.use(express.json({limit: '50mb'}));
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIE_SESSION],
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./'))

// //Maintenanace PAGE
// app.get('/logo', function(req, res) {
//   res.sendFile(path.join(__dirname + '/public/img/logos/logo.png')); //Pang Maintenance
// })
// app.get('/logoText', function(req, res) {
//   res.sendFile(path.join(__dirname + '/public/img/logos/worlbex.png')); //Pang Maintenance
// })
// app.get('*', function(req, res) {
//   res.render('forms/maintenance/maintenance');
// })

//LOAD PAGES
routesPages.forEach(obj => {
  app.use('/', obj);
})

//LOAD APIS
routesAPI.forEach(obj => {
  app.use('/api', obj);
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  // res.redirect('/')
  res.render("forms/404/404", {
    logo: process.env.TRACEV2_LOGO
  });
});

// Handling errors (send them to the client)
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
});


module.exports = app;
