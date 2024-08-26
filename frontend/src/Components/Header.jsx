import React, { useState } from "react";
import UnknownImageAvatar from "../Assets/UnknownImageAvatar.jpeg";
import useStore from "./secureStore";
import { Link } from "react-router-dom";

function Header() {
  const role = useStore((state) => state.role);

  const imageUrl = useStore((state) => state.imageUrl);

  const [activeLink, setActiveLink] = useState("");

  const handleClick = (link) => {
    setActiveLink(link);
  };

  return (
    <header className="font-sans font-bold text-base flex w-full items-center justify-between bg-white bg-opacity-70 py-3 shadow-lg fixed top-0 pl-10 z-50">
      <div className="flex items-center px-3">
        <Link className="flex items-center" to="/">
          <img
            className="mr-4 h-18 w-18 rounded-full"
            src="https://zubinfoundation.org/wp-content/uploads/2022/07/TZF-logo-svg-img.svg"
            alt="Logo"
            style={{ height: "50px" }}
            loading="lazy"
          />
          <span className="text-black text-lg">The Zubin Foundation</span>
        </Link>
      </div>
      <nav className="flex justify-end items-center px-3 pr-10">
        <ol className="flex items-center space-x-4">
          <li>
            <Link
              to="/events"
              className={`px-4 py-2 rounded-md text-lg ${
                activeLink === "/events" ? "text-red" : "text-darkgrey"
              } hover:text-blue transition duration-150 ease-in-out`}
              onClick={() => handleClick("/events")}
            >
              Events
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-md text-lg ${
                activeLink === "/dashboard" ? "text-red" : "text-darkgrey"
              } hover:text-blue transition duration-150 ease-in-out`}
              onClick={() => handleClick("/dashboard")}
            >
              Dashboard
            </Link>
          </li>
          {role === "admin" && (
            <li>
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-md text-lg ${
                  activeLink === "/admin" ? "text-red" : "text-darkgrey"
                } hover:text-blue transition duration-150 ease-in-out`}
                onClick={() => handleClick("/admin")}
              >
                Admin
              </Link>
            </li>
          )}

          <li>
            <Link
              to="/profile"
              className={`px-4 py-2 rounded-md flex items-center justify-center ${
                activeLink === "/profile" ? "text-red" : "text-white"
              } hover:text-customBlue transition duration-150 ease-in-out`}
              onClick={() => handleClick("/profile")}
            >
              <img
                src={imageUrl}
                className="h-9 w-9 rounded-full"
                alt="User Avatar"
                loading="lazy"
              />
            </Link>
          </li>
        </ol>
      </nav>
    </header>
  );
}

export default Header;
