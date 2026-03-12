"use client";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { getToken, getRole, getUser, handleLogout } from "../sign-in/auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Admin = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [ewasteCenters, setEwasteCenters] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Add Recycle Center form state
  const [addCenterForm, setAddCenterForm] = useState({
    fullname: "",
    email: "",
    password: "",
    phoneNumber: "",
    facility: ""
  });
  const [showAddCenterForm, setShowAddCenterForm] = useState(false);
  const [isAddingCenter, setIsAddingCenter] = useState(false);

  const router = useRouter();
  
  const user = getUser();
  const facility = user?.facility;

  useEffect(() => {
    // Check authentication and authorization
    const token = getToken();
    const role = getRole();

    if (!token) {
      setError("You must be logged in to access this page.");
      setLoading(false);
      return;
    }

    if (role !== "admin" && role !== "ewaste_center") {
      setError("You do not have permission to access this page. Admin or E-Waste Center access required.");
      setLoading(false);
      return;
    }
    
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // For admin: fetch users, ewaste centers, all bookings, and messages
        if (role === "admin") {
          const usersRes = await fetch("http://localhost:5000/api/auth/users", { headers });
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            setUsers(usersData);
          }

          const ewasteRes = await fetch("http://localhost:5000/api/auth/users?role=ewaste_center", { headers });
          if (ewasteRes.ok) {
            const ewasteData = await ewasteRes.json();
            setEwasteCenters(ewasteData);
          }

          const bookingsRes = await fetch("http://localhost:5000/api/bookings", { headers });
          if (bookingsRes.ok) {
            const bookingsData = await bookingsRes.json();
            setBookings(bookingsData);
          }

          // Fetch contact messages
          const messagesRes = await fetch("/api/contact");
          if (messagesRes.ok) {
            const messagesData = await messagesRes.json();
            if (messagesData.success) {
              setMessages(messagesData.data);
            }
          }
        } 
        // For ewaste_center: fetch only their facility's bookings
        else if (role === "ewaste_center") {
          const bookingsRes = await fetch("http://localhost:5000/api/bookings", { headers });
          if (bookingsRes.ok) {
            const bookingsData = await bookingsRes.json();
            // Filter bookings for this facility
            const facilityBookings = bookingsData.filter((b: any) => b.facility === facility);
            setBookings(facilityBookings);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please ensure the backend server is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [facility]);

  const handleLogoutAndRedirect = () => {
    handleLogout();
    router.push("/sign-in");
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = getToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings((prev: any) =>
          prev.map((b: any) => (b._id === id ? { ...b, status } : b))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loader-container">
            <div className="loader"></div>
          </div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-error mb-4">Access Denied</h2>
          <p className="text-lg mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/")}
              className="btn btn-secondary"
            >
              Go Home
            </button>
            <button
              onClick={handleLogoutAndRedirect}
              className="btn btn-primary"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  const role = getRole();

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {role === "admin" ? "Admin Dashboard" : `E-Waste Center Dashboard - ${facility}`}
        </h1>

        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        
        {/* Admin Stats Cards */}
        {role === "admin" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-emerald-600">Total Users</h3>
              <p className="text-3xl font-bold mt-2">{users.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-emerald-600">E-Waste Centers</h3>
              <p className="text-3xl font-bold mt-2">{ewasteCenters.length}</p>
              <button
                onClick={() => router.push("/admin/add-center")}
                className="mt-2 bg-emerald-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-emerald-700 transition-colors w-full"
              >
                + Add Center
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-emerald-600">Total Bookings</h3>
              <p className="text-3xl font-bold mt-2">{bookings.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-emerald-600">Messages</h3>
              <p className="text-3xl font-bold mt-2">{messages.length}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Admin: All Users */}
          {role === "admin" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">All Users</h2>
              {users.length === 0 ? (
                <p className="text-gray-500">No users found</p>
              ) : (
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                  {users.map((user) => (
                    <li key={user._id} className="border-b pb-2">
                      <p className="font-medium">{user.fullname}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">{user.role}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Admin: E-Waste Centers */}
          {role === "admin" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">E-Waste Centers</h2>
              {ewasteCenters.length === 0 ? (
                <p className="text-gray-500">No e-waste centers found</p>
              ) : (
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                  {ewasteCenters.map((center) => (
                    <li key={center._id} className="border-b pb-2">
                      <p className="font-medium">{center.fullname}</p>
                      <p className="text-sm text-gray-600">{center.email}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Admin: Messages */}
          {role === "admin" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Messages</h2>
              {messages.length === 0 ? (
                <p className="text-gray-500">No messages found</p>
              ) : (
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                  {messages.map((msg) => (
                    <li key={msg._id} className="border-b pb-2">
                      <p className="font-medium">{msg.name}</p>
                      <p className="text-sm text-gray-600">{msg.email}</p>
                      <p className="text-sm text-gray-600">{msg.phone}</p>
                      <p className="text-sm mt-1">{msg.message}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* All Roles: Bookings - Enlarged with more details */}
          <div className={`bg-white p-6 rounded-lg shadow-md ${role === "admin" ? "col-span-3" : "col-span-3"}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                {role === "admin" ? "All Bookings - Admin Logs" : "Booking Requests"}
              </h2>
              {role === "admin" && (
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
                  🔒 VIEW ONLY - Admin Logs
                </span>
              )}
            </div>
            {bookings.length === 0 ? (
              <p className="text-gray-500">No bookings found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-3 text-sm font-semibold">Name</th>
                      <th className="p-3 text-sm font-semibold">Email</th>
                      <th className="p-3 text-sm font-semibold">Item</th>
                      <th className="p-3 text-sm font-semibold">Price</th>
                      <th className="p-3 text-sm font-semibold">Phone</th>
                      <th className="p-3 text-sm font-semibold">Address</th>
                      <th className="p-3 text-sm font-semibold">Facility</th>
                      <th className="p-3 text-sm font-semibold">Pickup Date</th>
                      <th className="p-3 text-sm font-semibold">Pickup Time</th>
                      <th className="p-3 text-sm font-semibold">Status</th>
                      <th className="p-3 text-sm font-semibold">Created</th>
                      <th className="p-3 text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">{booking.fullName}</td>
                        <td className="p-3 text-sm">{booking.userEmail}</td>
                        <td className="p-3 text-sm">{booking.recycleItem}</td>
                        <td className="p-3 text-sm">₹{booking.recycleItemPrice}</td>
                        <td className="p-3 text-sm">{booking.phone}</td>
                        <td className="p-3 text-sm max-w-xs truncate">{booking.address}</td>
                        <td className="p-3 text-sm">{booking.facility}</td>
                        <td className="p-3 text-sm">{booking.pickupDate}</td>
                        <td className="p-3 text-sm">{booking.pickupTime}</td>
                        <td className="p-3 text-sm">
                          <span className={`text-xs px-2 py-1 rounded ${
                            booking.status === 'completed' ? 'bg-green-200' : 
                            booking.status === 'pending' ? 'bg-yellow-200' : 
                            booking.status === 'accepted' ? 'bg-blue-200' :
                            booking.status === 'declined' ? 'bg-red-200' : 'bg-gray-200'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-sm">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="text-blue-600 hover:text-blue-800 mr-2"
                          >
                            View
                          </button>
                          {role === "ewaste_center" && booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateStatus(booking._id, 'accepted')}
                                className="text-green-600 hover:text-green-800 mr-2"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => updateStatus(booking._id, 'declined')}
                                className="text-red-600 hover:text-red-800"
                              >
                                Decline
                              </button>
                            </>
                          )}
                          {/* Admin role has VIEW ONLY access - no action buttons */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

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
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-semibold">{selectedBooking.fullName}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{selectedBooking.userEmail}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold">{selectedBooking.phone}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Recycle Item</p>
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
                <div className="p-4 bg-gray-50 rounded col-span-1 md:col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold">{selectedBooking.address}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    selectedBooking.status === 'completed' ? 'bg-green-200' : 
                    selectedBooking.status === 'pending' ? 'bg-yellow-200' : 
                    selectedBooking.status === 'accepted' ? 'bg-blue-200' :
                    selectedBooking.status === 'declined' ? 'bg-red-200' : 'bg-gray-200'
                  }`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-semibold">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-4 justify-end">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Close
                </button>
                {role === "ewaste_center" && selectedBooking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        updateStatus(selectedBooking._id, 'accepted');
                        setSelectedBooking(null);
                      }}
                      className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        updateStatus(selectedBooking._id, 'declined');
                        setSelectedBooking(null);
                      }}
                      className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Decline
                    </button>
                  </>
                )}
                {/* Admin role has VIEW ONLY access - no action buttons in modal */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

