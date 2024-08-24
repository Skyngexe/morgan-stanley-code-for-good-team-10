import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  SignIn,
} from "@clerk/clerk-react";

import AdminPage from "./Pages/AdminPage";
import Header from "./Components/Header";
import EventPage from "./Pages/EventPage";
import LoginPage from "./Pages/LoginPage";
import CreateAccountPage from "./Pages/CreateAccountPage";

import useStore from "./Components/secureStore";

function App() {
  const email = useStore((state) => state.email);
  const imageUrl = useStore((state) => state.imageUrl);
  const accountCreated = useStore((state) => state.accountCreated);

  const SignedIn = ({ children }) => {
    if (email && accountCreated) {
      return <>{children}</>;
    }
    return null;
  };

  const CreateAccount = ({ children }) => {
    if (email && !accountCreated) {
      return <>{children}</>;
    }
    return null;
  };

  const SignedOut = ({ children }) => {
    if (!email) {
      return <>{children}</>;
    }
    return null;
  };

  return (
    <header>
      <SignedOut>
        <LoginPage />
      </SignedOut>
      <CreateAccount>
        <CreateAccountPage />
      </CreateAccount>
      <SignedIn>
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
      </SignedIn>
    </header>
  );
}

export default App;
