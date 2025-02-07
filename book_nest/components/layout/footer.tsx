"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-[#333333] text-white py-6">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4">
        {/* Left: Branding */}
        <div className="text-sm font-semibold">
          BOOK NEST
        </div>

        {/* Center: Links */}
        <div className="flex space-x-6 text-sm mt-4 sm:mt-0">
          <a href="#" className="hover:text-white">
            Terms
          </a>
          <a href="#" className="hover:text-white">
            Privacy
          </a>
          <a href="#" className="hover:text-white">
            Cookies
          </a>
        </div>

        {/* Right: Social Media Icons */}
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <a href="#" aria-label="LinkedIn" className="hover:text-white">
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-white">
            <FontAwesomeIcon icon={faFacebook} size="lg" />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-white">
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
