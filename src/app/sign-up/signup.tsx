"use client"

import React, { useCallback, useEffect, useState } from "react"
import Dropdown from "./dropdown";
import axios from "axios";
import Notification from "../components/notification";

const SignUp: React.FC = ()=> {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [dirty, setDirty] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const roles = [
        { label: 'I want to buy tickets', value: 'ROLE_BASIC_USER' },
        { label: 'I want to publish an event', value: 'ROLE_PUBLISHER' }
    ];

    const validateEmail = (email: string) => {
        // just a simple email validation
        const req = /\S+@\S+\.\S+/;
        return req.test(email);
    };

    const handleValidation = useCallback(() => {
        // just a simple password check for security purposes
        const validPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password);

        if (dirty) {
            if (!validateEmail(email)) {
                setNotification({ message: 'Please enter a valid email address.', type: 'error' });
                setDisabled(true);
                return;
            }
            if (password.length < 7) {
                setNotification({ message: 'Password must be at least 7 characters long.', type: 'error' });
                setDisabled(true);
                return;
            }
            if (!validPassword) {
                setNotification({ message: 'Password must contain both letters and numbers.', type: 'error' });
                setDisabled(true);
                return;
            }
            if (!role) {
                setNotification({ message: 'Please select the account type.', type: 'error' });
                setDisabled(true);
                return;
            }
            setDisabled(false);
            setNotification(null); 
        }
    }, [email, password, dirty, role]);

    useEffect(() => {
        handleValidation();
    }, [handleValidation]);


    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:8080/user/register',
                new URLSearchParams({ username, email, password, role }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                }
            );
    
            if (response.status === 201) {
                setNotification({ message: 'Account created successfully!', type: 'success' });
                setUsername('');
                setEmail('');
                setPassword('');
                setRole('');
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                let errorMessage = 'Failed to create account! Please try again.';
    
                if (status === 409) {
                    errorMessage = err.response?.data || 'Email or username already exist! Please try again.';
                }
    
                setNotification({ message: errorMessage, type: 'error' });
            } else {
                setNotification({ message: 'An unexpected error occurred! Please try again.', type: 'error' });
            }
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-400 to-gray-900">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md animate-fade-in-down">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create an account to begin</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setDirty(true); }}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setDirty(true); }}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                        Choose account type
                    </label>
                    <Dropdown
                        options={roles}
                        selectedValue={role}
                        onChange={(value) => setRole(value)}
                    />
                </div>
                <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={disabled}
                            className={`w-full ${disabled ? 'bg-gray-300' : 'bg-gray-700 hover:bg-gray-900'} text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out`}
                        >
                            Sign Up
                        </button>
                    </div>
            </form>
        </div>
        {notification && 
        <Notification 
            message= {notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
        />
        }
    </div>
    )
}

export default SignUp;