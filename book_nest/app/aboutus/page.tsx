"use client";
import React from "react";
import Image from "next/image";
import Container from "@/components/layout/container";
import Navigation from "@/components/layout/Nav";
import Footer from "@/components/layout/footer";

const AboutUs = () => {
  return (
    <div className="bg-white">
      <Navigation />
      <Container>
        <div className="py-10 px-8 pb-24">
          {" "}
          
          <div className="flex flex-col md:flex-row items-start justify-between mt-5 md:space-x-10">
            
            <div className="flex flex-row space-x-8 mt-10">
              {/* First Image */}
              <div className="w-48 h-64 shadow-md">
                <Image
                  src="/image 2.png" // Relative path from the "public" folder
                  alt="The Hobbit"
                  width={192}
                  height={256}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
              </div>
              
              <div className="w-48 h-64 shadow-md relative top-40">
                <Image
                  src="/Image 17.png" // Relative path from the "public" folder
                  alt="Catching Fire"
                  width={192}
                  height={256}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
              </div>
            </div>
            
            <div className="text-gray-700 md:w-1/2 mt- md:mt-0">
              <h2 className="text-3xl font-semibold text-black mt-6 mb-3">
                A BIT
              </h2>{" "}
              
              <h3 className="text-4xl font-bold text-black mt-8">
                ABOUT US
              </h3>{" "}
              
              <p className="mt-4 leading-relaxed">
                We are passionate about delivering high-quality products and
                exceptional service. Founded with the goal of providing
                innovative solutions to our customers, we pride ourselves on our
                commitment to excellence and customer satisfaction. Our team is
                dedicated to bringing you the best, and we strive to create an
                environment that fosters creativity, collaboration, and growth.
                With years of experience in the industry, we have built a
                reputation for trustworthiness and reliability. We focus on
                continuous improvement, ensuring that our products and services
                meet the ever-changing needs of our valued customers. Whether
                you’re a first-time customer or a long-time partner, you can
                count on us to provide the best experience possible. Thank you
                for choosing us. We look forward to serving you!
              </p>
              <button
                className="mt-6 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700"
                onClick={() => (window.location.href = "/contactus")}
              >
                EXPLORE MORE
              </button>
            </div>
          </div>
        </div>
      </Container>
      <Footer/>
    </div>
  );
};

export default AboutUs;
