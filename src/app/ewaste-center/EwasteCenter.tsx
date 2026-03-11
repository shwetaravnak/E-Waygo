"use client";
import React, { useEffect, useState } from "react";
import { getToken, getUser } from "../sign-in/auth";

const EwasteCenter = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getUser();
  const facility = user?.facility;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };
        const res = await fetch("http://localhost:5000/api/bookings", { headers });
        const data = await res.json();
        const facilityBookings = data.filter((b: any) => b.facility === facility);
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">E-Waste Center Dashboard - {facility}</h1>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Booking Requests</h2>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <ul>
            {bookings.map((booking: any) => (
              <li key={booking._id} className="mb-4 p-4 border rounded">
                <p><strong>Name:</strong> {booking.fullName}</p>
                <p><strong>Email:</strong> {booking.userEmail}</p>
                <p><strong>Item:</strong> {booking.recycleItem}</p>
                <p><strong>Price:</strong> ₹{booking.recycleItemPrice}</p>
                <p><strong>Date:</strong> {booking.pickupDate}</p>
                <p><strong>Time:</strong> {booking.pickupTime}</p>
                <p><strong>Address:</strong> {booking.address}</p>
                <p><strong>Status:</strong> {booking.status}</p>
                {booking.status === 'pending' && (
                  <div className="mt-2">
                    <button
                      onClick={() => updateStatus(booking._id, 'accepted')}
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(booking._id, 'declined')}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EwasteCenter;