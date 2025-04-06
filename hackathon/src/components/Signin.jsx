import React, { useState, useEffect, useRef } from 'react';

const Signin = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [typedText, setTypedText] = useState("");
  const fullText = "Fast, clear, and smart notes of USF.";
  const indexRef = useRef(0); 

  useEffect(() => {
    const interval = setInterval(() => {
      const nextChar = fullText[indexRef.current];

      setTypedText((prev) => prev + nextChar);
      indexRef.current += 1;

      if (indexRef.current >= fullText.length) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5050/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        window.location.href = "http://localhost:5174/classlists";
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#1e1e1e", fontFamily: "Georgia, serif" }}>


      <div className="w-md max-w-sm mx-auto p-6 bg-[#2d2d2d] rounded-lg shadow-md" style={{ backgroundColor: "#1e1e1e" }}>
        <div className="text-center mb-4">
          <p style={{ color: "#61dafb", fontSize: "1rem", minHeight: "1.5rem" }}>
            {typedText}
          </p>
        </div>


        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: "#61dafb" }}>
            Log in to your account
          </h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: "#61dafb" }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="john.doe@usfca.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-[#1e1e1e] text-[#61dafb] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2" style={{ color: "#61dafb" }}>
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
                <label htmlFor="student" className="ml-2 block text-sm" style={{ color: "#61dafb" }}>
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
                <label htmlFor="teacher" className="ml-2 block text-sm" style={{ color: "#61dafb" }}>
                  Teacher
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#61dafb] hover:bg-[#90e0ff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
