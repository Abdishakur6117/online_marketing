// src/pages/Contact.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-blue-800 mb-6">Contact Us</h1>
        <p className="text-gray-700 mb-8">
          We'd love to hear from you! Fill out the form below or reach us at{" "}
          <a
            href="cabdishakuur634@gmail.com"
            className="text-blue-600 underline"
          >
            support@mymarket.com
          </a>
        </p>

        <form className="grid grid-cols-1 gap-6">
          <input
            type="text"
            placeholder="Your Name"
            className="p-4 border border-gray-300 rounded-lg"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-4 border border-gray-300 rounded-lg"
          />
          <textarea
            rows="5"
            placeholder="Your Message"
            className="p-4 border border-gray-300 rounded-lg"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
