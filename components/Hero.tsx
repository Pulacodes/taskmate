import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaGraduationCap, FaLaptopCode, FaMoneyBillWave, FaTasks } from "react-icons/fa";
import { IconType } from "react-icons";

const HeroSection = () => {
  const [taskCount, setTaskCount] = useState(150);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setTaskCount((prev) => prev + Math.floor(Math.random() * 5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  interface FloatingIconProps {
    icon: IconType;
    delay: string;
  }

  const FloatingIcon = ({ icon: Icon, delay }: FloatingIconProps) => (
    <div
      className={`absolute transform transition-all duration-1000 ease-in-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      style={{ transitionDelay: delay }}
    >
      <Icon className="text-primary text-2xl md:text-3xl animate-bounce" />
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-primary/10 to-transparent" />

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue animate-pulse">
              Get it done on time!
            </h1>

            <p className="text-lg md:text-xl text-gray-400 opacity-90">
              Join the largest student task marketplace in kibris. If you need something done quick this is the place. Complete tasks, earn money, and build your portfolio while pursuing your degree.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={"/tasks"} className="px-8 py-4 bg-primary text-white rounded-lg transform hover:scale-105 transition-all duration-300 font-semibold">
                Add a Task
              </Link>
              <Link href={"/viewtask"} className="px-8 py-4 bg-black text-white rounded-lg transform hover:scale-105 transition-all duration-300 font-semibold">
                Browse Tasks
              </Link>
            </div>

            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <FaTasks className="text-primary" />
                <span>{taskCount}+ Active Tasks</span>
              </div>
              <div className="h-4 w-px bg-dark-border" />
              <div className="flex items-center gap-2">
                <FaMoneyBillWave className="text-green" />
                <span>Avg. $10/task</span>
              </div>
            </div>
          </div>

          <div className="relative h-[400px] md:h-[600px]">
            <div className="absolute inset-0  rounded-2xl overflow-hidden">
              <img
                src="/hero.png"
                alt="Students collaborating"
                className="w-full h-full object-cover mix-blend-overlay opacity-50"
              />
            </div>

            <FloatingIcon icon={FaGraduationCap} delay="0ms" />
            <FloatingIcon icon={FaLaptopCode} delay="200ms" />
            <FloatingIcon icon={FaMoneyBillWave} delay="400ms" />

            <div className="absolute bottom-8 left-8 right-8 bg-black/80 backdrop-blur-sm p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                  alt="Student testimonial"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-medium">"I earned $2000 last semester while improving my skills. This platform is a game-changer!"</p>
                  <p className="text-white text-sm mt-2">- Sarah J., Computer Science Major</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;