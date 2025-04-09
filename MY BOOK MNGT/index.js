// Event listener for adding a new book
document.getElementById('bookForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevents the default form submission behavior

  // Get input values from the form fields
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const genre = document.getElementById('genre').value;
  const status = document.getElementById('status').value;
  const imageFile = document.getElementById('image').files[0]; // Get uploaded image file

  // If an image is uploaded, convert it to Base64 and add the book
  if (imageFile) {
      getBase64(imageFile, function (base64Image) {
          addBook(title, author, genre, status, base64Image);
      });
  } else {
      // If no image is uploaded, use a placeholder image
      addBook(title, author, genre, status, "cover-placeholder.jpg");
  }

  // Close the modal after submission
  bootstrap.Modal.getInstance(document.getElementById('addBookModal')).hide();
  document.getElementById('bookForm').reset(); // Reset the form fields
});

// Function to convert an image file to Base64 format for storage
function getBase64(file, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(file); // Read file as Data URL
  reader.onload = () => callback(reader.result); // Execute callback with Base64 data
}

// Function to add a new book and store it in localStorage
function addBook(title, author, genre, status, image) {
  const book = {
      id: new Date().getTime().toString(), // Generate a unique ID using timestamp
      title,
      author,
      genre,
      status,
      image,
      favorite: false, // Default favorite status is false
  };

  // Retrieve existing books from localStorage or initialize an empty array
  let books = JSON.parse(localStorage.getItem("books")) || [];
  books.push(book); // Add the new book to the array
  localStorage.setItem("books", JSON.stringify(books)); // Save updated book list to localStorage

  displayBooks(); // Refresh book list on the page
}

// Function to delete a book from localStorage
function deleteBook(bookId) {
  let books = JSON.parse(localStorage.getItem("books")) || [];
  books = books.filter(book => book.id !== bookId); // Remove the book with matching ID
  localStorage.setItem("books", JSON.stringify(books)); // Update localStorage
  displayBooks(); // Refresh the displayed books
}

// Function to toggle the favorite status of a book
function toggleFavorite(bookId) {
  let books = JSON.parse(localStorage.getItem("books")) || [];
  let book = books.find(book => book.id === bookId);
  if (book) {
      book.favorite = !book.favorite; // Toggle favorite status
      localStorage.setItem("books", JSON.stringify(books)); // Update localStorage
      displayBooks(); // Refresh the displayed books
  }
}

// Function to display books dynamically on the page
function displayBooks() {
  const bookList = document.getElementById("bookList");
  bookList.innerHTML = ""; // Clear the book list before rendering

  let books = JSON.parse(localStorage.getItem("books")) || [];

  // Loop through each book and create a card UI
  books.forEach(book => {
      const card = document.createElement("div");
      card.className = "col-md-3 mb-3"; // Bootstrap column styling
      card.innerHTML = `
          <div class="card shadow-sm">
              <img src="${book.image}" class="card-img-top" alt="Book Cover">
              <div class="card-body">
                  <h5 class="card-title" style="color:#0429fc; font-size: 30px;">${book.title}</h5>
                  <p class="card-text">Author: ${book.author}</p>
                  <p class="card-text"><small>Genre: ${book.genre}</small></p>
                  <p class="card-text"><small>Status: ${book.status}</small></p>
                  <button class="btn btn-sm btn-primary edit-btn" data-id="${book.id}"> 🖊️Edit</button>
                  <button class="btn btn-sm btn-danger delete-btn" data-id="${book.id}"> 🗑️Delete</button>
                  <button class="btn btn-sm btn-outline-warning favorite-btn" data-id="${book.id}">${book.favorite ? "❌Unfavorite" : "💟Favorite"}</button>
              </div>
          </div>
      `;
      bookList.appendChild(card); // Append book card to the list
  });

  // Attach event listeners to edit, delete, and favorite buttons
  document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', (e) => editBook(e.target.dataset.id)));
  document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', (e) => deleteBook(e.target.dataset.id)));
  document.querySelectorAll('.favorite-btn').forEach(btn => btn.addEventListener('click', (e) => toggleFavorite(e.target.dataset.id)));
}

// Initialize the book list when the page loads
document.addEventListener("DOMContentLoaded", displayBooks);

// Search input functionality
searchInput.oninput = () => {
  const searchTerm = searchInput.value.toLowerCase();
  const activeCategory = document.querySelector(".tab.active").dataset.category;
  displayBooks(activeCategory, searchTerm);
};






// storing books
let books = JSON.parse(localStorage.getItem("books")) || [];
console.log("Books loaded from localStorage:", books);

const bookList = document.getElementById("bookList");
const addBookBtn = document.getElementById("addBookBtn");
const bookModal = document.getElementById("addmodal");
const closeBtn = document.querySelector(".close");
const bookForm = document.getElementById("bookForm");
const searchInput = document.getElementById("searchInput");
const tabs = document.querySelectorAll(".tab");

// Save books to local storage
function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));   
    
}

// Render books
function displayBooks(category = "all", searchTerm = "") {
    console.log(bookList)
    bookList.innerHTML = "";

    const filteredBooks = books.filter(book => {
        const matchesCategory =    
             category === "all" || 
             (category === "favorites" && book.favorite) || 
             (category === "unread" && book.status === "Unread") || 
             (category === "read" && book.status === "Read");

       const matchesSearch = 
           book.title.toLowerCase().includes(searchTerm) ||
           book.author.toLowerCase().includes(searchTerm) ||
           book.genre.toLowerCase().includes(searchTerm);

       return matchesCategory && matchesSearch;
    });

    filteredBooks.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
        bookCard.innerHTML = `
            <img src="${book.image}" alt="Book Cover">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <button class="favorite" data-id="${book.id}">${book.favorite ? "★" : "☆"}</button>
            <button class="edit" data-id="${book.id}">🖊️ Edit</button> 
            <button class="delete" data-id="${book.id}">🗑️ Delete</button>
        `;
        bookList.appendChild(bookCard);
    });
}

// Open and close modal using Bootstrap
addBookBtn.onclick = () => $('#addmodal').modal('show');
closeBtn.onclick = () => $('#addmodal').modal('hide');

// Handle form submission
bookForm.onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById("bookId").value || Date.now().toString();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const genre = document.getElementById("genre").value;
    const status = document.getElementById("status").value;
    const imageFile = document.getElementById("image").files[0];

    const reader = new FileReader();
    reader.onload = () => {
        const newBook = { id, title, author, genre, status, favorite: false, image: reader.result };
    books = books.filter(b => b.id !== id); // Remove book if editing
    books.push(newBook);
    saveBooks();
    console.log("Books after saving:", books);  // Check books after saving
    $('#addmodal').modal('hide');  // Close the modal
    displayBooks();  // Update the book list
};
};



