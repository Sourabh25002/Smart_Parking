import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./Bookings.css";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [otpInput, setOtpInput] = useState("");
  const [showEnterOtpInput, setShowEnterOtpInput] = useState(false);
  const [showExitOtpInput, setShowExitOtpInput] = useState(false);
  const [enterOtpError, setEnterOtpError] = useState("");
  const [exitOtpError, setExitOtpError] = useState("");
  const { userId } = useParams();

  useEffect(() => {
    // Fetch user's active bookings
    const userIdFromCookie = Cookies.get("userId");
    if (userIdFromCookie) {
      fetchBookings(userIdFromCookie);
    }
  }, []);

  const fetchBookings = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/bookings/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const sendOtp = async (bookingId, otpType) => {
    try {
      const response = await fetch(
        `http://localhost:3000/otp/send-message/${bookingId}?type=${otpType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to send OTP for ${otpType}`);
      }
      if (otpType === "entry") {
        setShowEnterOtpInput(true);
        setShowExitOtpInput(false);
      } else if (otpType === "exit") {
        setShowExitOtpInput(true);
        setShowEnterOtpInput(false);
      }
      setEnterOtpError("");
      setExitOtpError("");
    } catch (error) {
      console.error(`Error sending OTP for ${otpType}:`, error);
      if (otpType === "entry") {
        setEnterOtpError(`Failed to send OTP for ${otpType}`);
      } else if (otpType === "exit") {
        setExitOtpError(`Failed to send OTP for ${otpType}`);
      }
    }
  };

  const handleOtpSubmit = async (bookingId, otpType) => {
    try {
      const response = await fetch(
        `http://localhost:3000/otp/verify-otp/${otpType}/${bookingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp: otpInput }),
        }
      );
      if (!response.ok) {
        throw new Error(`Invalid OTP for ${otpType}`);
      }
      // OTP verification successful
      setOtpInput("");
      if (otpType === "entry") {
        setShowEnterOtpInput(false);
        setEnterOtpError("");
      } else if (otpType === "exit") {
        setShowExitOtpInput(false);
        setExitOtpError("");
        // If exit OTP verification is successful, remove the booking
        const updatedBookings = bookings.filter(
          (booking) => booking._id !== bookingId
        );
        setBookings(updatedBookings);
      }
    } catch (error) {
      console.error(`Error verifying OTP for ${otpType}:`, error);
      if (otpType === "entry") {
        setEnterOtpError(`Invalid OTP for ${otpType}`);
      } else if (otpType === "exit") {
        setExitOtpError(`Invalid OTP for ${otpType}`);
      }
    }
  };

  return (
    <div className="bookings-container">
      <h2>My Bookings</h2>
      <Link to="/home" className="link-button">
        Go to Home
      </Link>
      {bookings.length > 0 ? (
        <ul className="booking-list">
          {bookings.map((booking) => (
            <li key={booking._id} className="booking-item">
              <div>Parking Area: {booking.parkingArea.name}</div>
              <div>
                Booking Day:{" "}
                {new Date(booking.bookingTime).toLocaleString("en-US", {
                  timeZone: "Asia/Kolkata", // Specify the IST timezone
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  // hour: "numeric",
                  // minute: "numeric",
                  // second: "numeric",
                  // hour12: true,
                })}
              </div>
              <div>Slot Number: {booking.slotNumber}</div>
              <div>Status: {booking.isConfirmed ? "Confirmed" : "Pending"}</div>
              {booking.isConfirmed && (
                <div>
                  <button onClick={() => sendOtp(booking._id, "entry")}>
                    Send OTP to Enter
                  </button>
                  {showEnterOtpInput && (
                    <div>
                      <input
                        type="text"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                      />
                      <button
                        onClick={() => handleOtpSubmit(booking._id, "entry")}
                      >
                        Submit OTP for Enter
                      </button>
                      {enterOtpError && (
                        <p className="error-message">{enterOtpError}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              {booking.isConfirmed && (
                <div>
                  <button onClick={() => sendOtp(booking._id, "exit")}>
                    Send OTP to Exit
                  </button>
                  {showExitOtpInput && (
                    <div>
                      <input
                        type="text"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                      />
                      <button
                        onClick={() => handleOtpSubmit(booking._id, "exit")}
                      >
                        Submit OTP for Exit
                      </button>
                      {exitOtpError && (
                        <p className="error-message">{exitOtpError}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default Bookings;
