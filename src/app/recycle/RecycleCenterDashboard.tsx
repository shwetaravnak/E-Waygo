"use client";

import React, { useEffect, useState, useMemo } from "react";
import { FiPackage, FiCalendar, FiClock, FiMapPin, FiCheckCircle, FiXCircle, FiAlertCircle, FiTrendingUp, FiDollarSign, FiActivity, FiRefreshCw } from "react-icons/fi";
import { getToken, getUser } from "../sign-in/auth";
import { useDarkMode } from "../utils/DarkModeContext";

interface Booking {
  _id: string;
  fullName: string;
  userEmail: string;
  phone: string;
  recycleItem: string;
  recycleItemPrice: number;
  pickupDate: string;
  pickupTime: string;
  address: string;
  facility: string;
  status: string;
  createdAt: string;
}

const RecycleCenterDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useDarkMode();

  const user = getUser();
  const facility = user?.facility;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };
        const res = await fetch("http://localhost:5000/api/bookings", { headers });
        const data = await res.json();
        
        // Filter bookings for this facility
        const facilityBookings = data.filter((b: Booking) => b.facility === facility);
        setBookings(facilityBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    if (facility) fetchBookings();
  }, [facility]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = bookings.length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const accepted = bookings.filter(b => b.status === 'accepted').length;
    const totalValue = bookings.reduce((sum, b) => sum + (Number(b.recycleItemPrice) || 0), 0);
    
    return { total, completed, pending, accepted, totalValue };
  }, [bookings]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'accepted':
        return <FiAlertCircle className="text-blue-500" />;
      case 'declined':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'declined':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Facility Details Section */}
        <div className={`rounded-2xl shadow-lg overflow-hidden mb-8 ${
          isDarkMode ? 'bg-gradient-to-br from-emerald-900 to-gray-800' : 'bg-gradient-to-br from-emerald-500 to-teal-600'
        }`}>
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Facility Icon & Info */}
              <div className="flex items-center gap-6">
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white/20'
                }`}>
                  <FiRefreshCw className={`text-5xl ${isDarkMode ? 'text-emerald-400' : 'text-white'}`} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {facility || 'Recycle Center'}
                  </h1>
                  <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-white/80'}`}>
                    E-Waste Collection & Processing Facility
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <FiMapPin className={isDarkMode ? 'text-emerald-400' : 'text-white'} />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-white'}>Service Area</span>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`rounded-xl p-4 text-center ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/20'}`}>
                  <FiActivity className="text-2xl text-white mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-white/70'}`}>Total</p>
                </div>
                <div className={`rounded-xl p-4 text-center ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/20'}`}>
                  <FiCheckCircle className="text-2xl text-green-300 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats.completed}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-white/70'}`}>Completed</p>
                </div>
                <div className={`rounded-xl p-4 text-center ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/20'}`}>
                  <FiClock className="text-2xl text-yellow-300 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats.pending}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-white/70'}`}>Pending</p>
                </div>
                <div className={`rounded-xl p-4 text-center ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/20'}`}>
                  <FiDollarSign className="text-2xl text-emerald-300 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">₹{stats.totalValue}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-white/70'}`}>Value</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Requests Section */}
        <div className={`rounded-2xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
              <FiPackage className="text-emerald-500" />
              Recycling Requests
            </h2>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Manage and track all incoming e-waste recycling requests
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center">
              <FiRefreshCw className={`text-6xl mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No recycling requests yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Item
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Customer
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Contact
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Pickup Details
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Price
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Status
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {bookings
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((booking) => (
                      <tr key={booking._id} className={`hover:${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} transition-colors`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isDarkMode ? 'bg-emerald-900' : 'bg-emerald-100'
                            }`}>
                              <FiRefreshCw className="text-emerald-500" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">
                              {booking.recycleItem}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-800 dark:text-white font-medium">{booking.fullName}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {booking.userEmail}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-800 dark:text-white">{booking.phone}</p>
                          <p className={`text-sm truncate max-w-[200px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {booking.address}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-800 dark:text-white">
                            <FiCalendar className="text-gray-400" />
                            {booking.pickupDate}
                          </div>
                          <div className="flex items-center gap-2 text-gray-800 dark:text-white mt-1">
                            <FiClock className="text-gray-400" />
                            {booking.pickupTime}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-emerald-600 font-bold text-lg">
                            ₹{booking.recycleItemPrice}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        {bookings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className={`rounded-xl p-6 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Completed Rate
                  </p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-emerald-900' : 'bg-emerald-100'
                }`}>
                  <FiTrendingUp className="text-2xl text-emerald-500" />
                </div>
              </div>
              <div className={`mt-4 h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className={`rounded-xl p-6 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Pending Requests
                  </p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                    {stats.pending}
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'
                }`}>
                  <FiClock className="text-2xl text-yellow-500" />
                </div>
              </div>
              <p className={`text-sm mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Awaiting action
              </p>
            </div>

            <div className={`rounded-xl p-6 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total Value Processed
                  </p>
                  <p className="text-3xl font-bold text-emerald-500 mt-2">
                    ₹{stats.totalValue}
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-emerald-900' : 'bg-emerald-100'
                }`}>
                  <FiDollarSign className="text-2xl text-emerald-500" />
                </div>
              </div>
              <p className={`text-sm mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                From all completed recycling
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecycleCenterDashboard;

