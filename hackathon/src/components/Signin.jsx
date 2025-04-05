import React, { useState } from 'react';
import { Link } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-md max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Log in to your account
          </h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="john.doe@usfca.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="student"
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="student" className="ml-2 block text-sm text-gray-700">
                  Student
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="teacher"
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={role === "teacher"}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="teacher" className="ml-2 block text-sm text-gray-700">
                  Teacher
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signin;