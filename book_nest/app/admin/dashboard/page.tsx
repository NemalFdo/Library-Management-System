"use client"; // Mark this as a client-side component
import React from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for routing
import SideNav from "@/components/layout/AdminNav";

const Dashboard = () => {
  const router = useRouter(); // Initialize the router

  const handleMoreInfoClick = (page: string) => {
    router.push(page); // Navigate to the provided page
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

        {/* Main Content */}
        <main className="flex-1 p-6 flex flex-col">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Card 1 */}
            <div className="bg-indigo-500 text-white rounded-lg shadow-md w-64 h-36 mx-auto">
              <div className="p-4 text-center">
                <h2 className="text-lg font-bold">All Books</h2>
              </div>
              <div className="bg-gray-800 text-white py-2 text-center rounded-b-lg">
                <button
                  className="text-sm font-medium px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md"
                  onClick={() => handleMoreInfoClick("/admin/books")} // Navigate to the books page
                >
                  More info ➔
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-indigo-500 text-white rounded-lg shadow-md w-64 h-36 mx-auto">
              <div className="p-4 text-center">
                <h2 className="text-lg font-bold">Borrowed Books</h2>
              </div>
              <div className="bg-gray-800 text-white py-2 text-center rounded-b-lg">
                <button className="text-sm font-medium px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md"
                onClick={() => handleMoreInfoClick("/admin/borrowedbook")} // Navigate to the books page
                >
                  More info ➔
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-indigo-500 text-white rounded-lg shadow-md w-64 h-36 mx-auto">
              <div className="p-4 text-center">
                <h2 className="text-lg font-bold">Issue Books</h2>
              </div>
              <div className="bg-gray-800 text-white py-2 text-center rounded-b-lg">
                <button className="text-sm font-medium px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md"
                onClick={() => handleMoreInfoClick("/admin/Issuebook")}
                >
                  More info ➔
                </button>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-indigo-500 text-white rounded-lg shadow-md w-64 h-36 mx-auto">
              <div className="p-4 text-center">
                <h2 className="text-lg font-bold">Return Books</h2>
              </div>
              <div className="bg-gray-800 text-white py-2 text-center rounded-b-lg">
                <button className="text-sm font-medium px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md"
                onClick={() => handleMoreInfoClick("/admin/returnedbook")}>
                  More info ➔
                </button>
              </div>
            </div>
          </div>

          {/* Today Dues Section */}
          <div className="bg-gray-100 border rounded-lg shadow-md p-4 flex-1">
            <h2 className="text-lg font-semibold mb-4">Today Dues</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Book Name</th>
                  <th className="p-2 border">Borrower Name</th>
                  <th className="p-2 border">Date Borrowed</th>
                  <th className="p-2 border">Contact</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border" colSpan={4}>
                    No dues for today
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
