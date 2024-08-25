import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import AdminPage from "./Pages/AdminPage";
import Header from "./Components/Header";
import EventPage from "./Pages/EventPage";
import LoginPage from "./Pages/LoginPage";
import CreateAccountPage from "./Pages/CreateAccountPage";

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

  if (data.message === "User not found") {
    return <CreateAccountPage />;
  } else if (data.message !== "User found") {
    return <div>Server Error</div>;
  }
  setRole(data.user.role);
  console.log("role:", data.user.role);

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="" element={<EventPage />} />
          <Route path="events" element={<EventPage />} />
          <Route path="dashboard" element={<p>Dashboard Page</p>} />
          <Route path="admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
