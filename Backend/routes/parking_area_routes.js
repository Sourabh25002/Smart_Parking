const express = require("express");
const router = express.Router();
const ParkingArea = require("../models/parking_area_model");

// POST route to add parking area data
router.post("/parking-areas", async (req, res) => {
  try {
    // Extract data from request body
    const { name, location, totalSlots } = req.body;

    // Create a new parking area document
    const newParkingArea = new ParkingArea({
      name,
      location,
      totalSlots,
      availableSlots: totalSlots, // Initialize available slots with total slots
      occupiedSlots: 0, // Initialize occupied slots as 0
    });

    // Save the new parking area document to the database
    await newParkingArea.save();

    // Send "Parking area created" response
    res
      .status(201)
      .json({ message: "Parking area created", parkingArea: newParkingArea });
  } catch (error) {
    console.error("Error during parking area creation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET route to fetch all parking areas
router.get("/parking-areas", async (req, res) => {
  try {
    // Retrieve all parking areas from the database
    const parkingAreas = await ParkingArea.find();

    // Send the parking areas as the response
    res.status(200).json(parkingAreas);
  } catch (error) {
    console.error("Error fetching parking areas:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get details of a specific parking area by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const parkingArea = await ParkingArea.findById(id);

    if (!parkingArea) {
      return res.status(404).json({ message: "Parking Area not found" });
    }

    res.status(200).json(parkingArea);
  } catch (error) {
    console.error("Error fetching parking area:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
