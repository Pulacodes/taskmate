"use client";
import Image from "next/image";
import React from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features/features";
export default function Home() {
  return (
    <div className="overflow-hidden min-h-screen bg-white">
      {/* Hero Section */}
      <br/>
      <Hero/>
      {/* Featured Available Tasks */}
      

      {/* Popular Task Categories */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-8 text-black">
            Popular Task Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Task Category Card */}
            <div className="bg-gray-700 shadow-md rounded-lg p-6">
              <Image
                src="/tutor.jpg"
                alt="Academic Help"
                width={400}
                height={300}
                className="rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold mb-2 text-white">
                Academic Help
              </h3>
              <p className="text-gray-400">
                Find fellow students who can help with tutoring or coursework.
              </p>
            </div>

            <div className="bg-gray-700 shadow-md rounded-lg p-6">
              <Image
                src="/graphic-design.jpg"
                alt="Graphic Design"
                width={400}
                height={300}
                className="rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold mb-2 text-white">
                Graphic Design
              </h3>
              <p className="text-gray-400">
                Need help designing a poster or presentation? Find a designer
                here.
              </p>
            </div>

            <div className="bg-gray-700 shadow-md rounded-lg p-6">
              <Image
                src="/coding.jpg"
                alt="Coding Tasks"
                width={400}
                height={300}
                className="rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold mb-2 text-white">
                Coding Tasks
              </h3>
              <p className="text-gray-400">
                Get assistance with programming assignments or web development.
              </p>
            </div>
            
          </div>
          
        </div>
      </section>
      <Features/>
     
    </div>
  );
}
