const mongoose = require("mongoose");

const BorrowedBookSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  name: { type: String, required: true },
  student: { type: String, required: true },
  issuedDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
});

module.exports = mongoose.model("BorrowedBook", BorrowedBookSchema);
