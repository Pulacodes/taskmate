"use client";
import Image from "next/image";
import React from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features/features";
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <Hero/>
      {/* Featured Available Tasks */}
      <Features/>

      {/* Popular Task Categories */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-8 text-yellow-600">
            Popular Task Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Task Category Card */}
            <div className="bg-transparent shadow-md rounded-lg p-6">
              <Image
                src="/tutor.jpg"
                alt="Academic Help"
                width={400}
                height={300}
                className="rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold mb-2 text-purple-400">
                Academic Help
              </h3>
              <p className="text-gray-400">
                Find fellow students who can help with tutoring or coursework.
              </p>
            </div>

            <div className="bg-transparent shadow-md rounded-lg p-6">
              <Image
                src="/graphic-design.jpg"
                alt="Graphic Design"
                width={400}
                height={300}
                className="rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold mb-2 text-purple-400">
                Graphic Design
              </h3>
              <p className="text-gray-400">
                Need help designing a poster or presentation? Find a designer
                here.
              </p>
            </div>

            <div className="bg-transparent shadow-md rounded-lg p-6">
              <Image
                src="/coding.jpg"
                alt="Coding Tasks"
                width={400}
                height={300}
                className="rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold mb-2 text-purple-400">
                Coding Tasks
              </h3>
              <p className="text-gray-400">
                Get assistance with programming assignments or web development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 py-6 mt-16">
        <div className="container mx-auto px-6 text-center text-white">
          <p>Taskmate &copy; {new Date().getFullYear()} - All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}
