"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getEmail,
  getPhoneNumber,
  getUserID,
  getfullname,
  isAuthenticated,
  getUser,
  getToken,
} from "@/app/sign-in/auth";
import { facility } from "@/app/data/facility";

interface Brand {
  category: string;
  items: string[];
}

interface Facility {
  name: string;
  capacity: string | number;
  lon: number;
  lat: number;
  contact: string;
  time: string;
  verified: boolean;
}

interface BookingData {
  userId: string;
  userEmail: string;
  recycleItem: string;
  pickupDate: string;
  pickupTime: string;
  facility: string; // Facility Name
  fullName: string;
  address: string;
  phone: string;
}

const Accessories: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedFacility, setSelectedFacility] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [address, setAddress] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [facilityData, setFacilityData] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const email = getEmail();
  const [userEmail, setUserEmail] = useState(email || "");

  const userId = getUserID();
  const phone = getPhoneNumber();
  const fullname = getfullname();

  useEffect(() => {
    setFacilityData(facility as unknown as Facility[]);
  }, []);

  useEffect(() => {
    const accessoriesData: Brand[] = [
      { category: "Headphones", items: ["Sony WH-1000XM4", "Bose QC35", "AirPods Pro"] },
      { category: "Chargers", items: ["Anker PowerPort", "Apple 20W USB-C"] },
      { category: "Laptop Bags", items: ["SwissGear Backpack", "AmazonBasics"] },
      { category: "External Hard Drives", items: ["WD Black 5TB", "Seagate Backup Plus"] },
      { category: "Smartwatches", items: ["Apple Watch 7", "Samsung Galaxy Watch 4"] },
      { category: "Mouse and Keyboards", items: ["Logitech MX Master 3", "Apple Magic Keyboard"] },
      { category: "Power Banks", items: ["Anker PowerCore 26800mAh", "Xiaomi Mi Power Bank"] },
    ];
    setBrands(accessoriesData);
  }, []);

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    setSelectedModel("");
    const foundBrand = brands.find((b) => b.category === brand);
    setModels(foundBrand ? foundBrand.items : []);
  };

  function isTrulyAuthenticated() {
    const user = getUser();
    return !!(user && user.token && typeof user.token === 'string' && user.token.length > 0);
  }

  const handleSubmit = async () => {
    if (!isTrulyAuthenticated()) {
      toast.error("Please login to book a facility");
      return;
    }

    const hasPhone = typeof phone === 'string' && phone.length > 0;
    const hasEmail = typeof userEmail === 'string' && userEmail.length > 0;
    const hasUserId = typeof userId === 'string' && userId.length > 0;

    const missing: string[] = [];
    if (!selectedBrand) missing.push("category");
    if (!selectedModel) missing.push("item");
    if (!selectedFacility) missing.push("facility");
    if (!pickupDate) missing.push("pickup date");
    if (!pickupTime) missing.push("pickup time");
    if (!fullname) missing.push("full name");
    if (!hasPhone) missing.push("phone");
    if (!address) missing.push("address");
    if (!hasEmail) missing.push("email");
    if (!hasUserId) missing.push("userId");

    if (missing.length > 0) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      return;
    }

    const newBooking: BookingData = {
      userId,
      userEmail: userEmail,
      recycleItem: `${selectedBrand} - ${selectedModel}`,
      pickupDate,
      pickupTime,
      facility: selectedFacility,
      fullName: fullname,
      address,
      phone,
    };

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBooking),
      });

      if (response.ok) {
        toast.success("Submitted successfully!");
        setSelectedBrand("");
        setSelectedModel("");
        setSelectedFacility("");
        setPickupDate("");
        setPickupTime("");
        setAddress("");
      } else {
        toast.error("Error submitting data.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting data.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader" />
        <div className="loading-text">Submitting...</div>
      </div>
    );
  }

  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <ToastContainer />

      <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden border border-emerald-100 dark:border-gray-700">
        <div className="bg-emerald-600 dark:bg-emerald-700 p-8 md:p-12 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">Accessories Recycling</h1>
          <p className="text-emerald-100 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Book a pickup to safely dispose of your e-waste accessories and protect the environment.
          </p>
        </div>

        <form
          className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        >
          {/* Email */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="brand" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Category</label>
            <select id="brand" value={selectedBrand} onChange={handleBrandChange} className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer">
              <option value="">Select Category</option>
              {brands.map((b, idx) => (
                <option key={b.category + idx} value={b.category}>{b.category}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Item</label>
            <select id="model" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer">
              <option value="">Select Item</option>
              {models.map((m, idx) => (
                <option key={m + idx} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pickupDate" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Pickup Date</label>
            <input type="date" id="pickupDate" value={pickupDate} min={currentDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all cursor-pointer text-gray-700 dark:text-gray-300" />
          </div>

          <div>
            <label htmlFor="pickupTime" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Pickup Time</label>
            <input type="time" id="pickupTime" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all cursor-pointer text-gray-700 dark:text-gray-300" />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label htmlFor="address" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Pickup Address</label>
            <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter full address" className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
            <input type="tel" id="phone" value={phone ?? ""} readOnly className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed outline-none" />
          </div>

          <div>
            <label htmlFor="facility" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Recycling Facility</label>
            <select id="facility" value={selectedFacility} onChange={(e) => setSelectedFacility(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer">
              <option value="">Select Facility</option>
              {facilityData.map((f, idx) => (
                <option key={(f.name || 'facility') + idx} value={f.name}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 mt-6">
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/30 text-lg">
              Confirm Pickup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Accessories;
