import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import AdminPage from "./Pages/AdminPage";
import Header from "./Components/Header";
import EventPage from "./Pages/EventPage";
import ChatBot from "./Components/Chatbot/ChatBot";
import LoginPage from "./Pages/LoginPage";
import CreateAccountPage from "./Pages/CreateAccountPage";
import ProfilePage from "./Pages/ProfilePage";

import CardMenu from "./Components/Admin/admin-main-menu";
import ViewEventTitle from "./Components/Admin/view-events-title";
import EventContainer from "./Components/Admin/view-events-container";
import CreateEvent from "./Components/Admin/create-event";
import FeedbackTitle from "./Components/Admin/feedback-title";
import FeedbackContainer from "./Components/Admin/feedback-container";

import useStore from "./Components/secureStore";

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
        "http://127.0.0.1:5000/send-promotional-message",
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
      const response = await fetch("http://127.0.0.1:5000/schedule-reminders", {
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
        "http://127.0.0.1:5000/send-thank-you-message",
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
      const response = await fetch("http://127.0.0.1:5000/cancel-event", {
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
  const googleId = useStore((state) => state.googleId);
  const setRole = useStore((state) => state.setRole);

  const { data, isLoading, error } = useQuery({
    queryKey: ["user", googleId],
    queryFn: () =>
      axios
        .get(`http://127.0.0.1:5000/read/user/${googleId}`)
        .then((res) => res.data)
        .catch((error) => {
          console.error("Error fetching data:", error);
          return { message: "Server Error" };
        }),
    enabled: !!googleId,
  });

  if (!googleId) {
    return <LoginPage />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(data.message);
  if (data.message === "User not found") {
    return <CreateAccountPage />;
  } else if (data.message !== "User found") {
    return <div>Server Error: {data.message}</div>;
  }
  setRole(data.user.role);
  console.log("role:", data.user.role);

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <div className="mt-32">
                <p>Events Page</p>
                {/* Button to send promotional messages */}
                <button
                  onClick={() => handleSendMessage("66ca8e75279d9d6dc4dab70b")} // Replace with actual event ID
                  className="mt-4 p-2 bg-blue text-white rounded"
                >
                  Send Promo Message and Schedule Reminder
                </button>
                <button
                  onClick={() => handleFeedback("66ca8e75279d9d6dc4dab70a")} // Replace with actual event ID
                  className="mt-4 p-2 bg-blue text-white rounded"
                >
                  Ask Feedback{" "}
                </button>
                <button
                  onClick={() => handleCancel("66ca8e75279d9d6dc4dab70a")} // Replace with actual event ID
                  className="mt-4 mx-8 p-2 bg-blue text-white rounded"
                >
                  Cancel
                </button>
              </div>
            }
          />
          <Route path="/chatbot" element={<ChatBot />} />
          {/* <Route path="" element={<EventPage />} /> */}
          <Route path="events" element={<EventPage />} />
          <Route path="dashboard" element={<p>Dashboard Page</p>} />
          {/* <Route path="admin" element={<AdminPage />} /> */}
          <Route path="admin">
            <Route path="" element={<CardMenu />} />
            <Route path="create-event" element={<CreateEvent />} />
            <Route
              path="view-events"
              element={
                <>
                  <ViewEventTitle />
                  <EventContainer />
                </>
              }
            />
            <Route
              path="view-feedbacks"
              element={
                <>
                  {/* <FeedbackTitle /> */}
                  <FeedbackContainer />
                </>
              }
            />
          </Route>
          <Route path="profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
