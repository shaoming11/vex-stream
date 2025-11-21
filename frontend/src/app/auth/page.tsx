'use client';

import { useState, useEffect } from 'react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5001/auth/verify', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          // User is already logged in, redirect to home
          window.location.href = '/';
        }
      } catch (error) {
        // User is not logged in, stay on auth page
      }
    };

    checkAuth();
  }, []);

  const buttonClass = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200';
  const inputClass = 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline';
  const linkClass = 'text-blue-500 hover:text-blue-800 cursor-pointer';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const response = await fetch(`http://localhost:5001/auth${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        if (isLogin || !isLogin) { // Both login and register now set cookies
          // Cookie is automatically set by the server
          // Redirect to main page
          window.location.href = '/';
        }
      } else {
        setMessage(data.error || 'An error occurred');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            VEX Scouting Tool
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={inputClass}
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={inputClass}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <div className={`text-center text-sm ${message.includes('error') || message.includes('Invalid') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center ${buttonClass} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign in' : 'Register')}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span
                className={linkClass}
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage('');
                  setUsername('');
                  setPassword('');
                }}
              >
                {isLogin ? 'Register' : 'Sign in'}
              </span>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}