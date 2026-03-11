import { Request, Response } from "express";
import Booking from "../models/Booking";
import nodemailer from "nodemailer";
import { getFacilityEmailByName } from "../data/facilities";

// Valid status transitions
const VALID_STATUSES = ['pending', 'accepted', 'scheduled', 'out-for-pickup', 'arrived', 'verified', 'picked-up', 'processing', 'completed', 'declined'];

const getStatusTimestampField = (status: string): string | null => {
  const statusMap: { [key: string]: string } = {
    'accepted': 'acceptedAt',
    'scheduled': 'scheduledAt',
    'out-for-pickup': 'outForPickupAt',
    'arrived': 'arrivedAt',
    'verified': 'verifiedAt',
    'picked-up': 'pickedUpAt',
    'processing': 'processingAt',
    'completed': 'completedAt'
  };
  return statusMap[status] || null;
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const booking = new Booking({
      ...req.body,
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        notes: 'Booking created'
      }]
    });
    
    const savedBooking = await booking.save();
    const bookingId = (savedBooking._id as any).toString();

    // Configure mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter
    try {
      await transporter.verify();
    } catch (verifyErr) {
      console.error("Mail transporter verification failed:", verifyErr);
    }

    const {
      userEmail,
      fullName,
      recycleItem,
      recycleItemPrice,
      pickupDate,
      pickupTime,
      address,
      phone,
      facility,
    } = req.body as {
      userEmail: string;
      fullName: string;
      recycleItem: string;
      recycleItemPrice: number;
      pickupDate: string;
      pickupTime: string;
      address: string;
      phone: string;
      facility: string;
    };

    // Send confirmation to user
    if (userEmail) {
      const userMail = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "✅ Your E-Waste Pickup Booking - #" + bookingId.slice(-6),
        text: `Hi ${fullName},

Your booking for ${recycleItem} has been received!

Booking Details:
- Booking ID: #${bookingId.slice(-6)}
- Item: ${recycleItem}
- Price: ₹${recycleItemPrice}
- Date: ${pickupDate}
- Time: ${pickupTime}
- Facility: ${facility}
- Address: ${address}

Status: PENDING

Track your request at: /track-request

Thank you for recycling responsibly! 🌱`,
      };
      transporter
        .sendMail(userMail)
        .catch((err) => console.error("Failed to email user:", userEmail, err));
    }

    // Send notification to facility
    const facilityEmail = getFacilityEmailByName(facility);
    if (facilityEmail) {
      const facilityMail = {
        from: process.env.EMAIL_USER,
        to: facilityEmail,
        subject: "New Booking Scheduled at Your E-Waste Facility",
        text: `Dear ${facility} Center,

You have a new e-waste pickup booking:

Booking ID: #${bookingId.slice(-6)}
- Name: ${fullName}
- Email: ${userEmail}
- Item: ${recycleItem}
- Price: ₹${recycleItemPrice}
- Date: ${pickupDate}
- Time: ${pickupTime}
- Address: ${address}
- User Phone: ${phone}

Please prepare to assist.`,
      };
      transporter
        .sendMail(facilityMail)
        .catch((err) =>
          console.error("Failed to email facility:", facilityEmail, err)
        );
    } else {
      console.warn("Facility email not found for:", facility);
    }

    res.status(201).json(savedBooking);
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Booking failed" });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Get bookings failed" });
  }
};

// Get booking by ID for tracking
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ error: "Get booking failed" });
  }
};

// Get bookings by user ID
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Get user bookings failed" });
  }
};

// Update booking status with timestamp
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes, estimatedPickupTime, driverName, driverPhone } = req.body;
    
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // Update status
    booking.status = status;
    
    // Add to status history
    booking.statusHistory.push({
      status,
      timestamp: new Date(),
      notes: notes || `Status changed to ${status}`
    });
    
    // Set timestamp for the status
    const timestampField = getStatusTimestampField(status);
    if (timestampField) {
      (booking as any)[timestampField] = new Date();
    }
    
    // Update additional fields if provided
    if (estimatedPickupTime) {
      booking.estimatedPickupTime = estimatedPickupTime;
    }
    if (driverName) {
      booking.driverName = driverName;
    }
    if (driverPhone) {
      booking.driverPhone = driverPhone;
    }
    if (notes) {
      booking.notes = notes;
    }
    
    const updatedBooking = await booking.save();
    
    // Send status update email to user
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      
      const statusMessages: { [key: string]: string } = {
        'accepted': 'Your booking has been accepted by the facility!',
        'scheduled': 'Your pickup has been scheduled!',
        'out-for-pickup': 'The pickup team is on the way to your location!',
        'arrived': 'The pickup team has arrived at your location!',
        'verified': 'Your e-waste item has been verified and weighed!',
        'picked-up': 'Your e-waste has been picked up!',
        'processing': 'Your e-waste is being processed at the facility!',
        'completed': 'Your recycling request has been completed! Thank you!',
        'declined': 'Unfortunately, your booking was declined.'
      };
      
      const bookingIdStr = (booking._id as any).toString();
      const userMail = {
        from: process.env.EMAIL_USER,
        to: booking.userEmail,
        subject: `📦 E-Waste Booking Update - #${bookingIdStr.slice(-6)} - ${status.toUpperCase()}`,
        text: `Hi ${booking.fullName},

${statusMessages[status] || 'Your booking status has been updated.'}

Booking Details:
- Booking ID: #${bookingIdStr.slice(-6)}
- Item: ${booking.recycleItem}
- Status: ${status.toUpperCase()}
${booking.estimatedPickupTime ? `- Estimated Pickup: ${booking.estimatedPickupTime}` : ''}
${booking.driverName ? `- Driver: ${booking.driverName}` : ''}
${booking.notes ? `\nNotes: ${booking.notes}` : ''}

Track your request at: /track-request

Thank you for using E-Waygo! 🌱`,
      };
      
      await transporter.sendMail(userMail);
    } catch (emailErr) {
      console.error("Failed to send status update email:", emailErr);
    }
    
    res.status(200).json(updatedBooking);
  } catch (err) {
    console.error("Update booking error:", err);
    res.status(500).json({ error: "Update booking failed" });
  }
};

// Get facility bookings
export const getFacilityBookings = async (req: Request, res: Response) => {
  try {
    const { facility } = req.query;
    const bookings = await Booking.find({ facility }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Get facility bookings failed" });
  }
};

// Track booking status (public endpoint for users)
export const trackBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId, email } = req.query;
    
    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }
    
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // If email provided, verify ownership
    if (email && booking.userEmail !== email) {
      return res.status(403).json({ message: "Invalid booking ID or email" });
    }
    
    // Return tracking info (limited fields for privacy)
    const trackingInfo = {
      _id: booking._id,
      recycleItem: booking.recycleItem,
      status: booking.status,
      statusHistory: booking.statusHistory,
      pickupDate: booking.pickupDate,
      pickupTime: booking.pickupTime,
      estimatedPickupTime: booking.estimatedPickupTime,
      actualPickupTime: booking.actualPickupTime,
      driverName: booking.driverName,
      driverPhone: booking.driverPhone,
      facility: booking.facility,
      createdAt: booking.createdAt,
      acceptedAt: booking.acceptedAt,
      scheduledAt: booking.scheduledAt,
      outForPickupAt: booking.outForPickupAt,
      arrivedAt: booking.arrivedAt,
      verifiedAt: booking.verifiedAt,
      pickedUpAt: booking.pickedUpAt,
      processingAt: booking.processingAt,
      completedAt: booking.completedAt,
    };
    
    res.status(200).json(trackingInfo);
  } catch (err) {
    console.error("Track booking error:", err);
    res.status(500).json({ error: "Track booking failed" });
  }
};

