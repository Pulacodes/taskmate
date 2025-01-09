'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Sign up the user
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const signupData = await signupResponse.json();
      if (!signupResponse.ok) {
        setError(signupData.error || 'Failed to create an account. Please try again.');
        return;
      }

      // Log in the user after successful signup
      try {
        const result = await signIn('credentials', {
          redirect: false, // Prevent auto-redirect
          email,
          password,
        });
  
        if (result?.error) {
          setError(result.error); // Set error message if login fails
          return;
        }
  
        // Login successful, redirect to home page
        router.push('/');
      } catch (err) {
        console.error('Login error:', err);
        setError('An error occurred. Please try again.');
      }

      // Redirect to home or dashboard
      router.push('/'); // Update the path based on your app's structure
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/emu.jpg')] bg-cover bg-center py-35">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Create an Account</h2>
        <p className="text-center text-gray-500 mb-8">Join us and start completing or posting tasks</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              id="username"
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
            className="w-full py-3 text-white rounded-lg font-semibold bg-purple-600 hover:bg-purple-700 transition duration-300"
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
