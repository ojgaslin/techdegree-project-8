//*require express to write handlers for requests w/ different http verbs at different url paths
const express = require('express');
//*group route handlers together and access them using common route-prefix express.router
const router = express.Router();
//*import book.js under models 
var Book = require("../models").Book;
//*books array is listed in descending order by author
const books = [
  {order: [["author", "DESC"]]}
]

/*shows full list of books*/
router.get('/', function(req, res, next) {
   Book.findAll({order: [["author", "DESC"]]}).then(function(books){
     //if search parameter, change to lower case, and find if book includes values that match search parameter
      if(req.query.search){
        var searchTerm = req.query.search.toLowerCase();
        var books = books.filter(book =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm) ||
          book.genre.toLowerCase().includes(searchTerm) ||
          book.year.toString().includes(searchTerm)
        )
      }
      
      if(req.query.pageNumber) {
        //*parse into integer to do math
        var page = parseInt(req.query.pageNumber);//page number if included in url query.
      }else {
        var page = 1;//default page number if it isn't in the url query.
      }
      if(req.query.limit){
        var limit = parseInt(req.query.limit);//for future enhancement.  User will be able to select how many books appear in a page.
      }else{
        var limit = 5;//default value
      }
        //*calculate variables needed for pagination
        var startingIndex = (page - 1) * limit;
        var endingIndex = page * limit;
        var numberOfPages = Math.ceil(books.length/limit);
        //*being sent to index.pug for use
        var results = {}
        results.limit = limit;
        results.pageNumber = req.query.pageNumber;
        //*checks if next button is needed
        if(endingIndex < books.length) {
        results.next = {
          pageNumber: page + 1
        }
      }
        //*checks if previous button is needed
        if(startingIndex > 0) {
          results.previous = {
          pageNumber: page - 1
        } 
      }
        //taking a slice from the array
        books = books.slice(startingIndex, endingIndex);
        console.log(books)
        console.log("limit: " + limit)
        console.log("page: " + page)
        console.log("ending index: " + endingIndex)
        //sending variables and their properties for use in index.pug
        res.render("books/index", { pageNumber: page, numberOfPages: numberOfPages, books: books, results: results, title: "All Books"});
      

   }).catch(function(error) {
     console.log(error);
    res.status(500).send(error);
      });
});
/*shows the create new book form*/
router.get('/new', function(req, res, next) {
  res.render("books/new-book", {book: {}, title: "New Book"});
});
/*posts a new book to the database*/
router.post('/new',function(req, res, next) {
   Book.create(req.body).then(function(book) {
     res.redirect("/books/");     
   }).catch(function(error){
       if(error.name === "SequelizeValidationError") {
          res.render("books/new-book", {book: Book.build(req.body), errors: error.errors, title: "New Book"})
       } else {
          throw error;
       }
   }).catch(function(error){
       res.status(500).send(error);
   });
});
/* GET individual article. */
router.get("/:id", function(req, res, next){
    //*finds book with id that was in param
  Book.findByPk(req.params.id).then(function(book){
    if(book) {//if book exists
      //*takes book and returns show.pug while passing in the found book data to pug page
      res.render("books/update-book", {book: book, title: book.title});
    } else {
      //*if doesn't exist return 404 error not found
      res.send(404);
    }
  }).catch(function(error){
      res.send(500, error);
   });
});

/*updates book info in the database*/
router.post('/:id', (req, res, next) => {
  console.log(req.params.id)
   //*finds id of book that was in param
   Book.findByPk(req.params.id).then(function(book){
      if(book) {
        //*if book exists, return updated book
        return book.update(req.body);
      } else {
        res.send(404);
      }
    }).then(function(book){
      //go back to book list
      res.redirect("/books");        
    }).catch(function(error){
        //render edit form with errors
        if(error.name === "SequelizeValidationError") {
          var book = Book.build(req.body);
          book.id = req.params.id;
          res.render("books/update-books", {book: book, errors: error.errors, title: "Update Books"})
        } else {
          throw error;
        }
    }).catch(function(error){
        res.send(500, error);
     });
  });

/*deletes a book*/
router.post('/:id/delete', (req, res, next) => {
   //*finds id of book that was in param
   Book.findByPk(req.params.id).then(function(book){  
      if(book) {
        return book.destroy();
      } else {
        res.send(404);
      }
    }).then(function(){
      res.redirect("/books");    
    }).catch(function(error){
        res.send(500, error);
     });
  });
 
  module.exports = router;