// app/about/page.tsx

import React from 'react';

const About = () => {
  return (
    <section className="overflow-hidden py-16 md:py-20 lg:py-28" >
      <div className="flex flex-col items-center px-6 py-12 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800">About TaskMe</h1>
      
      <section className="max-w-2xl text-gray-700 space-y-4">
        <p>
          Welcome to <strong>TaskMe</strong>! Our platform connects university students, allowing them to post and accept tasks for money. Whether you need help with a project, tutoring, or daily errands, TaskMe is designed to make life easier by bringing students together.
        </p>

        <p>
          Our goal is to foster a collaborative community where students can find quick assistance and earn money by helping others. Whether you’re looking to offer your skills or seek help, TaskMe is a one-stop solution for students to manage tasks within a trusted network.
        </p>
      </section>

      <section className="max-w-2xl text-gray-700 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Why Choose TaskMe?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Convenience:</strong> Easily post and browse tasks within your university community.</li>
          <li><strong>Opportunity:</strong> Earn money by completing tasks for your peers.</li>
          <li><strong>Trust:</strong> Verified student accounts ensure a secure and reliable environment.</li>
        </ul>
      </section>

      <section className="max-w-2xl text-gray-700 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">How It Works</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Sign up or Log in:</strong> Create an account with TaskMe to get started.</li>
          <li><strong>Post a Task:</strong> Need something done? Upload a task with a description and price.</li>
          <li><strong>Accept Tasks:</strong> Browse available tasks and accept one that suits your skills and schedule.</li>
          <li><strong>Complete & Earn:</strong> Finish the task and earn payment through the platform.</li>
        </ol>
      </section>

      <section className="max-w-2xl text-gray-700 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
        <p>
          At TaskMe, our mission is to create a supportive ecosystem that helps students enhance their skills, earn money, and make connections within their academic communities. We believe in empowering students to help one another and make their university experience both productive and rewarding.
        </p>
      </section>
    </div>
    </section>
    
  );
};

export default About;
