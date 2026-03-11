import mongoose, { Schema, Document } from "mongoose";

export interface IBookingStatusHistory {
  status: string;
  timestamp: Date;
  notes?: string;
}

export interface IBooking extends Document {
  userId: string;
  fullName: string;
  userEmail: string;
  recycleItem: string;
  recycleItemPrice: number;
  pickupDate: string;
  pickupTime: string;
  address: string;
  phone: string;
  facility: string;
  status: 'pending' | 'accepted' | 'scheduled' | 'out-for-pickup' | 'arrived' | 'verified' | 'picked-up' | 'processing' | 'completed' | 'declined';
  statusHistory: IBookingStatusHistory[];
  // Timestamps for each status
  acceptedAt?: Date;
  scheduledAt?: Date;
  outForPickupAt?: Date;
  arrivedAt?: Date;
  verifiedAt?: Date;
  pickedUpAt?: Date;
  processingAt?: Date;
  completedAt?: Date;
  // Additional tracking info
  estimatedPickupTime?: string;
  actualPickupTime?: string;
  driverName?: string;
  driverPhone?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: { type: String, required: true },
    fullName: { type: String, required: true },
    userEmail: { type: String, required: true },
    recycleItem: { type: String, required: true },
    recycleItemPrice: { type: Number, required: true },
    pickupDate: { type: String, required: true },
    pickupTime: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    facility: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'scheduled', 'out-for-pickup', 'arrived', 'verified', 'picked-up', 'processing', 'completed', 'declined'], 
      default: 'pending' 
    },
    statusHistory: [{
      status: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      notes: { type: String }
    }],
    // Timestamps for each status
    acceptedAt: { type: Date },
    scheduledAt: { type: Date },
    outForPickupAt: { type: Date },
    arrivedAt: { type: Date },
    verifiedAt: { type: Date },
    pickedUpAt: { type: Date },
    processingAt: { type: Date },
    completedAt: { type: Date },
    // Additional tracking info
    estimatedPickupTime: { type: String },
    actualPickupTime: { type: String },
    driverName: { type: String },
    driverPhone: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

// Auto-update statusHistory when status changes
bookingSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

export default mongoose.model<IBooking>("Booking", bookingSchema);

