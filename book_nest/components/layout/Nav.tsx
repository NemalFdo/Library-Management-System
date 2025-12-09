"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import debounce from "lodash.debounce";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Book {
  name: string;
  description: string;
  image: string;
}

const LoginNavbar = () => {
  const [profileImage, setProfileImage] = useState<string>("/default.png");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem("globalUserData");
    if (storedUserData) {
      const { profileImage: savedImage } = JSON.parse(storedUserData);
      if (savedImage) setProfileImage(savedImage);
    }
  }, []);

  const handleSearch = debounce(async (query: string) => {
    if (!query.trim()) {
      setShowResults(false);
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/books/search?q=${query}`);
      setSearchResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }, 300);

  const handleSearchButtonClick = async () => {
    handleSearch(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const addToCart = (book: Book) => {
    const storedCart = localStorage.getItem("cart");
    const cart = storedCart ? JSON.parse(storedCart) : [];
    cart.push(book);
    localStorage.setItem("cart", JSON.stringify(cart));
    setShowResults(false);
    alert(`${book.name} added to cart!`);
  };

  return (
    <div className="bg-white border-b border-gray-300">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-[#4D47C3] tracking-wide">
            Book Nest Library System
          </div>
          <div className="flex items-center justify-center w-[500px] ml-2 mr-32 relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-600 w-full"
            />
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
              onClick={handleSearchButtonClick} // Added search button
            >
              Search
            </button>
            {showResults && (
              <div className="absolute top-12 left-0 w-full bg-white shadow-md z-50 rounded-md">
                {searchResults.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {searchResults.map((book: Book, index: number) => (
                      <li
                        key={book.id || index}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <Image
                            src={`${API_URL}${book.image}`}
                            alt={book.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover rounded-md mr-4"
                          />
                          <div>
                            <p className="font-bold">{book.name}</p>
                            <p className="text-sm text-gray-600">{book.description}</p>
                          </div>
                          <button
                            className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            onClick={() => addToCart(book)}
                          >
                            Add to basket
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-2 text-gray-600">No results found.</div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4 text-[15px] text-[#666666]">
            <Image
              src={profileImage || "/default.png"}
              alt="Profile"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover mr-2 cursor-pointer"
              onClick={() => (window.location.href = "/userprofile")}
            />
          </div>
        </div>
      </div>
      <div className="bg-[#333333] py-4 relative">
        <div className="container mx-auto flex items-center justify-center text-[14px] text-[#999999]">
          <div className="flex items-center space-x-8 mx-auto">
            <a href="/home" className="hover:text-white">
              Home
            </a>
            <a href="/categories" className="hover:text-white">
              Categories
            </a>
            <a href="/shoppingcart" className="hover:text-white">
              Cart
            </a>
            <a href="/aboutus" className="hover:text-white">
              About Us
            </a>
            <a href="/contactus" className="hover:text-white">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginNavbar;
