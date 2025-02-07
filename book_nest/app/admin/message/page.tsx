"use client";
import React, { useEffect, useState } from "react";
import Container from "@/components/layout/container";
import SideNav from "@/components/layout/AdminNav";
import Footer from "@/components/layout/footer";

const AdminMessages = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [reply, setReply] = useState<string>("");

  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Establish a WebSocket connection
    const newSocket = new WebSocket("ws://localhost:5000"); // Ensure this URL is correct

    newSocket.onopen = () => {
      console.log("Admin WebSocket connection established.");
    };

    newSocket.onmessage = (event) => {
      console.log("Message from client:", event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
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

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && socket.readyState === WebSocket.OPEN && reply.trim() !== "") {
      socket.send(reply);
      setMessages((prevMessages) => [...prevMessages, `Admin: ${reply}`]);
      setReply("");
    } else {
      console.warn("WebSocket is not open or reply is empty.");
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
        <SideNav />
        <main className="flex-1 p-6 flex flex-col">
       
          <h3 className="text-4xl font-bold text-gray-800 mb-12 tracking-tight">Admin Messages</h3>


            {/* Messages List */}
            <div className="bg-gray-100 p-4 rounded-lg h-72 overflow-y-scroll mb-6">
              {messages.length === 0 ? (
                <p className="text-lg text-gray-600">No messages yet.</p>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-gray-800">{msg}</p>
                  </div>
                ))
              )}
            </div>

            {/* Admin Reply */}
            <form onSubmit={handleReplySubmit}>
              <div className="mb-6">
                <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-2">
                  Reply
                </label>
                <textarea
                  id="reply"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply here"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
              >
                Send Reply
              </button>
            </form>
        </main>
    </div>
    </div>
  );
};

export default AdminMessages;
