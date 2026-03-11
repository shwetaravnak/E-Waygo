"use client";

import React, { useEffect, useState, useMemo } from "react";
import { FiPackage, FiCalendar, FiClock, FiMapPin, FiCheckCircle, FiXCircle, FiAlertCircle, FiTrendingUp, FiDollarSign, FiActivity, FiRefreshCw, FiTruck, FiCheck, FiX } from "react-icons/fi";
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

// Status workflow with labels and icons
const STATUS_WORKFLOW = [
  { status: 'pending', label: 'Request Submitted', icon: '📝', color: 'yellow' },
  { status: 'accepted', label: 'Accepted', icon: '✅', color: 'blue' },
  { status: 'scheduled', label: 'Scheduled', icon: '📅', color: 'purple' },
  { status: 'out-for-pickup', label: 'Out for Pickup', icon: '🚚', color: 'indigo' },
  { status: 'arrived', label: 'Arrived at Facility', icon: '📍', color: 'cyan' },
  { status: 'verified', label: 'Item Verified', icon: '🔍', color: 'teal' },
  { status: 'picked-up', label: 'Picked Up', icon: '📦', color: 'green' },
  { status: 'processing', label: 'Processing', icon: '♻️', color: 'orange' },
  { status: 'completed', label: 'Completed', icon: '🎉', color: 'emerald' },
  { status: 'declined', label: 'Declined', icon: '❌', color: 'red' },
];

const UsersRequests: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);
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

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = getToken();
      if (!token) {
        alert("You are not logged in. Please login again.");
        return;
      }
      
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      
      console.log("Updating status:", id, "to:", status);
      console.log("Full URL:", `http://localhost:5000/api/bookings/${id}/status`);
      
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status: status }),
      });
      
      console.log("Response status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Updated booking:", data);
        // Update local state
        setBookings((prev: Booking[]) =>
          prev.map((b: Booking) => (b._id === id ? { ...b, status } : b))
        );
        alert(`Status updated to ${status} successfully!`);
        // Refresh the page to get updated data
        window.location.reload();
      } else {
        const error = await res.json();
        console.error("Error response:", error);
        alert(`Failed to update status: ${error.message || 'Unknown error'}. Status sent: "${status}"`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please check console for details.");
    }
  };

  // Open modal with booking details
  const openModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedBooking(null);
    setShowModal(false);
  };

  // Get current status index in workflow
  const getCurrentStatusIndex = (status: string) => {
    return STATUS_WORKFLOW.findIndex(s => s.status === status);
  };

  // Get next available status actions
  const getNextActions = (status: string) => {
    console.log("getNextActions called with status:", status);
    const currentIndex = getCurrentStatusIndex(status);
    console.log("currentIndex:", currentIndex);
    if (currentIndex === -1 || status === 'completed' || status === 'declined') {
      console.log("No actions - status not found or already completed/declined");
      return [];
    }
    
    // For pending status, show accept/decline
    if (status === 'pending') {
      console.log("Pending status - returning accept/decline actions");
      return [
        { status: 'accepted', label: 'Accept Request', color: 'green' },
        { status: 'declined', label: 'Decline Request', color: 'red' },
      ];
    }
    
    // Get next status in workflow
    const nextStatus = STATUS_WORKFLOW[currentIndex + 1];
    console.log("nextStatus:", nextStatus);
    if (nextStatus) {
      return [{ status: nextStatus.status, label: `Mark as ${nextStatus.label}`, color: nextStatus.color }];
    }
    
    return [];
  };

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
    const statusInfo = STATUS_WORKFLOW.find(s => s.status === status);
    return statusInfo ? statusInfo.icon : '📌';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'declined':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'out-for-pickup':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'arrived':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
      case 'verified':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      case 'picked-up':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'processing':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getButtonColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-500 hover:bg-green-600';
      case 'red':
        return 'bg-red-500 hover:bg-red-600';
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'purple':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'indigo':
        return 'bg-indigo-500 hover:bg-indigo-600';
      case 'cyan':
        return 'bg-cyan-500 hover:bg-cyan-600';
      case 'teal':
        return 'bg-teal-500 hover:bg-teal-600';
      case 'emerald':
        return 'bg-emerald-500 hover:bg-emerald-600';
      case 'orange':
        return 'bg-orange-500 hover:bg-orange-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
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
              Click on any booking to see details and update status
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
                      Actions
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
                      <tr key={booking._id} className={`hover:${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} transition-colors cursor-pointer`}
                          onClick={() => openModal(booking)}>
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
                          {/* Click to manage button */}
                          <button
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                          >
                            <FiTruck className="text-sm" />
                            Manage
                          </button>
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

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Manage Request
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Booking Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Booking Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Item</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{selectedBooking.recycleItem}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="font-semibold text-emerald-600">₹{selectedBooking.recycleItemPrice}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customer Name</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{selectedBooking.fullName}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{selectedBooking.phone}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{selectedBooking.userEmail}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pickup Address</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{selectedBooking.address}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pickup Date</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{selectedBooking.pickupDate}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pickup Time</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{selectedBooking.pickupTime}</p>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Current Status</h3>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-3xl">{getStatusIcon(selectedBooking.status)}</span>
                <div>
                  <p className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {STATUS_WORKFLOW.find(s => s.status === selectedBooking.status)?.label || selectedBooking.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Progress</h3>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-600">
                  <div 
                    className="w-full bg-emerald-500 transition-all duration-500"
                    style={{ 
                      height: `${(getCurrentStatusIndex(selectedBooking.status) / (STATUS_WORKFLOW.length - 2)) * 100}%` 
                    }}
                  />
                </div>
                <div className="space-y-2">
                  {STATUS_WORKFLOW.filter(s => s.status !== 'declined').slice(0, -1).map((step, index) => {
                    const isCompleted = index <= getCurrentStatusIndex(selectedBooking.status);
                    const isCurrent = index === getCurrentStatusIndex(selectedBooking.status);
                    return (
                      <div 
                        key={step.status}
                        className={`flex items-center gap-4 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}
                      >
                        <div 
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl z-10 ${
                            isCurrent 
                              ? 'bg-emerald-500 text-white animate-pulse' 
                              : isCompleted 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-500'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <div>
                          <p className={`font-semibold ${
                            isCurrent ? 'text-emerald-600' : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {step.label}
                          </p>
                        </div>
                        {isCompleted && !isCurrent && (
                          <FiCheck className="text-emerald-500 ml-auto" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Actions</h3>
              <div className="space-y-3">
                {getNextActions(selectedBooking.status).map((action) => (
                  <button
                    key={action.status}
                    onClick={async () => {
                      await updateStatus(selectedBooking._id, action.status);
                      closeModal();
                    }}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 ${getButtonColor(action.color)}`}
                  >
                    {action.status === 'declined' ? <FiX /> : <FiCheck />}
                    {action.label}
                  </button>
                ))}
                {selectedBooking.status === 'completed' && (
                  <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center">
                    <p className="text-green-800 dark:text-green-200 font-medium">
                      ✅ This request has been completed
                    </p>
                  </div>
                )}
                {selectedBooking.status === 'declined' && (
                  <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg text-center">
                    <p className="text-red-800 dark:text-red-200 font-medium">
                      ❌ This request has been declined
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersRequests;

