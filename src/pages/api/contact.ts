import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import ContactMessage from "@/models/contact";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const messages = await ContactMessage.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: messages });
    } catch (error: any) {
      console.error("Contact API error:", error);
      return res.status(500).json({ success: false, message: error.message || "Server error" });
    }
  }

  if (req.method === "POST") {
    const { name, email, phone, message } = req.body || {};

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
      const saved = await ContactMessage.create({ name, email, phone, message });
      return res.status(200).json({ success: true, message: "Saved", data: saved });
    } catch (error: any) {
      console.error("Contact API error:", error);
      return res.status(500).json({ success: false, message: error.message || "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}


