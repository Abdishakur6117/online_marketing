// src/pages/About.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-100 via-white to-blue-50 py-16 mb-10 shadow-inner">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold text-blue-900 mb-4">
            About <span className="text-blue-600">Digital Marketing</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Empowering businesses to grow through smart, streamlined digital
            marketing.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <div className="text-lg text-gray-700 leading-relaxed">
          <p>
            <span className="font-bold text-blue-600">MyMarket</span> is a
            digital marketing platform built to empower brands and businesses to
            reach their audiences more effectively through targeted campaigns
            and innovative tools.
          </p>
          <p>
            We believe in simplifying marketing — giving businesses big or small
            the power to launch, manage, and track their campaigns effortlessly.
          </p>
          <p>
            Our mission is to create a transparent, intuitive, and powerful
            marketing experience for everyone.
          </p>
        </div>

        {/* Vision / Values */}
        <div className="grid md:grid-cols-3 gap-6 pt-10">
          <div className="bg-white border rounded-xl p-6 shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              🎯 Our Mission
            </h3>
            <p className="text-gray-600 text-sm">
              Delivering simple yet powerful marketing tools to all businesses.
            </p>
          </div>
          <div className="bg-white border rounded-xl p-6 shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              🚀 Our Vision
            </h3>
            <p className="text-gray-600 text-sm">
              Making digital marketing accessible, effective, and affordable.
            </p>
          </div>
          <div className="bg-white border rounded-xl p-6 shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              🤝 Our Values
            </h3>
            <p className="text-gray-600 text-sm">
              Transparency, creativity, and a customer-first approach.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default About;
