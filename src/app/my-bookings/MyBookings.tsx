"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiPackage, FiCalendar, FiClock, FiMapPin, FiCheckCircle, FiXCircle, FiAlertCircle, FiEye } from "react-icons/fi";
import { getToken, getUser } from "../sign-in/auth";
import { useRouter } from "next/navigation";

// Status step configuration
const STATUS_STEPS = [
  { key: 'pending', label: 'Request Submitted', icon: '📝' },
  { key: 'accepted', label: 'Accepted', icon: '✅' },
  { key: 'scheduled', label: 'Scheduled', icon: '📅' },
  { key: 'out-for-pickup', label: 'Out for Pickup', icon: '🚚' },
  { key: 'arrived', label: 'Arrived at Location', icon: '📍' },
  { key: 'verified', label: 'Item Verified', icon: '✓' },
  { key: 'picked-up', label: 'Picked Up', icon: '📦' },
  { key: 'processing', label: 'Processing', icon: '♻️' },
  { key: 'completed', label: 'Completed', icon: '🎉' },
];

interface Booking {
  _id: string;
  fullName: string;
  userEmail: string;
  userId?: string;
  phone: string;
  recycleItem: string;
  recycleItemPrice: number;
  pickupDate: string;
  pickupTime: string;
  address: string;
  facility: string;
  status: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    notes?: string;
  }>;
  createdAt: string;
}

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const router = useRouter();

  const user = getUser();
  const userId = user?._id || user?.id;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = getToken();
        if (!token) {
          router.push("/sign-in");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        
        // Fetch all bookings and filter by user ID
        const res = await fetch("http://localhost:5000/api/bookings", { headers });
        const data = await res.json();
        
        // Filter bookings for this user
        const userBookings = data.filter((b: Booking) => 
          b.userEmail === user?.email || b.userId === userId
        );
        setBookings(userBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchBookings();
    } else {
      router.push("/sign-in");
    }
  }, [user, userId, router]);

  const getCurrentStepIndex = (status: string) => {
    return STATUS_STEPS.findIndex(step => step.key === status);
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'accepted':
      case 'scheduled':
      case 'out-for-pickup':
      case 'arrived':
      case 'verified':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">Track and manage your e-waste pickup requests</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <FiPackage className="text-6xl mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Yet</h2>
            <p className="text-gray-600 mb-6">You haven't made any e-waste pickup requests yet.</p>
            <Link 
              href="/recycle"
              className="inline-block bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Schedule a Pickup
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const currentStepIndex = getCurrentStepIndex(booking.status);
              
              return (
                <div key={booking._id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* Booking Header */}
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{booking.recycleItem}</h3>
                        <p className="text-white/80">Facility: {booking.facility}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status.toUpperCase()}
                        </span>
                        <p className="text-white/80 text-sm mt-1">ID: #{booking._id.slice(-6)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <FiCalendar className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-semibold">{booking.pickupDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <FiClock className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Time</p>
                          <p className="font-semibold">{booking.pickupTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <FiMapPin className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-semibold truncate">{booking.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Tracker */}
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-semibold mb-4">Pickup Progress</h4>
                      <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200">
                          <div 
                            className="w-full bg-green-500 transition-all duration-500"
                            style={{ 
                              height: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` 
                            }}
                          />
                        </div>

                        {/* Status Steps - Show only relevant steps */}
                        <div className="space-y-2">
                          {STATUS_STEPS.map((step, index) => {
                            const isCompleted = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            
                            // Only show current and previous steps, or completed ones
                            if (index > currentStepIndex + 2 && !isCompleted) return null;
                            
                            return (
                              <div 
                                key={step.key}
                                className={`flex items-center gap-4 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}
                              >
                                <div 
                                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 ${
                                    isCurrent 
                                      ? 'bg-green-500 text-white animate-pulse' 
                                      : isCompleted 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-gray-200 text-gray-500'
                                  }`}
                                >
                                  {step.icon}
                                </div>
                                <div className="flex-1">
                                  <p className={`font-semibold ${
                                    isCurrent ? 'text-green-600' : 'text-gray-700'
                                  }`}>
                                    {step.label}
                                  </p>
                                </div>
                                {isCompleted && !isCurrent && (
                                  <span className="text-green-500">✓</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Status History */}
                    {booking.statusHistory && booking.statusHistory.length > 0 && (
                      <div className="border-t mt-6 pt-6">
                        <h4 className="text-lg font-semibold mb-4">Status History</h4>
                        <div className="space-y-2">
                          {[...booking.statusHistory].reverse().map((history, index) => (
                            <div 
                              key={index}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <span className="text-xl">
                                {STATUS_STEPS.find(s => s.key === history.status)?.icon || '📌'}
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800">
                                  {STATUS_STEPS.find(s => s.key === history.status)?.label || history.status}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatDateTime(history.timestamp)}
                                </p>
                                {history.notes && (
                                  <p className="text-sm text-gray-600 mt-1">{history.notes}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View Details Button */}
                    <div className="border-t mt-6 pt-6">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-semibold"
                      >
                        <FiEye />
                        View Full Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-semibold">#{selectedBooking._id.slice(-6)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Item</p>
                  <p className="font-semibold">{selectedBooking.recycleItem}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-semibold text-green-600">₹{selectedBooking.recycleItemPrice}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Facility</p>
                  <p className="font-semibold">{selectedBooking.facility}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Pickup Date</p>
                  <p className="font-semibold">{selectedBooking.pickupDate}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Pickup Time</p>
                  <p className="font-semibold">{selectedBooking.pickupTime}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-semibold">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded col-span-1 md:col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold">{selectedBooking.address}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

