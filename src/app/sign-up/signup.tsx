"use client";

import React, { useCallback, useEffect, useState } from "react";
import Dropdown from "./dropdown";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { MarqueeForReviews } from "../components/reviews";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const SignUp: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [googleAppleDisabled, setGoogleAppleDisabled] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const roles = [
    { label: "I want to buy tickets", value: "ROLE_BASIC_USER" },
    { label: "I want to publish an event", value: "ROLE_PUBLISHER" },
  ];

  const validateEmail = (email: string) => {
    const req = /\S+@\S+\.\S+/;
    return req.test(email);
  };

  const handleValidation = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    const validPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password);

    if (dirty) {
      if (!validateEmail(email)) {
        newErrors.email = "Please enter a valid email address.";
      }
      if (password.length < 7) {
        newErrors.password = "Password must be at least 7 characters long.";
      }
      if (!validPassword) {
        newErrors.password = "Password must contain both letters and numbers.";
      }
      if (!role) {
        newErrors.role = "Please select the account type.";
      }
      setErrors(newErrors);
      setDisabled(Object.keys(newErrors).length > 0);
    }
  }, [email, password, dirty, role]);

  useEffect(() => {
    handleValidation();
  }, [handleValidation]);

  useEffect(() => {
    if (!role) {
      setGoogleAppleDisabled(true);
      setErrors((prevErrors) => ({
        ...prevErrors,
        role: "Please select the account type first.",
      }));
      return;
    }
    setGoogleAppleDisabled(false);
    setErrors((prevErrors) => {
      const { role, ...rest } = prevErrors;
      return rest;
    });
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
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("");
        toast({ 
          title: "Login to continue!",
        })
        router.push("/login");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        let errorMessage = "Failed to create account! Please try again.";

        if (status === 409) {
          errorMessage = err.response?.data || "Email or username already exist! Please try again.";
          toast({
            variant: "destructive",
            title: "Email or username already exist!",
            description: "Please try again."
          })
        }
        toast({
          variant: "destructive",
          title: "Failed to create account!",
          description: "Please try again."
        })

      } else {
        toast({
          variant: "destructive",
          title: "An unexpected error occurred!",
          description: "Please try again."
        })
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
        <h2 className="text-3xl font-semibold mb-4 text-left font-montserrat text-gray-800">
          Register
        </h2>
          <p className="text-sm font-medium mb-8 text-left text-gray-500">Create an account to get started</p>
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
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
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
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
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
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>
          {errors.global && <p className="text-red-500 text-sm mb-4">{errors.global}</p>}
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
    </div>
  );
};

export default SignUp;
