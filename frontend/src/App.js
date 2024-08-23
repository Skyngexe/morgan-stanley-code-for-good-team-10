import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

import EventPage from "./pages/events_page";

function App() {
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
          <Route path="/" element={<EventPage/>} />
          <Route path="/dashboard" element={<p>Dashboard Page</p>} />
          <Route path="/admin" element={<p>Admin Page</p>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
