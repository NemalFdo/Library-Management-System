"use client";
import React, { useState } from "react";
import SideNav from "@/components/layout/AdminNav";
import Modal from "@/components/layout/Modal";

const ReturnedBooksPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBookIndex, setCurrentBookIndex] = useState<number | null>(null);
  const [newReturnBook, setNewReturnBook] = useState({
    name: "",
    studentId: "",
    issuedDate: "",
    returnedDate: "",
  });

  const [returnedBooks, setReturnedBooks] = useState([
    { name: "Harry Potter", studentId: "00145", issuedDate: "01-12-2025", returnedDate: "01-01-2025" },
    { name: "The Great Gatsby", studentId: "00146", issuedDate: "01-12-2025", returnedDate: "02-01-2025" },
    { name: "Moby Dick", studentId: "00147", issuedDate: "01-12-2025", returnedDate: "03-01-2025" },
    { name: "Moby Dick", studentId: "00147", issuedDate: "01-12-2025", returnedDate: "03-01-2025" },
    { name: "Moby Dick", studentId: "00147", issuedDate: "01-12-2025", returnedDate: "03-01-2025" },
    { name: "Moby Dick", studentId: "00147", issuedDate: "01-12-2025", returnedDate: "03-01-2025" },
    { name: "Moby Dick", studentId: "00147", issuedDate: "01-12-2025", returnedDate: "03-01-2025" },
  ]);

  const handleOpenModal = (index: number | null = null) => {
    if (index !== null) {
      setIsEditMode(true);
      setCurrentBookIndex(index);
      setNewReturnBook(returnedBooks[index]);
    } else {
      setIsEditMode(false);
      setNewReturnBook({ name: "", studentId: "", issuedDate: "", returnedDate: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBookIndex(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewReturnBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrEditReturnBook = () => {
    if (isEditMode && currentBookIndex !== null) {
      setReturnedBooks((prevBooks) => prevBooks.map((book, index) => (index === currentBookIndex ? newReturnBook : book)));
    } else {
      setReturnedBooks((prevBooks) => [...prevBooks, newReturnBook]);
    }
    handleCloseModal();
  };

  const handleDeleteBook = (index: number) => {
    setReturnedBooks((prevBooks) => prevBooks.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-black text-white px-6 py-4">
        <h1 className="text-xl font-bold tracking-wide">Book Nest</h1>
        <p className="font-medium text-sm">Admin</p>
      </div>

      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 p-6 flex flex-col">
          {/* Return New Book Button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Returned Books</h1>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => handleOpenModal()}
            >
              + Return New Book
            </button>
          </div>

          {/* Returned Books Table */}
          <table className="w-full bg-white shadow rounded overflow-hidden">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="py-3 px-4">Book Name</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Issued Date</th>
                <th className="py-3 px-4">Returned Date</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {returnedBooks.map((book, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                  <td className="py-3 px-4">{book.name}</td>
                  <td className="py-3 px-4">{book.studentId}</td>
                  <td className="py-3 px-4">{book.issuedDate}</td>
                  <td className="py-3 px-4">{book.returnedDate}</td>
                  <td className="py-3 px-4">
                    <button
                      className="text-blue-500 hover:underline mr-2"
                      onClick={() => handleOpenModal(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDeleteBook(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>

        {/* Modal for returning new book */}
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold mb-4">{isEditMode ? "Edit Returned Book" : "Return New Book"}</h2>
              <button
                className="text-gray-500"
                onClick={handleCloseModal}
              >
                X
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Book Name</label>
              <input
                type="text"
                name="name"
                value={newReturnBook.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Student ID</label>
              <input
                type="text"
                name="studentId"
                value={newReturnBook.studentId}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Issued Date</label>
              <input
                type="date"
                name="issuedDate"
                value={newReturnBook.issuedDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Returned Date</label>
              <input
                type="date"
                name="returnedDate"
                value={newReturnBook.returnedDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleAddOrEditReturnBook}
            >
              {isEditMode ? "Save Changes" : "Add Returned Book"}
            </button>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ReturnedBooksPage;
