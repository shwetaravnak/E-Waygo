import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error("Please define MONGODB_URI in .env.local");

// Global cache to prevent multiple connections in dev mode
declare global {
  var mongooseConnection: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
}

if (!global.mongooseConnection) global.mongooseConnection = { conn: null, promise: null };

export default async function dbConnect(): Promise<Mongoose> {
  if (global.mongooseConnection.conn) return global.mongooseConnection.conn;
  if (!global.mongooseConnection.promise) {
    global.mongooseConnection.promise = mongoose.connect(MONGODB_URI, {
      dbName: "ewaygo",
    }).then((m) => {
      console.log("✅ MongoDB Connected");
      return m;
    });
  }
  global.mongooseConnection.conn = await global.mongooseConnection.promise;
  return global.mongooseConnection.conn;
}
