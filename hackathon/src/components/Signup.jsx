import React, {useState} from 'react';
import "../index.css";
import {Link} from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    const handleSignup = (e) => {
        e.preventDefault();

    }

    return (
        <div>
            <div>
                <div>
                    <h2>
                        Sign up for an account
                    </h2>
                </div>
                <div>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input
                                id="signupName"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>
                                Role
                            </label>
                            <div className="relative">
                                <input
                                    id="role"
                                    placeholder="Student"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                        >
                            Sign Up
                        </button>
                    </form>
                    Already have an account? <Link to="/signin"> Sign In! </Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;