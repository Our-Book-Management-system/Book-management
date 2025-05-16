let books = [];  // to store the books

// Display books 
function displayBooks() {
    const bookList = document.getElementById("bookList");
    const favoriteList = document.getElementById("favoriteList");
    const unreadList = document.getElementById("unreadList");
    const readList = document.getElementById("readList");

    bookList.innerHTML = "";
    favoriteList.innerHTML = "";
    unreadList.innerHTML = "";
    readList.innerHTML = "";

    books = JSON.parse(localStorage.getItem("books")) || [];

    books.forEach(book => {
        const card = document.createElement("div");
        card.className = "col-md-3 mb-3";
        card.innerHTML = `
            <div class="card shadow-sm border-0 rounded-lg">
                <div class="position-relative">
                    <img src="${book.image || 'https://via.placeholder.com/150'}" class="card-img-top rounded-top img-fluid" style="height: 180px; object-fit: cover;" alt="${book.title}">
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
        if (book.favorite) favoriteList.appendChild(card.cloneNode(true));
        if (book.status === "Unread") unreadList.appendChild(card.cloneNode(true));
        if (book.status === "Read") readList.appendChild(card.cloneNode(true));
    });

    attachEventListeners();
}

// Attach listeners to buttons
function attachEventListeners() {
    document.querySelectorAll('.edit-btn').forEach(btn =>
        btn.addEventListener('click', (e) => editBook(e.target.dataset.id))
    );
    document.querySelectorAll('.delete-btn').forEach(btn =>
        btn.addEventListener('click', (e) => deleteBook(e.target.dataset.id))
    );
    document.querySelectorAll('.favorite-btn').forEach(btn =>
        btn.addEventListener('click', (e) => toggleFavorite(e.target.dataset.id))
    );
}

// Edit book
function editBook(bookId) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    const book = books.find(b => b.id === bookId);
    if (book) {
        const newTitle = prompt("Edit book title:", book.title);
        if (newTitle) {
            book.title = newTitle;
            localStorage.setItem("books", JSON.stringify(books));
            displayBooks();
        }
    }
}

// Delete book
function deleteBook(bookId) {
    books = books.filter(b => b.id !== bookId);
    localStorage.setItem("books", JSON.stringify(books));
    displayBooks();
}

// Toggle favorite
function toggleFavorite(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        book.favorite = !book.favorite;
        localStorage.setItem("books", JSON.stringify(books));
        displayBooks();
    }
}

// Save book to list
function saveBook(imageDataURL) {
    const newBook = {
        id: Date.now().toString(),
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        genre: document.getElementById("genre").value,
        status: document.getElementById("status").value,
        image: imageDataURL,
        favorite: false
    };

    books.push(newBook);
    localStorage.setItem("books", JSON.stringify(books));
    displayBooks();
    bootstrap.Modal.getInstance(document.getElementById("addBookModal")).hide();
    document.getElementById("bookForm").reset();
}


document.getElementById("bookForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const imageInput = document.getElementById("image");
    const file = imageInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            const imageDataURL = reader.result;
            saveBook(imageDataURL);
        };
        reader.readAsDataURL(file);
    } else {
        saveBook('');
    }
});


document.addEventListener("DOMContentLoaded", displayBooks);
