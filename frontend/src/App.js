// import React from "react";
// import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
// import logo from "./logo.svg";
// import "./App.css";

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <nav>
//           <ul className="flex gap-x-4 underline">
//             <li>
//               <Link to="/">Events</Link>
//             </li>
//             <li>
//               <Link to="/dashboard">Dashboard</Link>
//             </li>
//             <li>
//               <Link to="/admin">Admin</Link>
//             </li>
//           </ul>
//         </nav>
//         <Routes>
//           <Route path="/" element={<p>Events Page</p>} />
//           <Route path="/dashboard" element={<p>Dashboard Page</p>} />
//           <Route path="/admin" element={<p>Admin Page</p>} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

function App() {
  // Function to send promotional message
  // const sendPromotionalMessage = async () => {
  //   // Define the data payload to send to the backend
  //   const payload = {
  //     //   chatId: "example_chat_id", // Replace with actual chat ID or get it dynamically
  //     //   urlFile: "https://example.com/image.png", // Example image URL
  //     //   fileName: "promo.png", // Example file name
  //     //   caption: "Check out our latest event!", // Promotional message
  //     //   category: "zubnin", // Replace with actual category if needed
  //     // };
  //     // {
  //     // chatId: "85291420560@c.us",
  //     urlFile:
  //       "https://avatars.mds.yandex.net/get-pdb/477388/77f64197-87d2-42cf-9305-14f49c65f1da/s375",
  //     fileName: "horse.png",
  //     caption: "little horse",
  //     category: "Climate",
  //   };

  //   try {
  //     // Make a POST request to the Flask backend
  //     const response = await fetch(
  //       "http://localhost:5000/send-promotional-message",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload), // Convert JavaScript object to JSON string
  //       }
  //     );

  //     // Handle the response from the backend
  //     if (response.ok) {
  //       const result = await response.json();
  //       alert("Promotional messages sent successfully!");
  //       console.log(result);
  //     } else {
  //       alert("Failed to send promotional messages.");
  //       console.error("Error:", response.statusText);
  //     }
  //   } catch (error) {
  //     // Handle any network or other errors
  //     console.error("Error sending promotional message:", error);
  //     alert("An error occurred while sending promotional messages.");
  //   }
  // };
  const sendPromotionalMessage = async (eventId) => {
    try {
      // Make a POST request to the Flask backend with the event ID
      const response = await fetch(
        "http://localhost:5000/send-promotional-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eventId }), // Send event ID to the backend
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert("Promotional message sent successfully!");
        console.log(result);
      } else {
        alert("Failed to send promotional message.");
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending promotional message:", error);
      alert("An error occurred while sending the promotional message.");
    }
  };

  const scheduleReminder = async (eventId) => {
    try {
      // Make a POST request to the Flask backend with the event ID
      const response = await fetch("http://localhost:5000/schedule-reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }), // Send event ID to the backend
      });

      if (response.ok) {
        const result = await response.json();
        alert("Schedule Reminders sent successfully!");
        console.log(result);
      } else {
        alert("Failed to schedule message.");
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error scheduling reminder :", error);
      alert("An error occurred while scheduling the reminder.");
    }
  };

  const sendthankyou = async (eventId) => {
    try {
      // Make a POST request to the Flask backend with the event ID
      const response = await fetch(
        "http://localhost:5000/send-thank-you-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eventId }), // Send event ID to the backend
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert("Send Feedback  successfully!");
        console.log(result);
      } else {
        alert("Failed to schedule message.");
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending feedback :", error);
      alert("An error occurred while sending the feedback.");
    }
  };

  const cancelevent = async (eventId) => {
    try {
      // Make a POST request to the Flask backend with the event ID
      const response = await fetch("http://localhost:5000/cancel-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }), // Send event ID to the backend
      });

      if (response.ok) {
        const result = await response.json();
        alert("Cancel successful!");
        console.log(result);
      } else {
        alert("Error Cancelling");
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Cancel error :", error);
      alert("Cancel.");
    }
  };
  // // Example button click handler
  const handleSendMessage = (eventId) => {
    sendPromotionalMessage(eventId);
    scheduleReminder(eventId);
  };

  const handleFeedback = (eventId) => {
    sendthankyou(eventId);
  };

  const handleCancel = (eventId) => {
    cancelevent(eventId);
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <ul className="flex gap-x-4 underline">
            <li>
              <Link to="/">Events</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin">Admin</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <p>Events Page</p>
                {/* Button to send promotional messages */}
                <button
                  onClick={() => handleSendMessage("66ca8e75279d9d6dc4dab70b")} // Replace with actual event ID
                  className="mt-4 p-2 bg-blue-500 text-white rounded"
                >
                  Send Promo Message and Schedule Reminder
                </button>
                <button
                  onClick={() => handleFeedback("66ca8e75279d9d6dc4dab70a")} // Replace with actual event ID
                  className="mt-4 p-2 bg-blue-500 text-white rounded"
                >
                  Ask Feedback{" "}
                </button>
                <button
                  onClick={() => handleCancel("66ca8e75279d9d6dc4dab70a")} // Replace with actual event ID
                  className="mt-4 mx-8 p-2 bg-blue-500 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            }
          />
          <Route path="/dashboard" element={<p>Dashboard Page</p>} />
          <Route path="/admin" element={<p>Admin Page</p>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
