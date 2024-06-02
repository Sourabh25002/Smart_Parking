const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the slot schema
const slotSchema = new Schema({
  slotNumber: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["vacant", "booked", "occupied"],
    default: "vacant",
    required: true,
  },
});

const parkingAreaSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    totalSlots: {
      type: Number,
      required: true,
    },
    availableSlots: {
      type: Number,
      required: true,
    },
    occupiedSlots: {
      type: Number,
      required: true,
    },
    slots: {
      type: [slotSchema],
      default: function () {
        // Initialize slots based on totalSlots
        const slotsArray = [];
        for (let i = 1; i <= this.totalSlots; i++) {
          slotsArray.push({ slotNumber: i, status: "vacant" });
        }
        return slotsArray;
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ParkingArea", parkingAreaSchema);
