"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

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

interface BookingStatus {
  _id: string;
  recycleItem: string;
  status: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    notes?: string;
  }>;
  pickupDate: string;
  pickupTime: string;
  estimatedPickupTime?: string;
  actualPickupTime?: string;
  driverName?: string;
  driverPhone?: string;
  facility: string;
  createdAt: string;
  acceptedAt?: string;
  scheduledAt?: string;
  inTransitAt?: string;
  pickedUpAt?: string;
  processingAt?: string;
  completedAt?: string;
}

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const [bookingId, setBookingId] = useState('');
  const [booking, setBooking] = useState<BookingStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const fetchBooking = async (id?: string) => {
    const bookingIdToUse = id || bookingId;
    if (!bookingIdToUse) {
      setError('Please enter a booking ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = email 
        ? `/api/bookings/track?bookingId=${bookingIdToUse}&email=${encodeURIComponent(email)}`
        : `/api/bookings/track?bookingId=${bookingIdToUse}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setBooking(data);
      } else {
        setError(data.message || 'Booking not found');
      }
    } catch (err) {
      setError('Failed to fetch booking. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams?.get('id') || '';
    if (id) {
      setBookingId(id);
      fetchBooking(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooking();
  };

  const getCurrentStepIndex = () => {
    if (!booking) return -1;
    return STATUS_STEPS.findIndex(step => step.key === booking.status);
  };

  const getStatusTimestamp = (statusKey: string) => {
    if (!booking) return null;
    
    const timestampMap: { [key: string]: string | undefined } = {
      'pending': booking.createdAt,
      'accepted': booking.acceptedAt,
      'scheduled': booking.scheduledAt,
      'out-for-pickup': (booking as any).outForPickupAt,
      'arrived': (booking as any).arrivedAt,
      'verified': (booking as any).verifiedAt,
      'picked-up': booking.pickedUpAt,
      'processing': booking.processingAt,
      'completed': booking.completedAt,
    };
    
    return timestampMap[statusKey];
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

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Track Your Request</h1>
          <p className="text-gray-600">Enter your booking ID to track your e-waste pickup</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking ID *
                </label>
                <input
                  type="text"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  placeholder="Enter your booking ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Optional for verification)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Searching...' : 'Track Request'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Tracking Results */}
        {booking && (
          <div className="space-y-6">
            {/* Booking Details Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'declined' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-semibold">#{booking._id.slice(-6)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Item</p>
                  <p className="font-semibold">{booking.recycleItem}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Scheduled Date</p>
                  <p className="font-semibold">{booking.pickupDate} at {booking.pickupTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Facility</p>
                  <p className="font-semibold">{booking.facility}</p>
                </div>
                {booking.estimatedPickupTime && (
                  <div>
                    <p className="text-sm text-gray-500">Estimated Pickup</p>
                    <p className="font-semibold">{booking.estimatedPickupTime}</p>
                  </div>
                )}
                {booking.driverName && (
                  <div>
                    <p className="text-sm text-gray-500">Driver</p>
                    <p className="font-semibold">{booking.driverName} {booking.driverPhone && `(${booking.driverPhone})`}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Pickup Progress</h2>
              
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200">
                  <div 
                    className="w-full bg-green-500 transition-all duration-500"
                    style={{ 
                      height: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` 
                    }}
                  />
                </div>

                {/* Status Steps */}
                <div className="space-y-4">
                  {STATUS_STEPS.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const timestamp = getStatusTimestamp(step.key);
                    
                    return (
                      <div 
                        key={step.key}
                        className={`flex items-center gap-4 ${
                          isCompleted ? 'opacity-100' : 'opacity-40'
                        }`}
                      >
                        <div 
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl z-10 ${
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
                          {timestamp && (
                            <p className="text-sm text-gray-500">
                              {formatDateTime(timestamp)}
                            </p>
                          )}
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
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Status History</h2>
                
                <div className="space-y-3">
                  {[...booking.statusHistory].reverse().map((history, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-xl">
                        {STATUS_STEPS.find(s => s.key === history.status)?.icon || '📌'}
                      </span>
                      <div>
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

            {/* Actions */}
            <div className="flex gap-4">
              <Link 
                href="/"
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-green-700 transition-colors"
              >
                Go to Home
              </Link>
              <button 
                onClick={() => {
                  setBooking(null);
                  setBookingId('');
                  setError('');
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Track Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

