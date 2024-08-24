import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";


import AdminPage from "./Pages/AdminPage";
import Header from "./Components/Header";
import EventPage from "./Pages/EventPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/" element={<EventPage/>} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/dashboard" element={<p>Dashboard Page</p>} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
