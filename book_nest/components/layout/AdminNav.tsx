"use client"; // Mark this as a client-side component
import React from "react";
import { usePathname } from "next/navigation"; // Use usePathname from next/navigation

const SideNav = () => {
  const currentPath = usePathname(); // Get the current route path using usePathname

  // Define the navigation items and their paths
  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Books", path: "/admin/books" },
    { label: "Returned books", path: "/admin/returnedbook" },
    { label: "Borrowed books", path: "/admin/borrowedbook" }, 
    { label: "Messages", path: "/admin/message" },// Add Borrowed Books section
  ];

  return (
    <div className="h-screen w-64 bg-black text-white flex flex-col items-center py-6">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <img
          src="/Choose Image.png"
          alt="Admin Avatar"
          className="w-20 h-20 rounded-full mb-3"
        />
        <h3 className="text-lg font-semibold">Admin</h3>
        <p className="text-sm text-green-500">Online</p>
      </div>

      {/* Navigation Links */}
      <nav className="w-full">
        <ul className="flex flex-col items-start space-y-4 px-6">
          {navItems.map((item) => (
            <li key={item.path} className="w-full">
              <a
                href={item.path}
                className={`block w-full px-4 py-2 rounded hover:bg-gray-600 ${
                  currentPath === item.path ? "bg-gray-700" : ""
                }`} // Apply active class based on current path
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto px-6 w-full">
        <button className="w-full px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 mb-6"
        onClick={() => (window.location.href = "/")}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideNav;
