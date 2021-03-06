var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var books = require('./routes/books');
var sequelize = require('./models/index').sequelize;
var app = express();
var methodOverride = require('method-override')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(methodOverride('_method'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/books', books);

sequelize
  .authenticate()
  .then(function() {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

  sequelize.sync();//{ force: true }

  app.use(express.static(path.join(__dirname, 'public')));

  // catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render("page-not-found");
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log("==========ERROR===========");
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log("==========ERROR===========");
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
