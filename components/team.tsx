/* eslint-disable @next/next/no-img-element */
import React from "react";
import { FaLinkedin, FaEnvelope, FaTwitter, FaGithub } from "react-icons/fa";

const FounderProfile = () => {
  const founderData = {
    name: "Pula Lepholisa",
    title: "Founder & CEO",
    company: "Taskmate",
    tagline: "Making life easier for you",
    mission: "Dedicated to building sustainable technology solutions that empower businesses and communities to thrive in the digital age.",
    image: "/Pula.jpeg",
    contacts: [
      { icon: FaLinkedin, link: "#", label: "LinkedIn" },
      { icon: FaEnvelope, link: "mailto: pulalepholisa@gmail.com", label: "Email" },
      { icon: FaTwitter, link: "#", label: "Twitter" },
      { icon: FaGithub, link: "#", label: "GitHub" }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-900  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gradient-to-br from-dark-primary/10 to-transparent bg-gray-900 bg-opacity-80 rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 hover:shadow-2xl">
        <div className="flex flex-col items-center p-8">
          <div className="relative group">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg transition-transform duration-300 group-hover:scale-105">
              <img
                src={founderData.image}
                alt={founderData.name}
                className="w-full h-full object-cover"
                loading="lazy"
                
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <h1 className="text-3xl font-bold text-gray-200 mb-2">{founderData.name}</h1>
            <h2 className="text-xl text-gray-400 mb-1">{founderData.title}</h2>
            <h3 className="text-lg font-medium text-indigo-400 mb-4">{founderData.company}</h3>
            <p className="text-gray-500 font-medium mb-6">{founderData.tagline}</p>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
              {founderData.mission}
            </p>
          </div>

          <div className="flex space-x-6 mt-4">
            {founderData.contacts.map((contact, index) => (
              <a
                key={index}
                href={contact.link}
                aria-label={contact.label}
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
              >
                <contact.icon className="w-6 h-6" />
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="bg-gray-50 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-gray-600">AI & Machine Learning</span>
            </div>
            <div className="bg-gray-50 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-gray-600">Digital Transformation</span>
            </div>
            <div className="bg-gray-50 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-gray-600">Tech Leadership</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderProfile;