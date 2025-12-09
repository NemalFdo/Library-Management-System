"use client";
import React, { useEffect, useState } from "react";
import Container from "@/components/layout/container";
import Navigation from "@/components/layout/Nav";
import Cookies from "js-cookie";
import Footer from "@/components/layout/footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const AccountSettings = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    profileImage: "/default.png", // Default profile image
  });

  useEffect(() => {
    const storedUserData = localStorage.getItem("globalUserData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      console.warn("No user data found in localStorage.");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        setUserData((prev) => {
          const updatedData = { ...prev, profileImage: base64Image };
          localStorage.setItem("globalUserData", JSON.stringify(updatedData));
          return updatedData;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    const defaultImage = "/default.png";
    setUserData((prev) => ({ ...prev, profileImage: defaultImage }));
    localStorage.setItem(
      "globalUserData",
      JSON.stringify({ ...userData, profileImage: defaultImage })
    );
  };

  const handleSave = async () => {
    const userId = Cookies.get("USERID");
    if (!userId) {
      alert("User ID is not available. Please log in again.");
      return;
    }

    if (!userData.username || !userData.email || !userData.phoneNumber) {
      alert("All fields are required.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(userData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          username: userData.username,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          profileImage: userData.profileImage,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update user data");
      }

      const updatedUser = await response.json();
      alert("Changes saved successfully!");
      localStorage.setItem(
        "globalUserData",
        JSON.stringify(updatedUser.updatedUser)
      );
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleLogout = () => {
    Cookies.remove("USERID");
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <div>
        <Navigation key={userData.profileImage || "/default.png"}/>
      </div>
      <Container>
        <div className="p-6 bg-white min-h-screen">
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <div className="border-b w-full mb-6"></div>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={userData.username}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={userData.phoneNumber}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <img
                  src={userData.profileImage || "/default.png"}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover ml-12 mr-12 mb-3 border-2 border-gray-300"
                />
                <label
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 mr-5 cursor-pointer"
                  aria-label="Add Profile Image"
                >
                  Add
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                <button
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700"
                  onClick={handleRemoveImage}
                  aria-label="Remove Profile Image"
                >
                  Remove
                </button>
              </div>
            </div>
            <button
              className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-full shadow-sm hover:bg-indigo-700"
              onClick={handleSave}
            >
              Save Changes
            </button>
            <button
              className="mt-6 bg-red-500 text-white px-6 py-2 rounded-full shadow-sm ml-5 hover:bg-red-700"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default AccountSettings;
