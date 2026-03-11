import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { bookingId, email } = req.query;

  if (!bookingId) {
    return res.status(400).json({ message: "Booking ID is required" });
  }

  try {
    // Call the backend API
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const response = await fetch(
      `${backendUrl}/api/bookings/track?bookingId=${bookingId}${email ? `&email=${email}` : ""}`
    );

    const data = await response.json();

    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error("Track booking API error:", error);
    res.status(500).json({ message: "Failed to fetch booking" });
  }
}

