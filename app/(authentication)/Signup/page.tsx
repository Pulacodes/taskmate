'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, action: 'signup' }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Something went wrong');
        return;
      }

      router.push('/Login'); // Redirect to login after signup
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  

  return (

    <div className="min-h-screen flex items-center justify-center bg-[url('/emu.jpg')] bg-cover bg-center py-20">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Create an Account</h2>
        <p className="text-center text-gray-500 mb-8">Join us and start completing or posting tasks</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              id="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded-lg outline-none focus:border-green-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg outline-none focus:border-green-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg outline-none focus:border-green-500"
              placeholder="Create a password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center justify-center mt-6 text-sm">
          <p className="text-gray-500">Already have an account?</p>
          <a href="/Login" className="ml-2 text-green-500 hover:underline">
            Log In
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
