"use client";
import React, { useState, useEffect } from 'react';
import SideNav from '@/components/layout/AdminNav';
import Modal from '@/components/layout/Modal';
import axios, { AxiosResponse } from 'axios';

const BooksPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBookIndex, setCurrentBookIndex] = useState<number | null>(null);
  const [newBook, setNewBook] = useState<{ name: string; author: string; isbn: string; description: string; image: string | File }>({ name: '', author: '', isbn: '', description: '', image: '' });
  const [books, setBooks] = useState<{ _id: string; name: string; author: string; isbn: string; description: string; image: string }[]>([]);

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/books");
        setBooks(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching books:', error.message);
        } else {
          console.error('Unexpected error:', error);
        }
      }
    };

    fetchBooks();
  }, []);

  // Open modal for adding/editing
  const handleOpenModal = (index: number | null = null) => {
    if (index !== null) {
      setIsEditMode(true);
      setCurrentBookIndex(index);
      setNewBook(books[index]);
    } else {
      setIsEditMode(false);
      setNewBook({ name: '', author: '', isbn: '', description: '', image: '' });
    }
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBookIndex(null);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setNewBook((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setNewBook((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Add or Edit a book
  const handleAddOrEditBook = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newBook.name);
      formData.append("author", newBook.author);
      formData.append("isbn", newBook.isbn);
      formData.append("description", newBook.description);
      if (newBook.image) {
        formData.append("image", newBook.image);
      }
  
      let response: AxiosResponse;
  
      if (isEditMode && currentBookIndex !== null) {
        // Update the existing book
        const bookToEdit = books[currentBookIndex];
        const bookId = bookToEdit._id;
  
        response = await axios.put(`http://localhost:5000/api/books/${bookId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        setBooks((prevBooks) =>
          prevBooks.map((book, index) =>
            index === currentBookIndex ? response.data.book : book
          )
        );
      } else {
        // Add a new book
        response = await axios.post("http://localhost:5000/api/books", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        setBooks((prevBooks) => [...prevBooks, response.data.book]);
      }
  
      console.log('Axios Response:', response); // Log the full response to debug
  
      if (response.status === 200 || response.status === 201) {
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error:", error);
  
      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };
  

  // Delete a book
  const handleDeleteBook = async (index: number) => {
    try {
      const bookToDelete = books[index];
      const bookId = bookToDelete._id; // Get the book's MongoDB ID

      const response = await axios.delete(`http://localhost:5000/api/books/${bookId}`);
      
      if (response.status === 200) {
        setBooks((prevBooks) => prevBooks.filter((_, i) => i !== index)); // Remove from the list
      } else {
        console.error("Failed to delete book:", response.data.error);
      }
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex justify-between items-center bg-black text-white px-6 py-4">
        <h1 className="text-xl font-bold tracking-wide">Book Nest</h1>
        <p className="font-medium text-sm">Admin</p>
      </div>
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Books</h1>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => handleOpenModal()}
            >
              + Add New Book
            </button>
          </div>

          <table className="w-full bg-white shadow rounded overflow-hidden">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="py-3 px-4">Book Name</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">ISBN Number</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={index}>
                  <td className="py-3 px-4">{book.name}</td>
                  <td className="py-3 px-4">{book.author}</td>
                  <td className="py-3 px-4">{book.isbn}</td>
                  <td className="py-3 px-4">{book.description}</td>
                  <td className="py-3 px-4">
                    <img
                      src={`http://localhost:5000${book.image}`}
                      alt={book.name}
                      className="h-16 w-16 object-cover"
                    />
                  </td>
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

        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="flex justify-between items-center mb-4"> 
            <h2 className="text-xl font-bold">{isEditMode ? 'Edit Book' : 'Add New Book'}</h2>
            <button 
              className="text-gray-500 hover:text-gray-700" 
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
              value={newBook.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <input
              type="text"
              name="author"
              value={newBook.author}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">ISBN Number</label>
            <input
              type="text"
              name="isbn"
              value={newBook.isbn}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              value={newBook.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleAddOrEditBook}
          >
            {isEditMode ? 'Save Changes' : 'Add Book'}
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default BooksPage;