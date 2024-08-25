import React from "react";
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
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<p>Events Page</p>} />
          <Route path="/dashboard" element={<p>Dashboard Page</p>} />
          <Route path="/admin" element={<p>Admin Page</p>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
