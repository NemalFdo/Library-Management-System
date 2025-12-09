"use client";
import React, { useEffect, useState } from "react";
import Container from "@/components/layout/container";
import Navigation from "@/components/layout/Nav";
import Footer from "@/components/layout/footer";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000';

const ContactUs = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phoneNumber: "07xxxxxxxx",
    profileImage: "/Image.png", // Default profile image
  });
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]); // Store messages with sender info
  const [adminResponse, setAdminResponse] = useState<string>("");

  // Note: adminResponse is set but not displayed separately
  // It's kept for WebSocket message handling
  if (adminResponse) {
    console.log("Admin response received:", adminResponse);
  }

  useEffect(() => {
    const storedUserData = localStorage.getItem("globalUserData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      console.warn("No user data found in localStorage.");
    }

    // Create WebSocket connection
    const newSocket = new WebSocket(WS_URL); // Ensure this URL is correct
    newSocket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    newSocket.onmessage = (event) => {
      console.log("Message from server:", event.data);
      setAdminResponse(event.data);
      setMessages((prevMessages) => [...prevMessages, { sender: 'Admin', text: event.data }]);
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    setSocket(newSocket);

    // Cleanup on component unmount
    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && socket.readyState === WebSocket.OPEN && message.trim() !== "") {
      // Send the message to WebSocket
      socket.send(message);
      console.log("Message sent:", message);
      setMessages((prevMessages) => [...prevMessages, { sender: 'You', text: message }]);
      setMessage(""); // Clear the message after sending
    } else {
      console.warn("WebSocket is not open or message is empty.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navigation />
      <Container>
        <div className="py-16 px-8 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-12 tracking-tight ">
            Contact Us
          </h1>

          <p className="text-lg text-gray-600 mb-12">
            We believe in building lasting relationships. Whether you need
            assistance, have questions, or want to share feedback, we are
            here to help.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="bg-white p-8 rounded-lg shadow-lg transition transform hover:scale-105 duration-300">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Get in Touch
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="text-indigo-600 text-3xl">📍</div>
                  <p className="text-gray-700 text-lg">
                    Mahenwaththa, Pitipana, Homagama, Sri Lanka
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-indigo-600 text-3xl">📧</div>
                  <div className="space-y-2">
                    <p className="text-lg text-gray-700">
                      <a href="mailto:team41@gmail.com" className="text-indigo-600 hover:underline">
                        team41@gmail.com
                      </a>
                    </p>
                    <p className="text-lg text-gray-700">
                      <a href="mailto:inquiries@nsbm.ac.lk" className="text-indigo-600 hover:underline">
                        inquiries@nsbm.ac.lk
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-indigo-600 text-3xl">📞</div>
                  <p className="text-lg text-gray-700">
                    (94) 11 544 5000 <br />
                    (94) 71 244 5000
                  </p>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="bg-gray-100 p-10 rounded-lg shadow-lg col-span-2 md:col-span-1 lg:col-span-2 transition transform hover:scale-105 duration-300">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Messages
              </h2>
              <div className="bg-gray-200 p-4 rounded-lg h-72 overflow-y-scroll mb-6">
                {messages.length === 0 ? (
                  <p className="text-lg text-gray-600">No messages yet.</p>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className="mb-4">
                      <p className={`text-gray-800 ${msg.sender === 'You' ? 'text-blue-600' : 'text-green-600'}`}>
                        <strong>{msg.sender}: </strong> {msg.text}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Send Message Form */}
              <form onSubmit={handleSendMessage}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      defaultValue={userData.username}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      defaultValue={userData.email}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                    />
                  </div>
                </div>
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your Message"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default ContactUs;
