"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken } from "../../sign-in/auth";
import { useRouter } from "next/navigation";

const AddCenter = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    facility: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.fullname || !formData.email || !formData.phoneNumber || !formData.facility) {
      toast.error("All fields are required");
      return;
    }

    // Generate a secure default password since it's removed from UI
    const defaultPassword = Math.random().toString(36).slice(-10) + "A1!";

    setIsLoading(true);
    toast.loading("Adding recycle center...");

    try {
      const token = getToken();
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          password: defaultPassword,
          role: "ewaste_center"
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast.dismiss();
        toast.success(`Recycle center added! Password: ${defaultPassword}`, { autoClose: false }); // Show password once
        setFormData({ fullname: "", email: "", phoneNumber: "", facility: "" });
        router.push("/admin");
      } else {
        toast.dismiss();
        toast.error(data.message || "Failed to add center");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Add Recycle Center</h1>
            <p className="text-gray-500 dark:text-gray-400">Create a new E-Waste Center account</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="Enter center manager name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="center@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="1234567890"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Facility Name</label>
              <input
                type="text"
                name="facility"
                value={formData.facility}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="E-Waste Recycling Center - Downtown"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Adding...
                </>
              ) : (
                "Add Recycle Center"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push("/admin")}
              className="text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCenter;
