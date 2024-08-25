import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import AdminPage from "./Pages/AdminPage";
import Header from "./Components/Header";
import EventPage from "./Pages/EventPage";
import Dashboard from "./Pages/Dashboard";
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
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="" element={<EventPage />} />
          <Route path="events" element={<EventPage />} />
          <Route path="dashboard" element={<Dashboard Page />} />
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
