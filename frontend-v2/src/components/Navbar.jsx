import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  logout,
  getCurrentUser,
  getMonthlyTotalNotification,
} from "../services/Api";
import "../css/Navbar.css";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notification, setNotification] = useState(null);
  const [notificationRead, setNotificationRead] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkNotification = async () => {
      const today = new Date();
      console.log("Checking notification, current date:", today);
      if (true) {
        // (today.getDate() === 1)
        console.log("It's the first day of the month, fetching notification");
        try {
          if (localStorage.getItem("token")) {
            const total = await getMonthlyTotalNotification();
            console.log("Received total:", total);
            setNotification(`Total spent last month: ${total.toFixed(2)}`);
            setNotificationRead(false);
          } else {
            console.log("User not authenticated, skipping notification fetch");
          }
        } catch (error) {
          console.error("Failed to fetch notification:", error);
          if (error.response && error.response.status === 403) {
            console.log("Authentication error, redirecting to login");
            navigate("/login");
          }
        }
      } else {
        console.log("Not the first day of the month, no notification needed");
      }
    };

    checkNotification();
    const interval = setInterval(checkNotification, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/landing");
  };

  const getUserInitial = () => {
    const username = getCurrentUser();
    return username ? username.charAt(0).toUpperCase() : "";
  };

  const handleNotificationClick = () => {
    setNotificationRead(true);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">SnackTrack</div>
      <div className="navbar-right">
        <div className="notification-bell" onClick={handleNotificationClick}>
          {notification && !notificationRead && (
            <div className="notification-popup">{notification}</div>
          )}
          <i className="fas fa-bell"></i>
        </div>
        <div className="profile-section">
          <div
            className="profile-circle"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {getUserInitial()}
          </div>
          {showDropdown && (
            <div className="dropdown">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
