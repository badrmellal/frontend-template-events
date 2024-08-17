"use client";

import React, { useCallback, useEffect, useState } from "react";
import Dropdown from "./dropdown";
import axios from "axios";
import Notification from "../components/notification";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { MarqueeForReviews } from "../components/reviews";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const SignUp: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [googleAppleDisabled, setGoogleAppleDisabled] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const roles = [
    { label: "I want to buy tickets", value: "ROLE_BASIC_USER" },
    { label: "I want to publish an event", value: "ROLE_PUBLISHER" },
  ];

  const validateEmail = (email: string) => {
    const req = /\S+@\S+\.\S+/;
    return req.test(email);
  };

  const handleValidation = useCallback(() => {
    const validPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password);

    if (dirty) {
      if (!validateEmail(email)) {
        setNotification({
          message: "Please enter a valid email address.",
          type: "error",
        });
        setDisabled(true);
        return;
      }
      if (password.length < 7) {
        setNotification({
          message: "Password must be at least 7 characters long.",
          type: "error",
        });
        setDisabled(true);
        return;
      }
      if (!validPassword) {
        setNotification({
          message: "Password must contain both letters and numbers.",
          type: "error",
        });
        setDisabled(true);
        return;
      }
      if (!role) {
        setNotification({
          message: "Please select the account type.",
          type: "error",
        });
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

  useEffect(() => {
    if (!role) {
      setGoogleAppleDisabled(true);
      setNotification({
        message: "Please select the account type first.",
        type: "error",
      });
      return;
    }
    setGoogleAppleDisabled(false);
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/user/register",
        new URLSearchParams({ username, email, password, role }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        }
      );

      if (response.status === 201) {
        setNotification({ message: "Account created successfully!", type: "success" });
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("");
        router.push("/login")
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        let errorMessage = "Failed to create account! Please try again.";

        if (status === 409) {
          errorMessage = err.response?.data || "Email or username already exist! Please try again.";
        }

        setNotification({ message: errorMessage, type: "error" });
      } else {
        setNotification({ message: "An unexpected error occurred! Please try again.", type: "error" });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-400 to-gray-900">
      <div className="absolute inset-0">
        <MarqueeForReviews />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white z-10 p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md"
      >
        <h2 className="text-3xl font-semibold mb-8 text-center font-montserrat text-gray-800">
          Create an account to begin
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5 mt-3 relative">
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="peer shadow mt-1 appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline placeholder-transparent"
              placeholder="Username"
              required
            />
            <label
              htmlFor="username"
              className="absolute left-3 -top-3.5 text-gray-600 text-sm font-montserrat font-medium transition-all duration-200 ease-in-out peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:left-3 peer-placeholder-shown:cursor-text peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
            >
              Username
            </label>
          </div>
          <div className="mb-5 mt-3 relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setDirty(true);
              }}
              className="peer mt-1 shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline placeholder-transparent"
              placeholder="Email"
              required
            />
            <label
              htmlFor="email"
              className="absolute left-3 -top-3.5 text-gray-600 text-sm font-montserrat font-medium transition-all duration-200 ease-in-out peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:left-3 peer-placeholder-shown:cursor-text peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
            >
              Email
            </label>
          </div>
          <div className="mb-5 mt-3 relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setDirty(true);
              }}
              className="peer mt-1 shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline placeholder-transparent"
              placeholder="Password"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-3 -top-3.5 text-gray-600 text-sm font-montserrat font-medium transition-all duration-200 ease-in-out peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:left-3 peer-placeholder-shown:cursor-text peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
            >
              Password
            </label>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-montserrat text-sm font-bold mb-2" htmlFor="role">
              Choose account type
            </label>
            <Dropdown
              options={roles}
              selectedValue={role}
              onChange={(value) => setRole(value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <motion.button
              type="submit"
              disabled={disabled}
              whileHover={{ scale: disabled ? 1 : 1.05 }}
              whileTap={{ scale: disabled ? 1 : 0.95 }}
              className={`w-full ${disabled ? "bg-gray-300 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-900"
                } text-white shadow-md font-bold font-montserrat py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out`}
            >
              Sign Up
            </motion.button>
          </div>
          <div className="flex items-center justify-center">
            <motion.button
              type="button"
              disabled={googleAppleDisabled}
              whileHover={{ scale: googleAppleDisabled ? 1 : 1.05 }}
              whileTap={{ scale: googleAppleDisabled ? 1 : 0.95 }}
              className={`w-full mt-3 ${googleAppleDisabled
                ? "bg-gray-900 text-white cursor-not-allowed"
                : "bg-transparent text-black border border-black hover:bg-black hover:text-white"
                } font-bold font-montserrat py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out`}
            >
              <div className="flex justify-center items-center">
                <FcGoogle className="h-6 w-6 mx-4" />
                Sign up with Google
              </div>
            </motion.button>
          </div>
          <div className="flex justify-center items-center">
            <motion.button
              type="button"
              disabled={googleAppleDisabled}
              whileHover={{ scale: googleAppleDisabled ? 1 : 1.05 }}
              whileTap={{ scale: googleAppleDisabled ? 1 : 0.95 }}
              className={`w-full mt-3 ${googleAppleDisabled
                ? "bg-gray-900 text-white cursor-not-allowed"
                : "bg-transparent text-black border border-black hover:bg-black hover:text-white"
                } font-bold font-montserrat py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out`}
            >
              <div className="flex justify-center items-center">
                <FaApple className="h-6 w-6 mx-4" />
                Sign up with Apple
              </div>
            </motion.button>
          </div>
          <div className="flex justify-center items-start">
            <div className="mt-5 font-montserrat text-sm text-gray-800">
              Already have an account?{" "}
              <a className="font-bold cursor-pointer" href="/login">
                Login here
              </a>
            </div>
          </div>
        </form>
      </motion.div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default SignUp;
