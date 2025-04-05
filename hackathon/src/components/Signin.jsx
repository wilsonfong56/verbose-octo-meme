import React, {useState} from 'react';
import {Link} from "react-router-dom";

const Signin = () => {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

    }

    return (
        <div>
            <div>
                <div>
                    <h2>
                        Log in to your account
                    </h2>
                </div>
                <div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input
                                id="loginName"
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
                            Sign In
                        </button>
                    </form>
                    New here? <Link to="/signup"> Sign Up! </Link>
                </div>
            </div>
        </div>
    );
}

export default Signin;