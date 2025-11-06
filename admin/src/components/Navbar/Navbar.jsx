import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="navbar">
      <img className="logo" src={assets.pizzaLogo} alt="" />

      <div className="navbar-profile">
        <div className="profile-wrapper">
          <img className="profile" src={assets.profile_image} alt="Profile" />
          <span className="dropdown-icon"></span>
        </div>

        <ul className="nav-profile-dropdown">
          <li onClick={logout}>
            <p>Logout</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
