'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

const Navbar = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/task-mate.svg"
            alt="Taskmate"
            width={150}
            height={40}
            className="cursor-pointer"
            unoptimized
          />
        </Link>

        {/* Navigation Links */}
        <nav className="flex space-x-6">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/my-tasks" className="hover:text-gray-300">
            My Tasks
          </Link>
          <Link href="/viewtask" className="hover:text-gray-300">
            Available Tasks
          </Link>
          <Link href="/AboutUs" className="hover:text-gray-300">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-gray-300">
            Contact Us
          </Link>
          <Link href="/tasks" className="hover:text-gray-300">
            Upload a Task
          </Link>
        </nav>

        {/* User Section */}
        <div className="flex items-center justify-end pr-16 lg:pr-0">
          {session ? (
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="hover:text-gray-600"
              >
                
                {session.user.email} {/* Display user's name */}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg py-2">
                  <button 
                    onClick={() => signOut()} 
                    className="block text-black px-4 py-2 text-left w-full hover:bg-blue-100"
                  >
                    Sign Out
                  </button>
                  <button 
                    onClick={() => signIn()} 
                    className="block text-black px-4 py-2 text-left w-full hover:bg-blue-100"
                  >
                    Sign in as a different user
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-end pr-16 lg:pr-0">
              <Link
                  href="/Login"
                  className="hidden px-7 py-3 text-gray-100 font-medium text-dark hover:opacity-70 dark:text-white md:block"
                >
                  Sign In
                </Link>
                <Link
                  href="/Signup"
                  className="ease-in-up shadow-btn hover:shadow-btn-hover hidden rounded-sm bg-primary px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-opacity-90 md:block md:px-9 lg:px-6 xl:px-9"
                >
                  Sign Up
                </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
