// import mongoose from "mongoose";

// const BookingSchema = new mongoose.Schema({
//   userId: String,
//   userEmail: String,
//   fullName: String,
//   recycleItem: String,
//   recycleItemPrice: Number,
//   pickupDate: String,
//   pickupTime: String,
//   address: String,
//   phone: String,
//   facility: String,
//   createdAt: { type: Date, default: Date.now },
// }, { collection: "E-Waygo" }); // explicitly set collection to match Atlas

// export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  userId: String,
  userEmail: String,
  fullName: String,
  recycleItem: String,
  recycleItemPrice: Number,
  pickupDate: String,
  pickupTime: String,
  address: String,
  phone: String,
  facility: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
