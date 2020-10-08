const express = require('express');
const app = express();
/*Home route redirects to book route */
app.get('/', (req, res) => {
   res.redirect('/books');
});
/*shows full list of books*/
app.get('/books', (req, res) => {
    res.send('')
});
/*shows the create new book form*/
app.get('/books/new', (req, res) => {

});
/*posts a new book to the database*/
app.post('/books/new',(req, res) => {

});
/*shows book detail form*/
app.use('/books/:id', (req, res, next) => {
   console.log('Request Id:', req.params.id);
});
/*updates book info in the database*/
app.post('/books/:id', (req, res, next) => {
   console.log('Request Id:', req.params.id);
});
/*deletes a book*/
app.post('/books/:id/delete', (req, res, next) => {
    console.log('Request Id:', req.params.id);
 });