import express from "express";
import { createBooking, getBookings, updateBookingStatus, getBookingById, trackBooking } from "../controllers/bookingController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/track", trackBooking);
router.get("/:id", getBookingById);
router.put("/:id/status", authMiddleware, updateBookingStatus);

export default router;
