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
  recycleItemPrice: number;
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
  const [recycleItemPrice, setRecycleItemPrice] = useState<number>(0);
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

    const hasPrice = recycleItemPrice !== undefined && recycleItemPrice >= 0;
    const hasPhone = typeof phone === 'string' && phone.length > 0;
    const hasEmail = typeof userEmail === 'string' && userEmail.length > 0;
    const hasUserId = typeof userId === 'string' && userId.length > 0;

    const missing: string[] = [];
    if (!selectedBrand) missing.push("category");
    if (!selectedModel) missing.push("item");
    if (!selectedFacility) missing.push("facility");
    if (!hasPrice) missing.push("price");
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
      recycleItemPrice,
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
        setRecycleItemPrice(0);
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
    <div className="container mx-auto p-8">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-6 p-6 text-center">Accessories Recycling</h1>
      <form
        className="grid grid-cols-1 md:grid-cols-2 mx-8 md:mx-0 gap-4 justify-center"
        onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
      >
        {/* Email */}
        <div className="mb-4">
          <label className="block text-2xl font-medium text-gray-600">Email:</label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
            className="w-full p-2 sign-field rounded-md"
          />
        </div>
        {/* Category */}
        <div className="mb-4">
          <label className="block text-2xl font-medium text-gray-600">Select Category:</label>
          <select value={selectedBrand} onChange={handleBrandChange} className="w-full p-2 sign-field rounded-md">
            <option value="">Select Category</option>
            {brands.map((b, idx) => <option key={b.category + idx} value={b.category}>{b.category}</option>)}
          </select>
        </div>

        {/* Items */}
        <div className="mb-4">
          <label className="block text-2xl font-medium text-gray-600">Select Items:</label>
          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full p-2 sign-field rounded-md">
            <option value="">Select Items</option>
            {models.map((m, idx) => <option key={m + idx} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-2xl font-medium text-gray-600">Recycle Item Price:</label>
          <input type="number" value={recycleItemPrice} onChange={(e) => setRecycleItemPrice(Number(e.target.value))} className="w-full p-2 sign-field rounded-md" />
        </div>

        {/* Pickup Date */}
        <div className="mb-4">
          <label className="block text-2xl font-medium text-gray-600">Pickup Date:</label>
          <input type="date" value={pickupDate} min={currentDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full p-2 sign-field rounded-md" />
        </div>

        {/* Pickup Time */}
        <div className="mb-4">
          <label className="block text-2xl font-medium text-gray-600">Pickup Time:</label>
          <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full p-2 sign-field rounded-md" />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-2xl font-medium text-gray-600">Location:</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 sign-field rounded-md" />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-2xl font-medium text-gray-600">Phone:</label>
          <input type="tel" value={phone ?? ""} readOnly className="w-full p-2 sign-field rounded-md bg-gray-100" />
        </div>

        {/* Facility */}
        <div className="mb-4">
          <label className="block text-2xl font-medium text-gray-600">Select Facility:</label>
          <select value={selectedFacility} onChange={(e) => setSelectedFacility(e.target.value)} className="w-full p-2 sign-field rounded-md">
            <option value="">Select Facility</option>
            {facilityData.map((f, idx) => <option key={(f.name || 'facility') + idx} value={f.name}>{f.name}</option>)}
          </select>
        </div>

        {/* Submit */}
        <div className="mb-4 md:col-span-2">
          <button type="submit" className="bg-emerald-700 text-xl text-white px-6 py-3 rounded-md w-full">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Accessories;
