import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import bookingRoutes from "./routes/bookings";
import facilityRoutes from "./routes/facility";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/facility", facilityRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
