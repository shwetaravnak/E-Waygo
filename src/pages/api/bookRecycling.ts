import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/booking";
import nodemailer from "nodemailer";
import { facility as facilities } from "@/app/data/facility";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const {
    userId,
    userEmail,
    fullName,
    recycleItem,
    recycleItemPrice,
    pickupDate,
    pickupTime,
    address,
    phone,
    facility,
  } = req.body;

  try {
    await dbConnect();

    // 1️⃣ Save booking to MongoDB
    const booking = await Booking.create({
      userId,
      userEmail,
      fullName,
      recycleItem,
      recycleItemPrice,
      pickupDate,
      pickupTime,
      address,
      phone,
      facility,
    });

    // Setup transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter and credentials
    await transporter.verify().catch((err) => {
      console.error("Nodemailer transporter failed to verify:", err);
      throw new Error("Mail transporter not configured correctly: " + err.message);
    });

    // User confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `✅ Your E-Waste Pickup Booking`,
      text: `
Hi ${fullName},

Your booking for ${recycleItem} has been received.

Details:
- Price: ₹${recycleItemPrice}
- Date: ${pickupDate}
- Time: ${pickupTime}
- Facility: ${facility}
- Address: ${address}

Thank you for recycling responsibly! 🌱
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error("Failed to send confirmation email to user:", userEmail, err);
    }

    // Facility confirmation (if email available)
    const selectedFacility = facilities.find(f => f.name === facility);
    if (selectedFacility && selectedFacility.email) {
      const facilityMailOptions = {
        from: process.env.EMAIL_USER,
        to: selectedFacility.email,
        subject: `New Booking Scheduled at Your E-Waste Facility`,
        text: `
Dear ${facility} Center,

You have a new e-waste pickup booking:
- Name: ${fullName}
- Email: ${userEmail}
- Item: ${recycleItem}
- Price: ₹${recycleItemPrice}
- Date: ${pickupDate}
- Time: ${pickupTime}
- Address: ${address}
- User Phone: ${phone}

Please prepare to assist.
        `,
      };
      try {
        await transporter.sendMail(facilityMailOptions);
      } catch (err) {
        console.error("Failed to send confirmation email to facility:", selectedFacility.email, err);
      }
    } else {
      console.warn("No matching facility email found for:", facility);
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("Booking API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ success: false, error: errorMessage });
  }
}
