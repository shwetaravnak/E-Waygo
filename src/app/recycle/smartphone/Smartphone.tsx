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
  brand: string;
  models: string[];
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

const Smartphone: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedFacility, setSelectedFacility] = useState("");
  const [recycleItemPrice, setRecycleItemPrice] = useState<number>(0);
  const [pickupDate, setPickupDate] = useState<string>("");
  const [pickupTime, setPickupTime] = useState<string>("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [address, setAddress] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [facilityData, setFacilityData] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const email = getEmail();
  const [userEmail, setUserEmail] = useState(email || "");

  useEffect(() => {
    setFacilityData(facility as unknown as Facility[]);
  }, []);

  const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    setSelectedModel("");
    setSelectedFacility("");
  
    if (brand) {
      const selectedBrand = brands.find((b) => b.brand === brand);
      if (selectedBrand) {
        setModels(selectedBrand.models);
      }
    }
  };

  useEffect(() => {
    const brandsData: Brand[] = [
      { brand: "Samsung", models: ["Galaxy S21", "Galaxy S20", "Galaxy Note 20", "Galaxy A52", "Galaxy M32"] },
      { brand: "Apple", models: ["iPhone 13", "iPhone 12", "iPhone SE", "iPhone 11", "iPhone XR"] },
      { brand: "Xiaomi", models: ["Redmi Note 10", "Mi 11X", "Poco X3", "Redmi 9", "Mi 10T"] },
      { brand: "OnePlus", models: ["OnePlus 9 Pro", "OnePlus 9", "OnePlus 8T", "OnePlus Nord", "OnePlus 8"] },
      { brand: "Realme", models: ["Realme 8 Pro", "Realme Narzo 30 Pro", "Realme 7", "Realme C11", "Realme X7 Max"] },
      { brand: "Vivo", models: ["Vivo V21", "Vivo Y73", "Vivo X60 Pro", "Vivo S1 Pro", "Vivo Y20G"] },
      { brand: "OPPO", models: ["OPPO F19 Pro", "OPPO Reno 5 Pro", "OPPO A74", "OPPO A53", "OPPO Find X3 Pro"] },
      { brand: "Nokia", models: ["Nokia 5.4", "Nokia 3.4", "Nokia 8.3", "Nokia 2.4", "Nokia 7.2"] },
      { brand: "Motorola", models: ["Moto G60", "Moto G40 Fusion", "Moto G30", "Moto G9 Power", "Moto E7 Power"] },
    ];
    setBrands(brandsData);
    setModels(models);
  }, [models]);

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
    if (!selectedBrand) missing.push("brand");
    if (!selectedModel) missing.push("model");
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

      <h1 className="text-4xl font-bold mb-6 p-6 text-center">Smartphone Recycling</h1>
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
            onChange={e => setUserEmail(e.target.value)}
            required
            className="w-full p-2 sign-field rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="brand" className="block text-2xl font-medium text-gray-600">Select Brand:</label>
          <select id="brand" value={selectedBrand} onChange={handleBrandChange} className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500">
            <option value="">Select Brand</option>
            {brands.map((brand, idx) => (
              <option key={brand.brand + idx} value={brand.brand}>{brand.brand}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="model" className="block text-2xl font-medium text-gray-600">Select Model:</label>
          <select id="model" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500">
            <option value="">Select Model</option>
            {models.map((model, idx) => (
              <option key={model + idx} value={model}>{model}</option>
            ))}
          </select>
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

export default Smartphone;
