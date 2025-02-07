"use client";
import { useState } from "react";
import Container from "@/components/layout/container";

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Registration successful! You can now sign in.");
        setFormData({ email: "", username: "", password: "", confirmPassword: "" });
      } else {
        setErrorMessage(data.message || "Error registering");
      }
    } catch (err) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <Container>
      <div className="h-screen w-full flex">
        <div className="relative flex flex-col items-center justify-center w-3/5 bg-white">
          <div className="absolute bottom-0 right-0 mb-12">
            <h1 className="text-4xl font-semibold text-black mb-4">Sign Up to</h1>
            <h2 className="text-6xl font-bold text-[#A7A3FF]">BOOK NEST</h2>
            <img src="library.png" width={950} height={500} alt="Library" />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-2/5 bg-white">
          <h3 className="font-extralight text-2xl text-black mb-5">Welcome to Book Nest!</h3>
          <div className="w-full max-w-lg px-8 py-15">
            <h2 className="text-gray-700 text-3xl font-semibold mb-4">Sign Up</h2>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#4D47C3] text-m mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md placeholder-[#A7A3FF] bg-[#F0EFFF]"
                />
              </div>
              <div>
                <label className="block text-[#4D47C3] text-m mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Create a username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md placeholder-[#A7A3FF] bg-[#F0EFFF]"
                />
              </div>
              <div>
                <label className="block text-[#4D47C3] text-m mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md placeholder-[#A7A3FF] bg-[#F0EFFF]"
                />
              </div>
              <div>
                <label className="block text-[#4D47C3] text-m mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md placeholder-[#A7A3FF] bg-[#F0EFFF]"
                />
              </div>
              <button type="submit" className="w-full bg-[#4D47C3] text-white py-4 rounded-md">
                Register
              </button>
            </form>
            <p className="mt-4 text-gray-600 text-sm text-center">
              Already have an account?{" "}
              <a href="/" className="text-purple-600 hover:underline">
                Sign In here!
              </a>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}