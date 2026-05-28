"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleFailure, handleSuccess } from "@/lib/notification";
import axios from "axios";
import { Eye, EyeClosed, LoaderCircle, Lock, Mail, User } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  const [signupInfo, setSignupInfo] = useState({
    username: '',
    email: '',
    password: ''
  }); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('/api/users/signup', signupInfo);
      console.log(response.data);
      const {message, success} = response.data;

      if(success) {
        handleSuccess(message);
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      }

    } catch (error: any) {
      if(error.response) {
        setLoading(false);
        const data = error.response.data;
        handleFailure(data.error || 'Invalid Email & password');
      }
      else {
        console.error(error.message);
        handleFailure('Network error. Please check your connection.');
      }
    } finally{
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-200 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg m-4">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Create an Account</h1>
          <p className="mt-2 text-gray-500">Get started with your free account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="username" className="font-medium text-black">
                Username
                </label>
                <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <User strokeWidth={1.5} className="w-5 h-5 text-gray-400" />
                </span>
                <input onChange={handleChange}
                    id="username"
                    name="username"
                    type="username"
                    value={signupInfo.username}
                    autoComplete="username"
                    required
                    className="w-full py-2 pl-10 pr-4 text-black bg-gray-100 border border-transparent rounded-lg 
                    focus:outline-none focus:ring-3 focus:border-blue-500 focus:ring-blue-400"
                    placeholder="Enter your username"
                />
            </div>
          </div>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="font-medium text-black">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="w-5 h-5 text-gray-400" />
              </span>
              <input onChange={handleChange}
                id="email"
                name="email"
                type="email"
                value={signupInfo.email}
                autoComplete="email"
                required
                className="w-full py-2 pl-10 pr-4 text-black bg-gray-100 border border-transparent rounded-lg 
                focus:outline-none focus:ring-3 focus:border-blue-500 focus:ring-blue-400"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className=" font-medium text-black ">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="w-5 h-5 text-gray-400" />
              </span>
              <input onChange={handleChange}
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={signupInfo.password}
                autoComplete="current-password"
                required
                className="w-full py-2 pl-10 pr-10 text-gray-700 bg-gray-100 border border-transparent rounded-lg 
                focus:outline-none focus:ring-3 focus:border-blue-500 focus:ring-blue-400 "
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeClosed className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <div>
            <button
              type="submit"
              className="w-full flex mt-2 justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm 
              font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
            >
              {loading ? <LoaderCircle size={20} className=" animate-spin text-white" /> : 'Sign Up'}
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <p className="mt-8 text-sm text-center text-gray-500">
          Already have an account? 
          <Link href="/login" className="ml-2 font-bold text-blue-800 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}