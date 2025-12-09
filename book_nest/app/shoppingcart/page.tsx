"use client";
import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Nav";
import Footer from "@/components/layout/footer";
import Container from "@/components/layout/container";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';


interface Book {
  name: string;
  description: string;
  image: string;
}

export default function Cart() {
  const [userData, setUserData] = useState({
      username: "",
      email: "",
      phoneNumber: "07xxxxxxxx",
      profileImage: "/Image.png", // Default profile image
    });
  
  const [cart, setCart] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false); // To handle loading state during checkout

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);
  useEffect(() => {
    const storedUserData = localStorage.getItem("globalUserData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      console.warn("No user data found in localStorage.");
    }
  }, []);

  const removeFromCart = (book: Book) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== book.name));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const borrowedBooks = cart.map((book) => ({
        name: book.name,
        student: userData.username, // Replace with dynamic student name
        issuedDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
          .toISOString()
          .split("T")[0],
      }));

      const response = await fetch(`${API_URL}/api/books/borrowed-books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(borrowedBooks),
      });

      if (response.ok) {
        alert("Books have been successfully added to borrowed list!");
        setCart([]); // Clear the cart
      } else {
        const errorData = await response.json();
        alert(`Failed to process checkout: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred while processing checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navigation Bar */}
      <Navigation />
      {/* Cart Container */}
      <Container>
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          {cart.length === 0 ? (
            <p className="text-gray-600">Your cart is empty. Add some books to proceed!</p>
          ) : (
            <div>
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mb-4 border-b pb-4"
                >
                  <img
                    src={item.image.startsWith("http") ? item.image : `${API_URL}${item.image}`}
                    alt={item.name}
                    className="w-20 h-30 object-contain"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => removeFromCart(item)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex justify-between items-center mt-6">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Checkout"}
                </button>
                <p className="text-lg font-semibold">
                  Total: <span className="text-blue-500">{cart.length} item(s)</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </Container>
      {/* Footer */}
      <Footer />
    </div>
  );
}
