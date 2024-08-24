import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useQuery } from "react-query";

import AdminPage from "./Pages/AdminPage";
import Header from "./Components/Header";
import EventPage from "./Pages/EventPage";
import LoginPage from "./Pages/LoginPage";
import CreateAccountPage from "./Pages/CreateAccountPage";

import useStore from "./Components/secureStore";

function App() {
  const googleId = useStore((state) => state.googleId);

  const { data, isLoading, error } = useQuery(["user", googleId], () =>
    axios
      .get(`http://127.0.0.1:5000/read/user/${googleId}`)
      .then((res) => res.data)
      .catch((error) => {
        console.error("Error fetching data:", error);
        return <div>Server Error</div>;
      }),
      {
        enabled: !!googleId, // Only run the query if googleId is available
      }
  );

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

  // const email = useStore((state) => state.email);
  // const imageUrl = useStore((state) => state.imageUrl);
  // const accountCreated = useStore((state) => state.accountCreated);

  // const SignedOut = ({ children }) => {
  //   if (!email) {
  //     return <>{children}</>;
  //   }
  //   return null;
  // };

  // const CreateAccount = ({ children }) => {
  //   if (email && !accountCreated) {
  //     return <>{children}</>;
  //   }
  //   return null;
  // };

  // const SignedIn = ({ children }) => {
  //   if (email && accountCreated) {
  //     return <>{children}</>;
  //   }
  //   return null;
  // };

  return (
    // <header>
    //   <SignedOut>
    //     <LoginPage />
    //   </SignedOut>
    //   <CreateAccount>
    //     <CreateAccountPage />
    //   </CreateAccount>
    //   <SignedIn>
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<EventPage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/dashboard" element={<p>Dashboard Page</p>} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
    //   </SignedIn>
    // </header>
  );
}

export default App;
