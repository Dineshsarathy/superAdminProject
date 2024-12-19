import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export default function Header({ toggleSidebar }) {
  const [isOpened, setIsOpened] = useState(true);

  // Toggle Profile Dropdown
  const toggleProfile = () => {
    setIsOpened(!isOpened);
  };

  // Logout Function
  const Logout = async () => {
    try {
      const token = sessionStorage.getItem("token"); // Assuming the JWT is stored in sessionStorage
      if (!token) {
        alert("You are not logged in");
        return;
      }

      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // On successful logout
        localStorage.removeItem("token"); // Clear the token
        alert("Logged out successfully");
        window.location.href = "/login"; // Redirect to login page
      } else {
        const errorData = await response.json();
        alert(`Logout failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error during logout:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="header">
        <div className="menu-side">
          <div>
            <Icon
              icon="ci:menu-alt-03"
              style={{ fontSize: "38px" }}
              onClick={toggleSidebar}
            />
          </div>
        </div>
        <div className="profiles">
          <input className="search" type="search" placeholder="Search..." />
          <span>
            <Icon
              className="bell"
              icon="gridicons:bell"
              style={{ fontSize: "28px" }}
            />
          </span>
          <div className="admin-log" onClick={toggleProfile}>
            <span>
              <img
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                }}
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1522&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="header"
              />
            </span>{" "}
            <span>Scarlet Jhonson</span>
          </div>
        </div>
        <div className={`group-focus ${isOpened ? "group-hidden" : "group-focus"}`}>
          <Link className="focus" onClick={Logout} >
            <span>Logout</span>
            <Icon
              className="bell"
              icon="teenyicons:logout-outline"
              style={{ fontSize: "20px" }}
            />
          </Link>
        </div>
      </div>
    </>
  );
}
