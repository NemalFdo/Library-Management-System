"use client";
import { useState } from "react";
import { jwtDecode } from "jwt-decode"; // Import the library
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/container";
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Signin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Token received:", data.token);

        // Decode the token to extract user details
        const decodedToken: { id: string; username?: string; email?: string; phoneNumber?: string; role?: string } = jwtDecode(data.token);
        console.log("Decoded token data:", decodedToken);

        // Save user details in cookies and localStorage
        Cookies.set("USERID", decodedToken.id, { expires: 7 });
        const globalUserData = {
          userId: decodedToken.id,
          username: decodedToken.username || "Default Username",
          email: decodedToken.email || "Default Email",
          phoneNumber: decodedToken.phoneNumber || "",
        };
        localStorage.setItem("globalUserData", JSON.stringify(globalUserData));
        console.log("User data stored in localStorage:", globalUserData);

        // Redirect based on role (admin or user)
        if (decodedToken.role === "admin") {
          window.location.href = "/admin/dashboard";  // Redirect to admin dashboard
        } else {
          window.location.href = "/home";  // Redirect to user dashboard
        }
      } else {
        setErrorMessage(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setErrorMessage("An error occurred while logging in. Please try again.");
    }
  };


  return (
    <Container>
      <div className="h-screen w-full flex">
        <div className="relative flex flex-col items-center justify-center w-3/5 bg-white">
          <div className="absolute bottom-0 right-0 mb-12">
            <h1 className="text-4xl font-semibold text-black mb-4">Sign In to</h1>
            <h2 className="text-6xl font-bold text-[#A7A3FF]">BOOK NEST</h2>
            <Image src="/library.png" width={950} height={500} alt="Library" />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-2/5 bg-white">
          <h3 className="mb-4 font-extralight text-2xl text-black">Welcome Back to Book Nest!</h3>
          <div className="w-full max-w-lg px-10 py-16">
            <h2 className="text-gray-700 text-3xl font-semibold mb-10">Sign In</h2>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#4D47C3] text-m mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email or username"
                  className="w-full px-4 py-4 border border-gray-300 rounded-md placeholder-[#A7A3FF] bg-[#F0EFFF]"
                />
              </div>
              <div>
                <label className="block text-[#4D47C3] text-m mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  className="w-full px-4 py-4 border border-gray-300 rounded-md placeholder-[#A7A3FF] bg-[#F0EFFF]"
                />
                <input type="checkbox" className="mt-3" />
                <label className="text-gray-600 text-sm ml-2">Remember me</label>
              </div>
              <button type="submit" className="w-full bg-[#4D47C3] text-white py-4 rounded-md">
                Login
              </button>
            </form>
            <p className="mt-4 text-gray-600 text-sm text-center">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-purple-600 hover:underline">
                Register here!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}