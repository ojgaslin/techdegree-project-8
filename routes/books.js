const express = require('express');
const router = express.Router();
var Book = require("../models").Book;



/*404 error handler*/
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   res.render("", error)
// });

/*shows full list of books*/
router.get('/', function(req, res, next) {
   Book.findAll({order: [["author", "DESC"]]}).then(function(books){
      res.render("books/index", {books: books, title: "All Books"});
   }).catch(function(error) {
       res.send(500, error);
      });
});
/*shows the create new book form*/
router.get('/new', function(req, res, next) {
   res.render("books/new", {book: {}, title: "New Book"});
});
/*posts a new book to the database*/
router.post('/new',function(req, res, next) {
   Book.create(req.body).then(function(book) {
     res.redirect("/books/:id");     
   }).catch(function(error){
       if(error.name === "SequelizeValidationError") {
          res.render("books/new", {book: Book.build(req.body), errors: error.errors, title: "New Book"})
       } else {
          throw error;
       }
   }).catch(function(error){
       res.send(500, error);
   });
});
/*shows book detail form*/
router.use('/:id', (req, res, next) => {
   res.render("books/show", {book: {}, title: "Book Information"});
   console.log('Request Id:', req.params.id);
});

/* Edit Book List. */
router.get("/:id/edit", function(req, res, next){
   Book.findById(req.params.id).then(function(book){
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
   Book.findById(req.params.id).then(function(book){
      if(book) {
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

/*deletes a book*/
router.delete('/:id/delete', (req, res, next) => {
   Book.findById(req.params.id).then(function(book){  
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