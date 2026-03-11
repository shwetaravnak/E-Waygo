"use client";

import React, { useState, ChangeEvent } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import axios from "axios";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "user",
    facility: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Real-time password match validation
    if (name === "confirmPassword" || name === "password") {
      if (name === "confirmPassword") {
        setPasswordMatch(value === formData.password);
      } else {
        setPasswordMatch(value === formData.confirmPassword);
      }
    }
  };

  const getPasswordStrength = (password: string): { level: string; color: string; width: string } => {
    if (password.length === 0) return { level: "", color: "bg-gray-200", width: "0%" };
    if (password.length < 6) return { level: "Weak", color: "bg-red-500", width: "33%" };
    if (password.length < 10) return { level: "Medium", color: "bg-yellow-500", width: "66%" };
    return { level: "Strong", color: "bg-green-500", width: "100%" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const register = async () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    setIsLoading(true);

    const submitData = {
      fullname: formData.fullname,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      role: formData.role,
      facility: formData.role === 'ewaste_center' ? formData.facility : undefined,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        submitData
      );
      toast.success("Registration Successful!");
      window.location.href = "/sign-in";
    } catch (error: any) {
      console.error("Register failed:", error);
      toast.error(
        `Registration Failed. ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to EWAYGO</h1>
          <p className="text-gray-500">Please enter your details to create an account</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left Column */}
            <div className="p-8 md:p-10 bg-gradient-to-br from-emerald-50 to-white">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Details</h2>
              
              {/* Email */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handleInputChange}
                    value={formData.email}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    onChange={handleInputChange}
                    value={formData.password}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Password strength</span>
                      <span className={`text-xs font-medium ${passwordStrength.level === 'Strong' ? 'text-green-600' : passwordStrength.level === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                        {passwordStrength.level}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: passwordStrength.width }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all ${!passwordMatch && formData.confirmPassword ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'}`}
                    onChange={handleInputChange}
                    value={formData.confirmPassword}
                    required
                  />
                </div>
                {!passwordMatch && formData.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="p-8 md:p-10 bg-white">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>

              {/* Full Name */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    name="fullname"
                    placeholder="Enter your full name"
                    onChange={handleInputChange}
                    value={formData.fullname}
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    onChange={handleInputChange}
                    value={formData.phoneNumber}
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <select
                    name="role"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none bg-white"
                    onChange={handleInputChange}
                    value={formData.role}
                    required
                  >
                    <option value="user">User</option>
                    <option value="ewaste_center">E-Waste Center</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Facility (conditional) */}
              {formData.role === 'ewaste_center' && (
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facility</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <select
                      name="facility"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none bg-white"
                      onChange={handleInputChange}
                      value={formData.facility}
                      required
                    >
                      <option value="">Select Facility</option>
                      <option value="Arya's Home">Arya's Home</option>
                      <option value="Shweta's School">Shweta's School</option>
                      <option value="Samiksha'S Home">Samiksha'S Home</option>
                      <option value="Tanmay's Home">Tanmay's Home</option>
                      <option value="Dombivali Centre">Dombivali Centre</option>
                      <option value="Sai Krupa Bldg">Sai Krupa Bldg</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="px-8 md:px-10 pb-10">
            {/* Terms & Submit */}
            <div className="mt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" 
                    required
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the <Link href="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>
                  </span>
                </label>
              </div>
              
              <button
                className={`w-full mt-6 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                onClick={register}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Create Account
                  </>
                )}
              </button>
            </div>

            {/* Sign In Link */}
            <p className="text-center mt-8 text-gray-600">
              Already have an account?{' '}
              <Link href="/sign-in" className="font-semibold text-emerald-600 hover:text-emerald-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

