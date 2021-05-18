var express = require('express');
var router = express.Router();
var book = require('../models/book');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect("/books?pageNumber=1")
   var all_books = function (req, res, next) {
    book.findAll().then(Books => {
      console.log(all_books);
      res.json(Books);
  });
  }
});

module.exports = router;
