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

    const hasPhone = typeof phone === 'string' && phone.length > 0;
    const hasEmail = typeof userEmail === 'string' && userEmail.length > 0;
    const hasUserId = typeof userId === 'string' && userId.length > 0;

    const missing: string[] = [];
    if (!selectedBrand) missing.push("brand");
    if (!selectedModel) missing.push("model");
    if (!selectedFacility) missing.push("facility");
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <ToastContainer />

      <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden border border-emerald-100 dark:border-gray-700">
        <div className="bg-emerald-600 dark:bg-emerald-700 p-8 md:p-12 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">Smartphone Recycling</h1>
          <p className="text-emerald-100 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Book a pickup to safely dispose of your old smartphones and protect the environment.
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
              onChange={e => setUserEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="brand" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Device Brand</label>
            <select id="brand" value={selectedBrand} onChange={handleBrandChange} className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer">
              <option value="">Select Brand</option>
              {brands.map((brand, idx) => (
                <option key={brand.brand + idx} value={brand.brand}>{brand.brand}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Device Model</label>
            <select id="model" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer">
              <option value="">Select Model</option>
              {models.map((model, idx) => (
                <option key={model + idx} value={model}>{model}</option>
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

export default Smartphone;
