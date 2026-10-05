const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (users.some((user) => user.username === username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: "User successfully registered"
  });
});

// Internal book data endpoint for Axios requests
public_users.get('/books', function (req, res) {
  res.json(books);
});

// Get all books
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    const isbn = req.params.isbn;

    if (response.data[isbn]) {
      res.json(response.data[isbn]);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve book" });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    const author = req.params.author;

    const matchingBooks = Object.values(response.data).filter(
      (book) => book.author.toLowerCase() === author.toLowerCase()
    );

    res.json(matchingBooks);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve books" });
  }
});

// Get book details based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    const title = req.params.title;

    const matchingBooks = Object.values(response.data).filter(
      (book) => book.title.toLowerCase() === title.toLowerCase()
    );

    res.json(matchingBooks);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve books" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;