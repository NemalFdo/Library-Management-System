const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Book = require("../models/book");
const BorrowedBook = require("../models/BorrowedBook"); // Import BorrowedBook model

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and JPG formats are allowed"));
    }
    cb(null, true);
  },
});

// Middleware to validate book data
const validateBookData = (req, res, next) => {
  const { name, author, isbn, description } = req.body;
  if (!name || !author || !isbn || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }
  next();
};

// Add a new book
router.post("/", upload.single("image"), validateBookData, async (req, res) => {
  try {
    const { name, author, isbn, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newBook = new Book({ name, author, isbn, description, image });
    await newBook.save();

    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "Failed to add book", details: error.message });
  }
});

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

router.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const books = await Book.find({
      name: { $regex: q, $options: "i" }, // Case-insensitive search
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});


// Delete a book by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params; // Get the book ID from the URL params

  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });  // If book doesn't exist
    }

    // If the book has an associated image, delete the image from the file system
    if (book.image) {
      const imagePath = path.join(__dirname, "../", book.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        }
      });
    }

    // Delete the book from the database
    await Book.findByIdAndDelete(id);

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete the book", details: error.message });
  }
});

router.post("/borrowed-books", async (req, res) => {
  try {
    const borrowedBooks = req.body;

    // Validate the payload
    if (!Array.isArray(borrowedBooks) || borrowedBooks.length === 0) {
      return res.status(400).json({ error: "Invalid request payload. Provide an array of borrowed books." });
    }

    // Check that required fields are present for each book
    for (const book of borrowedBooks) {
      const { name, student, issuedDate, dueDate } = book;
      if (!name || !student || !issuedDate || !dueDate) {
        return res.status(400).json({ error: "Each book must have name, student, issuedDate, and dueDate." });
      }
    }

    // Insert borrowed books into the database
    const savedBooks = await BorrowedBook.insertMany(borrowedBooks);

    res.status(201).json({ message: "Borrowed books successfully added.", books: savedBooks });
  } catch (error) {
    console.error("Error adding borrowed books:", error);
    res.status(500).json({ error: "Failed to add borrowed books.", details: error.message });
  }
});

// Endpoint to get all borrowed books
router.get("/borrowed-books", async (req, res) => {
  try {
    const borrowedBooks = await BorrowedBook.find().populate("book");
    const modifiedBooks = borrowedBooks.map(book => ({
      id: book._id,  // Ensure the _id field is mapped to `id`
      name: book.name,
      student: book.student,
      issuedDate: book.issuedDate,
      dueDate: book.dueDate,
    }));

    res.status(200).json(modifiedBooks);
  } catch (error) {
    console.error("Error fetching borrowed books:", error);
    res.status(500).json({ error: "Failed to fetch borrowed books", details: error.message });
  }
});



// Update a book by its ID
router.put("/:id", upload.single("image"), validateBookData, async (req, res) => {
  try {
    const { name, author, isbn, description } = req.body;
    const { id } = req.params;

    const updateData = { name, author, isbn, description };

    // If an image is uploaded, update the image path and delete the old image
    if (req.file) {
      const book = await Book.findById(id);
      if (book && book.image) {
        const oldImagePath = path.join(__dirname, "../", book.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Failed to delete old image:", err);
        });
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Failed to update the book", details: error.message });
  }
});

// Delete a book by ID
router.delete("/borrowed-books/:id", async (req, res) => {
  const { id } = req.params; // Debugging line

  try {
    const borrowedBook = await BorrowedBook.findById(id);
    if (!borrowedBook) {
      return res.status(404).json({ error: "Borrowed book not found" });
    }

    // Optionally, delete the associated book from the Book collection
    const book = await Book.findById(borrowedBook.book);
    if (book) {
      await Book.findByIdAndDelete(borrowedBook.book);
    }

    await BorrowedBook.findByIdAndDelete(id);
    res.status(200).json({ message: "Borrowed book deleted successfully" });
  } catch (error) {
    console.error("Error deleting borrowed book:", error); // Debugging line
    res.status(500).json({ error: "Failed to delete the borrowed book", details: error.message });
  }
});


// Serve images statically
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = router;
