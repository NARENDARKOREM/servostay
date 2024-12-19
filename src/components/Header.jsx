import React, { useState, useEffect, useRef } from "react";
import { NotificationIcon, ProfileIcon } from "./Icons";
import { FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { generateToken, messaging } from "../Notification/firebase";
import { onMessage } from "firebase/messaging";
import toast, { Toaster } from "react-hot-toast";
import api from "../utils/api";

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  console.log(notificationCount)
  const [showNotifications, setShowNotifications] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isHovered) {
        setShowCard(true);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isHovered]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isHovered) {
        setShowCard(false);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isHovered]);


  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      const newNotifications = response.data;

      // Update state with new notifications
      setNotifications(newNotifications);
      setNotificationCount(newNotifications.length);

      // Display the most recent notification using react-hot-toast
      if (newNotifications.length > 0) {
        const latestNotification = newNotifications[0];
        toast((t) => (
          <div>
            <strong>{latestNotification.title}</strong>
            <p>{latestNotification.message}</p>
          </div>
        ), {
          duration: 10000,
          position: "top-right",
        });
        console.log(notificationCount)
        setNotificationCount(newNotifications.length);
        console.log(notificationCount)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks outside
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const logout = async () => {
    setLoading(true);
    try {
      await api.post(
        `/admin/logout`,
        {},
      );
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error during logout:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigation = (data) => {
    if (data === "profile") {
      navigate("/profile");
    } else if (data === "settings") {
      navigate("/settings");
    }
  };


  const handleNotificationClick = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      await fetchNotifications();
      setNotificationCount(0);
    }
  };

  useEffect(() => {
    // Generate FCM token for the device
    generateToken();

    // Listen for foreground notifications
    onMessage(messaging, (payload) => {
      console.log("Foreground notification received:", payload);
      const { title, body } = payload.notification;

      // Show notification using react-hot-toast
      toast((t) => (
        <div>
          <strong>{title}</strong>
          <p>{body}</p>
        </div>
      ), {
        duration: 10000,
        position: "top-right",
      });
      setNotifications((prev) => [
        { title, message: body },
        ...prev,
      ]);
    });
  }, []);



  return (
    <div className="bg-white h-[65px] sm:h-[80px] px-4 py-4 sm:px-6 flex items-center justify-between relative">
  

  {loading && (
    <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-100 z-50">
      <span className="loader"></span>
    </div>
  )}

  {/* Title Section */}
  <div className="flex items-center gap-2.5">
    <span className="text-lg sm:text-2xl font-bold">Dashboard</span>
  </div>
  <div>
    <Toaster position="top-right" />
  </div>
  {/* Icons Section */}
  <div className="flex items-center gap-2">
    {/* Notification Icon */}
    <div className="relative">
      <div
        className="bg-[#f7fbff] rounded-full w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center cursor-pointer"
        onClick={handleNotificationClick}
      >
        <NotificationIcon />
      </div>

      {showNotifications && (
        <div
          ref={notificationRef}
          className="absolute top-12 right-0 w-[220px] bg-white border border-gray-300 rounded-lg shadow-lg z-10 transition-all duration-300"
        >
          {isPopupVisible && (
            <div className="notification-popup">
              <p>{notifications[0]?.message}</p>
            </div>
          )}
        </div>
      )}
    </div>

    {/* Profile Icon with Smooth Hover Card */}
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-[#f7fbff] rounded-full w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center cursor-pointer">
        <ProfileIcon />
      </div>

      {showCard && (
        <div
          className="absolute top-12 right-0 w-[220px] bg-white border border-gray-300 rounded-lg shadow-lg z-10 transition-all duration-300"
        >
          <ul className="py-2 divide-y divide-gray-200">
            <li
              className="px-4 py-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                navigation("profile");
              }}

            >
              <FaUser className="text-gray-500" /> <span>Account</span>
            </li>
            <li
              className="px-4 py-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer"
              onClick={logout}
            >
              <FaSignOutAlt className="text-gray-500" /> <span>Logout</span>
            </li>
            <li
              className="px-4 py-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                navigation("settings");
              }}
            >
              <FaCog className="text-gray-500" /> <span>Settings</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  </div>
</div>

  );
};

export default Header;