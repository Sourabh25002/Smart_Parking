require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth_route");
const parkingArea = require("./routes/parking_area_routes");
const sendMessage = require("./routes/otp_routes");
const Booking = require("./models/booking_schema");
const ParkingArea = require("./models/parking_area_model");
const User = require("./models/user_model");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Mount the login router
app.use("/auth", authRoute);
app.use("/parking", parkingArea);
app.use("/otp", sendMessage);

//Razorpay
app.post("/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

// app.post("/order/validate", async (req, res) => {
//   const {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     parkingAreaId,
//     userId,
//   } = req.body;

//   const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
//   sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
//   const digest = sha.digest("hex");
//   if (digest !== razorpay_signature) {
//     return res.status(400).json({ msg: "Transaction is not legit!" });
//   }

//   try {
//     // Find the parking area
//     const parkingArea = await ParkingArea.findById(parkingAreaId);
//     if (!parkingArea) {
//       return res.status(404).json({ msg: "Parking area not found" });
//     }

//     // Update parking area slots
//     parkingArea.occupiedSlots += 1;
//     parkingArea.availableSlots -= 1;
//     await parkingArea.save();

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Create new booking
//     const newBooking = new Booking({
//       user: userId,
//       parkingArea: parkingAreaId,
//       otp,
//       isConfirmed: true,
//       payment: true,
//     });
//     await newBooking.save();

//     res.json({
//       msg: "Success",
//       orderId: razorpay_order_id,
//       paymentId: razorpay_payment_id,
//       bookingId: newBooking._id,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Error");
//   }
// });

app.post("/order/validate", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    parkingAreaId,
    userId,
  } = req.body;

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not legit!" });
  }

  try {
    // Find the parking area
    const parkingArea = await ParkingArea.findById(parkingAreaId);
    if (!parkingArea) {
      return res.status(404).json({ msg: "Parking area not found" });
    }

    // Find a random vacant slot
    const vacantSlots = parkingArea.slots.filter(
      (slot) => slot.status === "vacant"
    );
    if (vacantSlots.length === 0) {
      return res.status(400).json({ msg: "No vacant slots available" });
    }

    const randomIndex = Math.floor(Math.random() * vacantSlots.length);
    const assignedSlot = vacantSlots[randomIndex];
    assignedSlot.status = "booked";

    // Update parking area slots
    parkingArea.occupiedSlots += 1;
    parkingArea.availableSlots -= 1;
    await parkingArea.save();

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create new booking
    const newBooking = new Booking({
      user: userId,
      parkingArea: parkingAreaId,
      slotNumber: assignedSlot.slotNumber,
      otp,
      isConfirmed: true,
      payment: true,
    });
    await newBooking.save();

    res.json({
      msg: "Success",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      bookingId: newBooking._id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

app.get("/bookings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ user: userId, isConfirmed: true })
      .populate("parkingArea")
      .exec();
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

// app.post("/order/validate", async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//     req.body;

//   const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
//   //order_id + "|" + razorpay_payment_id
//   sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
//   const digest = sha.digest("hex");
//   if (digest !== razorpay_signature) {
//     return res.status(400).json({ msg: "Transaction is not legit!" });
//   }

//   res.json({
//     msg: "success",
//     orderId: razorpay_order_id,
//     paymentId: razorpay_payment_id,
//   });
// });

app.post("/serial-data", (req, res) => {
  const data = req.body.data;
  console.log("Received data:", data);
  // You can add any additional processing here
  res.status(200).send("Data received");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
