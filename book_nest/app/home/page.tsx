"use client";
import Navigation from "@/components/layout/Nav";
import Container from "@/components/layout/container";
import { useState, useEffect } from "react";
import Footer from "@/components/layout/footer";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Define a type for your book objects
interface Book {
  name: string;
  description: string;
  image: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);  // State to store fetched books
  const [topSellersIndex, setTopSellersIndex] = useState(0);
  const [recommendedIndex, setRecommendedIndex] = useState(0);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/books`);
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  // Handle add book to the cart functionality
  const addToCart = (book: Book) => {
    // Get the current cart from localStorage
    const storedCart = localStorage.getItem("cart");
    let cart = storedCart ? JSON.parse(storedCart) : [];

    // Add the new book to the cart
    cart.push(book);

    // Save the updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Optionally, show a success message or update UI (e.g., show a cart icon with the count)
    alert(`${book.name} added to cart!`);
  };

  // Carousel functions for "Top Borrows" and "Recommended For You"
  const handleNextTopSellers = () => {
    setTopSellersIndex((prevIndex) => (prevIndex + 1) % books.length);
  };

  const handlePrevTopSellers = () => {
    setTopSellersIndex(
      (prevIndex) => (prevIndex - 1 + books.length) % books.length
    );
  };

  const handleNextRecommended = () => {
    setRecommendedIndex((prevIndex) => (prevIndex + 1) % books.length);
  };

  const handlePrevRecommended = () => {
    setRecommendedIndex(
      (prevIndex) => (prevIndex - 1 + books.length) % books.length
    );
  };

  return (
    <div>
      {/* Navigation Bar */}
      <Navigation />

      {/* Main Container */}
      <Container>
        {/* New Releases Banner */}

        <div className="flex justify-between items-center bg-white p-8 rounded-lg shadow-md mt-8">
          <div className="w-1/2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              New Releases This Week
            </h1>
            <p className="text-gray-600 leading-relaxed">
              It's time to update your reading list with some of the latest and
              greatest releases in the literary world. From heart-pumping
              thrillers to captivating memoirs, this week's new releases offer
              something for everyone.
            </p>
          </div>

          <div className="relative flex w-1/2 justify-end space-x-4">
            <div
              className="w-40 h-60 bg-gray-300 rounded-md shadow-lg transform transition-all duration-300 hover:scale-110 hover:translate-x-2 hover:translate-y-1"
              style={{
                backgroundImage: 'url("/Product photo3.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div
              className="w-40 h-60 bg-gray-300 rounded-md shadow-lg transform transition-all duration-300 hover:scale-110 hover:translate-x-2 hover:translate-y-1"
              style={{
                backgroundImage: 'url("/Product photo4.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div
              className="w-40 h-60 bg-gray-300 rounded-md shadow-lg transform transition-all duration-300 hover:scale-110 hover:translate-x-2 hover:translate-y-1"
              style={{
                backgroundImage: 'url("/Product photo5.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
            </div>
          </div>
        </div>
        {/* Top Sellers Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Top Borrows</h2>
          <div className="relative overflow-hidden">
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-3 rounded-full shadow-md z-10 hover:bg-gray-300"
              onClick={handlePrevTopSellers}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${(topSellersIndex % books.length) * 33.333}%)`,
              }}
            >
              {books.map((item, index) => (
                <div
                  key={index}
                  className="flex-none w-1/3 px-4"
                  style={{ flex: "0 0 33.333%" }}
                >
                  <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md h-full border border-gray-300">
                    <img
                      src={`${API_URL}${item.image}`}
                      alt={item.name}
                      className="w-full object-contain h-40 rounded-md mb-4"
                    />
                    <h3 className="text-sm font-bold text-gray-900 mb-2 text-center">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-center text-xs">
                      {item.description}
                    </p>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                      onClick={() => addToCart(item)}
                    >
                      Add to basket
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-3 rounded-full shadow-md z-10 hover:bg-gray-300"
              onClick={handleNextTopSellers}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Recommended For You Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
          <div className="relative overflow-hidden">
            {/* Left Arrow Button */}
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-3 rounded-full shadow-md z-10 hover:bg-gray-300"
              onClick={handlePrevRecommended}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${(recommendedIndex % books.length) * 33.333}%)`,
              }}
            >
              {books.map((item, index) => (
                <div
                  key={index}
                  className="flex-none w-1/3 px-4"
                  style={{ flex: "0 0 33.333%" }}
                >
                  <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md h-full border border-gray-300">
                    <img
                      src={`${API_URL}${item.image}`}
                      alt={item.name}
                      className="w-full object-contain h-40 rounded-md mb-4"
                    />
                    <h3 className="text-sm font-bold text-gray-900 mb-2 text-center">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-center text-xs">
                      {item.description}
                    </p>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                      onClick={() => addToCart(item)}
                    >
                      Add to basket
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow Button */}
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-3 rounded-full shadow-md z-10 hover:bg-gray-300"
              onClick={handleNextRecommended}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

          </div>
        </div>

        {/* News Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">News</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* News Item 1 */}
            <div className="flex items-start space-x-4">
              {/* Image */}
              <img
                src="/Photo news.png"
                alt="The Books You Need to Read in 2023"
                className="w-20 h-28 object-cover rounded-md flex-shrink-0"
              />
              {/* Content */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  The Books You Need to Read in 2023
                </h3>
                <p className="text-xs text-gray-600 leading-snug">
                  We present the top 10 titles for 2023 in fiction, non-fiction,
                  and children's books, offering a glorious mix of masterful
                  storytelling, compelling subject matter, and page-turning
                  delight.
                </p>
              </div>
            </div>

            {/* News Item 2 */}
            <div className="flex items-start space-x-4 mb-10">
              {/* Image */}
              <img
                src="/Photo news2.png"
                alt="February's Best Children's Books"
                className="w-20 h-28 object-cover rounded-md flex-shrink-0"
              />
              {/* Content */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  February's Best Children's Books
                </h3>
                <p className="text-xs text-gray-600 leading-snug">
                  Some of the finest children's authors currently writing have
                  books publishing this month. From Natasha Farrant to Elle
                  McNicoll and from Tahereh Mafi to Harriet Muncaster, there's
                  something for every young reader.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}
