"use client";

import React from "react";
import Image from "next/image";
import Container from "@/components/layout/container";
import Navigation from "@/components/layout/Nav";
import Footer from "@/components/layout/footer";

const Categories = () => {
  const categories = [
    { title: "Novels", img: "/image 4(1).png" },
    { title: "Story books", img: "/image 5.png" },
    { title: "Memory books", img: "/image 6.png" },
    { title: "Travel books", img: "/image 7.png" },
    { title: "Poetry books", img: "/image 8.png" },
    { title: "Knowledge books", img: "/image 9.png" },
    { title: "Children's books", img: "/image 10.png" },
    { title: "Biography books", img: "/image 10.png" }, // Same image for Biography
  ];

  return (
    <div className="">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <Container>
        <div className="py-16 px-8">
          <h1 className="text-4xl font-bold text-gray-800  mb-12 tracking-tight ">
            Browse Our Categories
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-4 p-6 bg-white shadow-2xl rounded-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out"
              >
                <Image
                  src={category.img}
                  alt={category.title}
                  width={160}
                  height={192}
                  className="w-40 h-48 object-cover rounded-lg border-2 border-gray-300 transition-transform duration-300 ease-in-out transform hover:scale-105"
                />
                <span className="text-gray-800 font-semibold text-lg text-center transition-colors duration-300 hover:text-indigo-600">
                  {category.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Categories;
