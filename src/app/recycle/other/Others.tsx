import { facility } from "@/app/data/facility";
import {
  getEmail,
  getPhoneNumber,
  getUserID,
  getfullname,
  isAuthenticated,
  getUser,
  getToken,
} from "@/app/sign-in/auth";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  facility: string;
  fullName: string;
  address: string;
  phone: string;
}

const Others: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedFacility, setSelectedFacility] = useState("");
  const [recycleItemPrice, setRecycleItemPrice] = useState<number>(0);
  const [pickupDate, setPickupDate] = useState<string>("");
  const [pickupTime, setPickupTime] = useState<string>("");
  const [address, setAddress] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [facilityData, setFacilityData] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFacilityData(facility as unknown as Facility[]);
  }, []);

  const handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedBrand(event.target.value);
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedModel(event.target.value);
  };

  const email = getEmail();
  const [userEmail, setUserEmail] = useState(email || "");
  const userId = getUserID();
  const phone = getPhoneNumber();
  const fullname = getfullname();

  useEffect(() => {
    const debugUser = getUser();
    const debugToken = getToken && getToken();
    const debugAuth = isAuthenticated();
    console.log('Recycling page user:', debugUser);
    console.log('Recycling page token:', debugToken);
    console.log('Recycling page isAuthenticated:', debugAuth);
  }, []);

  function isTrulyAuthenticated() {
    const user = getUser();
    return !!(user && user.token && typeof user.token === 'string' && user.token.length > 0);
  }

  const handleSubmit = async () => {
    const recycleItem = selectedBrand + selectedModel;

    if (!isTrulyAuthenticated()) {
      toast.error("Please Login to book a facility", { autoClose: 3000 });
      return;
    }
    if (facilityData.length === 0) {
      toast.error("No facility data loaded.", { autoClose: 3000 });
      return;
    }

    const hasPrice = recycleItemPrice !== undefined && recycleItemPrice >= 0;
    const hasPhone = typeof phone === 'string' && phone.length > 0;
    const hasEmail = typeof userEmail === 'string' && userEmail.length > 0;
    const hasUserId = typeof userId === 'string' && userId.length > 0;

    const missing: string[] = [];
    if (!selectedBrand) missing.push("device");
    if (!selectedModel) missing.push("company/model");
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
      toast.error(`Please fill: ${missing.join(", ")}`, { autoClose: 4000 });
      return;
    }

    const newBooking: BookingData = {
      userId: userId,
      userEmail: userEmail,
      recycleItem,
      recycleItemPrice,
      pickupDate,
      pickupTime,
      facility: selectedFacility,
      fullName: fullname,
      address: address,
      phone: phone,
    };

    setBookingData([...bookingData, newBooking]);
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBooking),
      });

      if (response.ok) {
        toast.success("Submitted successfully!", { autoClose: 3000 });
        setSelectedBrand("");
        setSelectedModel("");
        setSelectedFacility("");
        setRecycleItemPrice(0);
        setPickupDate("");
        setPickupTime("");
        setAddress("");
        setIsLoading(false)
      } else {
        toast.error("Error submitting data.", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error submitting data.", { autoClose: 3000 });
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

      <h1 className="text-4xl font-bold mb-6 p-6 text-center">Others Recycling</h1>
      <form
        className="grid grid-cols-1 md:grid-cols-2 mx-8 md:mx-0 gap-4 justify-center"
        onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
      >
        {/* Email */}
        <div className="mb-4">
          <label className="block text-2xl font-medium text-gray-600">Email:</label>
          <input type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} required className="w-full p-2 sign-field rounded-md" />
        </div>
        <div className="mb-4">
          <label htmlFor="brand" className="block text-2xl font-medium text-gray-600">Device:</label>
          <input type="text" id="brand" value={selectedBrand} onChange={handleBrandChange} className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500" />
        </div>
        <div className="mb-4">
          <label htmlFor="model" className="block text-2xl font-medium text-gray-600">Device Company/Model:</label>
          <input type="text" id="model" value={selectedModel} onChange={handleModelChange} className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500" />
        </div>
        <div className="mb-4">
          <label htmlFor="recycleItemPrice" className="block text-2xl font-medium text-gray-600">Recycle Item Price:</label>
          <input type="number" id="recycleItemPrice" value={recycleItemPrice} onChange={(e) => setRecycleItemPrice(Number(e.target.value))} className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500" />
        </div>
        <div className="mb-4">
          <label htmlFor="pickupDate" className="block text-2xl font-medium text-gray-600">Pickup Date:</label>
          <input type="date" id="pickupDate" value={pickupDate} min={currentDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500" />
        </div>
        <div className="mb-4">
          <label htmlFor="pickupTime" className="block text-2xl font-medium text-gray-600">Pickup Time:</label>
          <input type="time" id="pickupTime" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500" />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-2xl font-medium text-gray-600">Location:</label>
          <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500" />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-2xl font-medium text-gray-600">Phone:</label>
          <input type="tel" id="phone" value={phone ?? ""} readOnly className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500" />
        </div>
        <div className="mb-4">
          <label htmlFor="facility" className="block text-2xl font-medium text-gray-600">Select Facility:</label>
          <select id="facility" value={selectedFacility} onChange={(e) => setSelectedFacility(e.target.value)} className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500">
            <option value="">Select Facility</option>
            {facilityData.map((f, idx) => (
              <option key={(f.name || 'facility') + idx} value={f.name}>{f.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4 md:col-span-2">
          <button type="submit" className="bg-emerald-700 text-xl text-white px-6 py-3 rounded-md w-full">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Others;
