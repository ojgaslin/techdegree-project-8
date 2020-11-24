require ("/routes").books;
/*pagination for book list page*/

button.addEventListener('click', event => {
    
  });
var totalBooks = books.length;
var itemsPerPage = 10; 
var numberOfPages = ceil(totalBooks / itemsPerPage);
var currentPage = 1;
var startingIndex = (currentPage - 1) * itemsPerPage;
var endIndex = currentPage * itemsPerPage;
var page = Books.slice(startingIndex, endIndex)


