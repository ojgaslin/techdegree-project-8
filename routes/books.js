const express = require('express');
const router = express.Router();
var Book = require("../models").Book;



/*shows full list of books*/
router.get('/', function(req, res, next) {
   Book.findAll({order: [["author", "DESC"]]}).then(function(books){
     //check to see if you have anything for a search parameter  -- see line 51 to see how to access parameter
      if(req.query.search){
        var searchTerm = req.query.search.toLowerCase();
        var books = books.filter(book =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm) ||
          book.genre.toLowerCase().includes(searchTerm) ||
          book.year.toString().includes(searchTerm)
        )
      }
      var booksPerPage = 4;
      if(req.query.pageNumber) {
        var pageNumber = req.query.pageNumber;
        var startingIndex = (pageNumber - 1) * booksPerPage;
        var endingIndex = pageNumber * booksPerPage;
        var numberOfPages = Math.ceil(books.length/booksPerPage);
        var books = books.slice(startingIndex, endingIndex);
        res.render("books/index", { pageNumber: pageNumber, numberOfPages: numberOfPages, books: books, title: "All Books"});
      } else{
        res.render("books/index", { books: books, title: "All Books"});
      }

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
router.post('/',function(req, res, next) {
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
  Book.findByPk(req.params.id).then(function(book){//same as line 77.  finds article with id that was in param
    if(book) {//if it exists
      res.render("books/show", {book: book, title: book.title});//take the article and return show.pug while passing in the found article data to the pug page.
    } else {
      res.send(404);//if it didn't exist return 404 not found.
    }
  }).catch(function(error){
      res.send(500, error);
   });
});


/* Edit Book List. */
router.get("/:id/edit", function(req, res, next){
   Book.findByPk(req.params.id).then(function(book){
     if(book) {
       res.render("books/edit", {book: book, title: "Edit Books"});      
     } else {
       res.send(404);
     }
   }).catch(function(error){
       res.send(500, error);
    });
 });

/*updates book info in the database*/
router.put('/:id', (req, res, next) => {
  console.log(req.params.id)
   Book.findByPk(req.params.id).then(function(book){
      if(book) {
        console.log(book)
        return book.update(req.body);
      } else {
        res.send(404);
      }
    }).then(function(book){
      res.redirect("/books");        
    }).catch(function(error){
        if(error.name === "SequelizeValidationError") {
          var book = Book.build(req.body);
          book.id = req.params.id;
          res.render("books/edit", {book: book, errors: error.errors, title: "Edit Books"})
        } else {
          throw error;
        }
    }).catch(function(error){
        res.send(500, error);
     });
  });

  /*Deletes Book Form, returns to All Books page*/
  router.get("/:id/delete", function(req, res, next){
    Book.findByPk(req.params.id).then(function(book){
      if(book) {
        res.render("books/delete", {book: book, title: "Delete Book"});
      } else {
        res.send(404);
      }
    }).catch(function(error){
        res.send(500, error);
     });
  });

/*deletes a book*/
router.delete('/:id', (req, res, next) => {
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