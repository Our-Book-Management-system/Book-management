// Function to display books with better image placement
function displayBooks() {
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = ""; 
  
    let books = JSON.parse(localStorage.getItem("books")) || [];
  
    books.forEach(book => {
      const card = document.createElement("div");
      card.className = "col-md-3 mb-3"; // Bootstrap column for responsiveness
      card.innerHTML = `
        <div class="card shadow-sm border-0 rounded-lg">
          <div class="position-relative">
            <img src="${book.image}" class="card-img-top rounded-top img-fluid" style="height: 180px; object-fit: cover;" alt="${book.title}">
            <span class="badge bg-${book.status === 'Read' ? 'success' : 'secondary'} position-absolute top-0 start-0 m-2">
              ${book.status}
            </span>
          </div>
          <div class="card-body text-center">
            <h5 class="card-title text-primary fw-bold">${book.title}</h5>
            <p class="card-text text-muted mb-1">Author: <strong>${book.author}</strong></p>
            <p class="card-text">Genre: <span class="badge bg-info text-dark">${book.genre}</span></p>
            <div class="d-flex justify-content-around mt-3">
              <button class="btn btn-sm btn-primary edit-btn" data-id="${book.id}">🖊️ Edit</button>
              <button class="btn btn-sm btn-danger delete-btn" data-id="${book.id}">🗑️ Delete</button>
            </div>
            <button class="btn btn-sm ${book.favorite ? "btn-warning" : "btn-outline-warning"} w-100 mt-2 favorite-btn" data-id="${book.id}">
              ${book.favorite ? "❌ Unfavorite" : "💟 Favorite"}
            </button>
          </div>
        </div>
      `;
      bookList.appendChild(card);
    });
  
    // Attach event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', (e) => editBook(e.target.dataset.id)));
    document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', (e) => deleteBook(e.target.dataset.id)));
    document.querySelectorAll('.favorite-btn').forEach(btn => btn.addEventListener('click', (e) => toggleFavorite(e.target.dataset.id)));
  }
  
  // Function to edit a book
  function editBook(bookId) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    const book = books.find(b => b.id === bookId);
    if (book) {
      // Example: Prompt user to edit book details
      const newTitle = prompt("Edit book title:", book.title);
      if (newTitle) {
        book.title = newTitle;
        localStorage.setItem("books", JSON.stringify(books));
        displayBooks();
      }
    }
  }
  
  // Function to delete a book
  function deleteBook(bookId) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books = books.filter(b => b.id !== bookId);
    localStorage.setItem("books", JSON.stringify(books));
    displayBooks();
  }
  
  // Function to toggle favorite status
  function toggleFavorite(bookId) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    const book = books.find(b => b.id === bookId);
    if (book) {
      book.favorite = !book.favorite;
      localStorage.setItem("books", JSON.stringify(books));
      displayBooks();
    }
  }
  
  // Load books on page load
  document.addEventListener("DOMContentLoaded", displayBooks);
  