import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./Home.css";

// Component to fetch and select parking areas
const ParkingAreaSelect = ({ setSelectedAreaDetails }) => {
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [parkingAreas, setParkingAreas] = useState([]);

  useEffect(() => {
    // Fetch parking areas from backend
    fetchParkingAreas();
  }, []);

  const fetchParkingAreas = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/parking/parking-areas"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch parking areas");
      }
      const data = await response.json();
      setParkingAreas(data);
    } catch (error) {
      console.error("Error fetching parking areas:", error);
    }
  };

  const handleAreaChange = async (event) => {
    const areaId = event.target.value;
    setSelectedAreaId(areaId);
    if (areaId) {
      try {
        const response = await fetch(`http://localhost:3000/parking/${areaId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch parking area details");
        }
        const data = await response.json();
        setSelectedAreaDetails(data);
      } catch (error) {
        console.error("Error fetching parking area details:", error);
      }
    } else {
      setSelectedAreaDetails(null);
    }
  };

  return (
    <div className="parking-area">
      <h2>Parking Areas</h2>
      <select value={selectedAreaId} onChange={handleAreaChange}>
        <option value="">Select Parking Area</option>
        {parkingAreas.map((area) => (
          <option key={area._id} value={area._id}>
            {area.name}
          </option>
        ))}
      </select>
    </div>
  );
};

// Component to display details of the selected parking area
// const ParkingAreaDetails = ({ areaDetails }) => {
//   const amount = 5000; // Amount in paise (50 INR)
//   const currency = "INR";
//   const receiptId = `receipt_${Math.random().toString(36).substring(7)}`;

//   const paymentHandler = async (e) => {
//     e.preventDefault();

//     const userId = Cookies.get("userId");
//     const userName = Cookies.get("userName");
//     const userEmail = Cookies.get("userEmail");
//     const userContact = Cookies.get("userContact");

//     const response = await fetch("http://localhost:3000/order", {
//       method: "POST",
//       body: JSON.stringify({
//         amount,
//         currency,
//         receipt: receiptId,
//       }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     const order = await response.json();
//     console.log(order);

//     var options = {
//       key: "rzp_test_AipZnGibLARSO5", // Enter the Key ID generated from the Dashboard
//       amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
//       currency,
//       name: "Smart Parking System", // your business name
//       description: "Parking Slot Booking",
//       image: "https://example.com/your_logo",
//       order_id: order.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
//       handler: async function (response) {
//         const body = {
//           ...response,
//           parkingAreaId: areaDetails._id,
//           userId,
//         };

//         const validateRes = await fetch(
//           "http://localhost:3000/order/validate",
//           {
//             method: "POST",
//             body: JSON.stringify(body),
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const jsonRes = await validateRes.json();
//         console.log(jsonRes);
//         // Handle success logic here, e.g., navigate to a success page or show a success message
//       },
//       prefill: {
//         name: userName || "John Doe", // your customer's name
//         email: userEmail || "john.doe@example.com",
//         contact: userContact || "9000000000", // Provide the customer's phone number for better conversion rates
//       },
//       notes: {
//         address: "Customer's address",
//       },
//       theme: {
//         color: "#3399cc",
//       },
//     };
//     var rzp1 = new window.Razorpay(options);
//     rzp1.on("payment.failed", function (response) {
//       alert(response.error.code);
//       alert(response.error.description);
//       alert(response.error.source);
//       alert(response.error.step);
//       alert(response.error.reason);
//       alert(response.error.metadata.order_id);
//       alert(response.error.metadata.payment_id);
//     });
//     rzp1.open();
//   };

//   return (
//     <div className="area-details">
//       <h3>Details for {areaDetails.name}</h3>
//       <p>Location: {areaDetails.location}</p>
//       <p>Total Slots: {areaDetails.totalSlots}</p>
//       <p>Available Slots: {areaDetails.availableSlots}</p>
//       <p>Occupied Slots: {areaDetails.occupiedSlots}</p>
//       {areaDetails.availableSlots > 0 && (
//         <button onClick={paymentHandler}>Book Slot</button>
//       )}
//     </div>
//   );
// };

const ParkingAreaDetails = ({ areaDetails }) => {
  const amount = 5000; // Amount in paise (50 INR)
  const currency = "INR";
  const receiptId = `receipt_${Math.random().toString(36).substring(7)}`;

  const paymentHandler = async (e) => {
    e.preventDefault();

    const userId = Cookies.get("userId");
    const userName = Cookies.get("userName");
    const userEmail = Cookies.get("userEmail");
    const userContact = Cookies.get("userContact");

    const response = await fetch("http://localhost:3000/order", {
      method: "POST",
      body: JSON.stringify({
        amount,
        currency,
        receipt: receiptId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const order = await response.json();
    console.log(order);

    var options = {
      key: "rzp_test_AipZnGibLARSO5", // Enter the Key ID generated from the Dashboard
      amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency,
      name: "Smart Parking System", // your business name
      description: "Parking Slot Booking",
      image: "https://example.com/your_logo",
      order_id: order.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        const body = {
          ...response,
          parkingAreaId: areaDetails._id,
          userId,
        };

        const validateRes = await fetch(
          "http://localhost:3000/order/validate",
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonRes = await validateRes.json();
        console.log(jsonRes);
        // Handle success logic here, e.g., navigate to a success page or show a success message
      },
      prefill: {
        name: userName || "John Doe", // your customer's name
        email: userEmail || "john.doe@example.com",
        contact: userContact || "9000000000", // Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Customer's address",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
  };

  return (
    <div className="area-details">
      <h3>Details for {areaDetails.name}</h3>
      <p>Location: {areaDetails.location}</p>
      <p>Total Slots: {areaDetails.totalSlots}</p>
      <p>Available Slots: {areaDetails.availableSlots}</p>
      <p>Occupied Slots: {areaDetails.occupiedSlots}</p>

      <h4>Slots:</h4>
      <div className="slots-container">
        {areaDetails.slots.map((slot) => (
          <div key={slot.slotNumber} className={`slot ${slot.status}`}>
            <p>Slot Number: {slot.slotNumber}</p>
            <p>Status: {slot.status}</p>
          </div>
        ))}
      </div>

      {areaDetails.availableSlots > 0 && (
        <button className="book-slot-button" onClick={paymentHandler}>
          Book Slot
        </button>
      )}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [selectedAreaDetails, setSelectedAreaDetails] = useState(null);

  const handleExit = () => {
    // Clear cookies
    Cookies.remove("userId");
    Cookies.remove("userName");
    Cookies.remove("userEmail");
    Cookies.remove("userPhone");
    navigate("/login");
  };

  const handleViewBookings = () => {
    const userId = Cookies.get("userId");
    navigate(`/bookings`);
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-left">Smart Parking System</div>
        <button className="exit-button" onClick={handleExit}>
          Exit
        </button>
      </nav>
      <div className="slideshow-container">
        <div className="slideshow">
          <div className="slide fade">
            <img
              src="https://images.unsplash.com/photo-1562426509-5044a121aa49?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FyJTIwcGFya2luZ3xlbnwwfHwwfHx8MA%3D%3D"
              alt="Slide 1"
            />
          </div>
          <div className="slide fade">
            <img
              src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNhciUyMHBhcmtpbmd8ZW58MHx8MHx8fDA%3D"
              alt="Slide 2"
            />
          </div>
          <div className="slide fade">
            <img
              src="https://images.unsplash.com/photo-1597173874497-2546ef685f43?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGNhciUyMHBhcmtpbmd8ZW58MHx8MHx8fDA%3D"
              alt="Slide 3"
            />
          </div>
        </div>
      </div>
      <ParkingAreaSelect setSelectedAreaDetails={setSelectedAreaDetails} />
      {selectedAreaDetails && (
        <ParkingAreaDetails areaDetails={selectedAreaDetails} />
      )}
      <button className="view-bookings-button" onClick={handleViewBookings}>
        View My Bookings
      </button>
    </div>
  );
};

export default Home;
