"use client"; // Mark this as a client-side component
import React, { useState, useEffect } from "react";
import SideNav from "@/components/layout/AdminNav";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface BorrowedBook {
  id: string; // MongoDB _id will be mapped to id
  name: string;
  student: string;
  issuedDate: string;
  dueDate: string;
}

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [editData, setEditData] = useState<BorrowedBook | null>(null);

  // Note: editData is set but edit functionality is not implemented
  // This is kept to avoid breaking existing UI components
  if (editData) {
    console.log("Edit data set but not implemented:", editData);
  }

  // Fetch all borrowed books on component mount
  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await fetch(`${API_URL}/api/books/borrowed-books`);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched borrowed books:", data); // Add this line to log the response
          setBorrowedBooks(data);
        } else {
          console.error("Failed to fetch borrowed books.");
        }
      } catch (error) {
        console.error("Error fetching borrowed books:", error);
      }
    };
  
    fetchBorrowedBooks();
  }, []);  

  const handleDelete = async (id: string) => {
    console.log("Deleting book with ID:", id);  // Check if ID is correct
    try {
      const response = await fetch(`${API_URL}/api/books/borrowed-books/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete the borrowed book.");
      }
  
      // Update the state or UI to reflect the deletion
      setBorrowedBooks(borrowedBooks.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Error deleting borrowed book:", error);
      alert("Failed to delete the borrowed book.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-black text-white px-6 py-4">
        <h1 className="text-xl font-bold tracking-wide">Book Nest</h1>
        <p className="font-medium text-sm">Admin</p>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <SideNav />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Borrowed Books</h2>
            
          </div>

          {/* Borrowed Books Table */}
          <table className="w-full bg-white shadow rounded overflow-hidden">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="py-3 px-4">Book Name</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Issued Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.map((book, index) => (
                <tr key={`${book.id}-${book.name}-${book.student}`} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                  <td className="py-3 px-4">{book.name}</td>
                  <td className="py-3 px-4">{book.student}</td>
                  <td className="py-3 px-4">{book.issuedDate}</td>
                  <td className="py-3 px-4">{book.dueDate}</td>
                  <td className="py-3 px-4">
                    <button
                      className="text-blue-500 hover:underline mr-2"
                      onClick={() => setEditData(book)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Edit and Add Popups here */}
          {/* ... (No change to these parts) */}
        </main>
      </div>
    </div>
  );
};

export default BorrowedBooks;
