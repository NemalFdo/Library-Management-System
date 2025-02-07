const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: false },  // Store the file path or URL for the image
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model("Book", bookSchema);
