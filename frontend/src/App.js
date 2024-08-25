import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

import AdminPage from "./Pages/AdminPage";
import Header from "./Components/Header";
import EventPage from "./Pages/EventPage";
import CardMenu from "./Components/Admin/admin-main-menu";
import ViewEventTitle from "./Components/Admin/view-events-title";
import EventContainer from "./Components/Admin/view-events-container";
import CreateEvent from "./Components/Admin/create-event";
import FeedbackTitle from "./Components/Admin/feedback-title";
import FeedbackContainer from "./Components/Admin/feedback-container";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="" element={<EventPage />} />
          <Route path="events" element={<EventPage />} />
          <Route path="dashboard" element={<p>Dashboard Page</p>} />
          {/* <Route path="admin" element={<AdminPage />} /> */}
          {/* <Route path="admin" element={<CardMenu />}>
            <Route
              path="view-events"
              element={
                <>
                  <ViewEventTitle />
                  <EventContainer />
                </>
              }
            />
            <Route path="create-event" element={<CreateEvent />} />
            <Route
              path="view-feedbacks"
              element={
                <>
                  <FeedbackTitle />
                  <FeedbackContainer />
                </>
              }
            />
          </Route> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;