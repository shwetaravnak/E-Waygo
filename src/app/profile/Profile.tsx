"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { getEmail, getPhoneNumber, getUserID, getUserName, getfullname, getRole, getUser } from '../sign-in/auth';
import { useDarkMode } from '../utils/DarkModeContext';
import Image from 'next/image';
import { FaUser, FaEnvelope, FaPhone, FaRecycle, FaBuilding, FaCheckCircle, FaClock, FaMoneyBillWave } from 'react-icons/fa';

const Profile = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [fullname, setFullname] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [facility, setFacility] = useState<string>('');
  const [bookings, setBookings] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    setUsername(getUserName());
    setEmail(getEmail());
    setFullname(getfullname());
    setPhone(getPhoneNumber());
    setRole(getRole());
    const user = getUser();
    setFacility(user?.facility || '');
  }, []);

  useEffect(() => {
    const userId = getUserID();
    if (!userId) return;
    
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        setError('');
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).token : null;
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
        
        const res = await fetch('http://localhost:5000/api/bookings', { headers });
        if (!res.ok) throw new Error('Failed to load bookings');
        const data = await res.json();
        
        // For e-waste center, show bookings for their facility
        // For regular users, show their own bookings
        let userBookings;
        if (role === 'ewaste_center') {
          userBookings = Array.isArray(data) ? data.filter((b) => b?.facility === facility) : [];
        } else {
          userBookings = Array.isArray(data) ? data.filter((b) => b?.userId === userId) : [];
        }
        setBookings(userBookings);
      } catch (e: any) {
        setError(e?.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [role, facility]);

  const stats = useMemo(() => {
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b?.status === 'completed').length;
    const pendingBookings = bookings.filter(b => b?.status === 'pending').length;
    const acceptedBookings = bookings.filter(b => b?.status === 'accepted').length;
    const totalValue = bookings.reduce((sum, b) => sum + (Number(b?.recycleItemPrice) || 0), 0);
    const lastBookingDate = bookings
      .map((b) => new Date(b?.createdAt || b?.pickupDate))
      .filter((d) => !isNaN(d.getTime()))
      .sort((a, b) => b.getTime() - a.getTime())[0];
    return {
      totalBookings,
      completedBookings,
      pendingBookings,
      acceptedBookings,
      totalValue,
      lastBookingDate: lastBookingDate ? lastBookingDate.toLocaleDateString() : '-'
    };
  }, [bookings]);

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      accepted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      declined: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`min-h-screen p-12 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Profile Header Card */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className={`rounded-3xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`h-64 ${role === 'ewaste_center' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}></div>
          <div className="px-16 pb-16">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-24 mb-10">
              <div className="relative">
                <div className={`w-56 h-56 rounded-full overflow-hidden border-8 ${isDarkMode ? 'border-gray-800' : 'border-white'} shadow-2xl`}>
                  {role === 'ewaste_center' ? (
                    <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-emerald-900' : 'bg-emerald-100'}`}>
                      <FaBuilding className="text-7xl text-emerald-500" />
                    </div>
                  ) : (
                    <Image
                      className="w-full h-full object-cover"
                      src="https://avatars.githubusercontent.com/u/52039279?v=4"
                      alt="User"
                      width={100}
                      height={100}
                      unoptimized
                    />
                  )}
                </div>
              </div>
              <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left">
                <h2 className={`text-5xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{username}</h2>
                <span className={`inline-block mt-4 px-6 py-2 rounded-full text-lg font-medium ${
                  role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                  role === 'ewaste_center' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {role === 'ewaste_center' ? '♻️ E-Waste Center' : role === 'admin' ? '👑 Admin' : '👤 User'}
                </span>
              </div>
            </div>
            
            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center gap-4`}>
                <div className={`p-4 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-white'} shadow-lg`}>
                  <FaUser className="text-2xl text-emerald-500" />
                </div>
                <div>
                  <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Full Name</p>
                  <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{fullname || '-'}</p>
                </div>
              </div>
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center gap-4`}>
                <div className={`p-4 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-white'} shadow-lg`}>
                  <FaEnvelope className="text-2xl text-blue-500" />
                </div>
                <div>
                  <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                  <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{email || '-'}</p>
                </div>
              </div>
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center gap-4`}>
                <div className={`p-4 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-white'} shadow-lg`}>
                  <FaPhone className="text-2xl text-purple-500" />
                </div>
                <div>
                  <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</p>
                  <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{phone || '-'}</p>
                </div>
              </div>
              {role === 'ewaste_center' && (
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center gap-4`}>
                  <div className={`p-4 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-white'} shadow-lg`}>
                    <FaBuilding className="text-2xl text-emerald-500" />
                  </div>
                  <div>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Facility</p>
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{facility || '-'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto mb-10">
        <h3 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {role === 'ewaste_center' ? '📊 Facility Dashboard' : '♻️ Recycle Activity'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className={`rounded-2xl p-8 shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <FaRecycle className="text-4xl text-emerald-500" />
            </div>
            <p className={`text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.totalBookings}</p>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Requests</p>
          </div>
          <div className={`rounded-2xl p-8 shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <FaClock className="text-4xl text-yellow-500" />
            </div>
            <p className={`text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.pendingBookings}</p>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pending</p>
          </div>
          <div className={`rounded-2xl p-8 shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <FaCheckCircle className="text-4xl text-green-500" />
            </div>
            <p className={`text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.completedBookings}</p>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Completed</p>
          </div>
          <div className={`rounded-2xl p-8 shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <FaMoneyBillWave className="text-4xl text-blue-500" />
            </div>
            <p className={`text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{stats.totalValue}</p>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Value</p>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="max-w-6xl mx-auto">
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`p-8 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} flex items-center justify-between`}>
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {role === 'ewaste_center' ? '📋 Booking Requests' : '📋 Recent Bookings'}
            </h3>
            {isLoading && <span className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading...</span>}
            {error && <span className="text-lg text-red-500">{error}</span>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-8 py-6 text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Item</th>
                  {role === 'ewaste_center' && (
                    <th className={`px-8 py-6 text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Customer</th>
                  )}
                  <th className={`px-8 py-6 text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Facility</th>
                  <th className={`px-8 py-6 text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pickup Date</th>
                  <th className={`px-8 py-6 text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Time</th>
                  <th className={`px-8 py-6 text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Price</th>
                  <th className={`px-8 py-6 text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                {bookings.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={role === 'ewaste_center' ? 7 : 6} className={`px-8 py-16 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <div className="flex flex-col items-center">
                        <FaRecycle className="text-6xl mb-4 opacity-50" />
                        <p className="text-xl">No recycle bookings yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bookings
                    .slice()
                    .sort((a, b) => new Date(b?.createdAt || b?.pickupDate).getTime() - new Date(a?.createdAt || a?.pickupDate).getTime())
                    .slice(0, 10)
                    .map((b, idx) => (
                      <tr key={b?._id || idx} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                        <td className={`px-8 py-6 text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{b?.recycleItem}</td>
                        {role === 'ewaste_center' && (
                          <td className={`px-8 py-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <div>
                              <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{b?.fullName}</p>
                              <p className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{b?.userEmail}</p>
                            </div>
                          </td>
                        )}
                        <td className={`px-8 py-6 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{b?.facility}</td>
                        <td className={`px-8 py-6 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{b?.pickupDate}</td>
                        <td className={`px-8 py-6 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{b?.pickupTime}</td>
                        <td className={`px-8 py-6 text-lg font-bold text-emerald-500`}>₹{b?.recycleItemPrice}</td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-2 rounded-full text-base font-medium ${getStatusBadge(b?.status)}`}>
                            {b?.status}
                          </span>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

