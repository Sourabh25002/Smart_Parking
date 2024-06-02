const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const Booking = require("../models/booking_schema");
const ParkingArea = require("../models/parking_area_model");
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Send OTP for entry or exit
router.get("/send-message/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const otpType = req.query.type; // "entry" or "exit"

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Send OTP via Twilio
    const messageBody = `Your OTP for ${otpType} is: ${otp}`;
    await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.TWILIO_SEND_PHONE_NUMBER, // Replace with the recipient's phone number
    });

    // Store OTP in booking schema (assuming booking model is imported)
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    booking.otp = otp;
    await booking.save();

    res.status(200).json({ message: `OTP sent successfully for ${otpType}` });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP for entry or exit
router.post("/verify-otp/:otpType/:bookingId", async (req, res) => {
  try {
    const { otpType, bookingId } = req.params;
    const { otp } = req.body;

    // Fetch booking and verify OTP
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    if (booking.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // OTP verification successful
    if (otpType === "exit") {
      // Fetch the parking area
      const parkingArea = await ParkingArea.findById(booking.parkingArea);
      if (!parkingArea) {
        return res.status(404).json({ error: "Parking area not found" });
      }

      // Find the slot and update its status to vacant
      const slot = parkingArea.slots.find(
        (slot) => slot.slotNumber === booking.slotNumber
      );
      if (slot) {
        slot.status = "vacant";
      }

      // Update available and occupied slots count
      parkingArea.availableSlots += 1;
      parkingArea.occupiedSlots -= 1;

      // Save the updated parking area
      await parkingArea.save();

      // Delete the booking
      await Booking.findByIdAndDelete(bookingId);
      res.status(200).json({ message: "exitSuccess" });
    } else {
      res.status(200).json({ message: "entrySuccess" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

module.exports = router;
