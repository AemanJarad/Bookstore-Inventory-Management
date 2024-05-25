document.addEventListener('DOMContentLoaded', function () {
    const addBookForm = document.getElementById('addBookForm');
    const editBookForm = document.getElementById('editBookForm');
    const bookList = document.getElementById('bookList');

    // Function to fetch and display all books
    function fetchBooks() {
        fetch('/books')
            .then(response => response.json())
            .then(data => {
                bookList.innerHTML = ''; // Clear previous list
                data.forEach(book => {
                    const listItem = document.createElement('li');
                    listItem.className = 'bookItem';
                    listItem.innerHTML = `
                        <span>Title: ${book.title}</span><br>
                        <span>Author: ${book.author}</span><br>
                        <span>ISBN: ${book.isbn}</span><br>
                        <span>Publication Year: ${book.year}</span><br>
                        <span>Genre: ${book.genre}</span><br>
                        <button onclick="editBook('${book._id}', '${book.title}', '${book.author}', '${book.isbn}', ${book.year}, '${book.genre}')">Edit</button>
                        <button onclick="deleteBook('${book._id}')">Delete</button>
                    `;
                    bookList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching books:', error));
    }

    // Function to add a new book
    addBookForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(addBookForm);
        const bookData = {};
        formData.forEach((value, key) => {
            bookData[key] = value;
        });
        fetch('/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        })
        .then(response => {
            if (response.ok) {
                fetchBooks(); // Refresh book list
                addBookForm.reset(); // Clear form fields
                console.log('True')
            } else {
                console.error('Failed to add book:', response.statusText);
            }
        })
        .catch(error => console.error('Error adding book:', error));
    });

    // Function to edit a book
    window.editBook = function (id, title, author, isbn, year, genre) {
        editBookForm.elements.editTitle.value = title;
        editBookForm.elements.editAuthor.value = author;
        editBookForm.elements.editISBN.value = isbn;
        editBookForm.elements.editYear.value = year;
        editBookForm.elements.editGenre.value = genre;
        
        editBookForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const updatedBookData = {
                title: editBookForm.elements.editTitle.value,
                author: editBookForm.elements.editAuthor.value,
                isbn: editBookForm.elements.editISBN.value,
                year: editBookForm.elements.editYear.value,
                genre: editBookForm.elements.editGenre.value
            };
            fetch(`/books/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedBookData)
            })
            .then(response => {
                if (response.ok) {
                    fetchBooks(); // Refresh book list
                    editBookForm.reset(); // Clear form fields
                } else {
                    console.error('Failed to update book:', response.statusText);
                }
            })
            .catch(error => console.error('Error updating book:', error));
        });
    };

    // Function to delete a book
    window.deleteBook = function (id) {
        if (confirm('Are you sure you want to delete this book?')) {
            fetch(`/books/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    fetchBooks(); // Refresh book list
                } else {
                    console.error('Failed to delete book:', response.statusText);
                }
            })
            .catch(error => console.error('Error deleting book:', error));
        }
    };

    // Fetch and display initial list of books
    fetchBooks();
});
    