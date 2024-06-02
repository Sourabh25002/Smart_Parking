const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the convertUTCToIST function
function convertUTCToIST(date) {
  // Create a new Date object from the passed UTC date
  const utcDate = new Date(date);

  // Get the UTC time in milliseconds and add the offset for IST (5 hours 30 minutes)
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
  const istDate = new Date(utcDate.getTime() + istOffset);

  return istDate;
}

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parkingArea: {
      type: Schema.Types.ObjectId,
      ref: "ParkingArea",
      required: true,
    },
    slotNumber: {
      type: Number,
      required: true,
    },
    bookingTime: {
      type: Date,
      default: () => convertUTCToIST(new Date()),
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    payment: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
