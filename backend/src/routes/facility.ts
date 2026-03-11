import express from "express";
const router = express.Router();

// Example static facilities data
const facilities = [
  {
    name: "Eco Facility 1",
    capacity: "Large",
    lon: 72.85,
    lat: 19.07,
    contact: "1234567890",
    time: "9am to 5pm",
    verified: true,
  },
  {
    name: "Eco Facility 2",
    capacity: "Medium",
    lon: 72.99,
    lat: 19.15,
    contact: "0987654321",
    time: "10am to 6pm",
    verified: false,
  },
];

router.get("/", (req, res) => {
  res.json(facilities);
});

export default router;
