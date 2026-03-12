"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDarkMode } from "../utils/DarkModeContext";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code">("email");

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    toast.loading("Sending reset code...");

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      toast.dismiss();
      toast.success("Reset code sent to your email!");
      setStep("code");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.location.href = `/reset-password?email=${encodeURIComponent(email)}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        <div className="p-8 md:p-12 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-center">Forgot Password?</h1>
          <p className="text-gray-500 mb-8 text-center">
            {step === "email" ? "Enter your email to receive a reset code." : "Enter the code sent to your email."}
          </p>
          
          <form className="w-full space-y-5" onSubmit={step === "email" ? handleEmailSubmit : handleCodeSubmit}>
            {step === "email" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <button
                  className={`w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Code"}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reset Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-center text-2xl tracking-widest"
                    placeholder="000000"
                    required
                  />
                </div>
                
                <button className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all">
                  Continue to Reset Password
                </button>
              </>
            )}
          </form>
          
          <div className="mt-8 text-center">
            <Link href="/sign-in" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
