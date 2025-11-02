import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/category" className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Categories</p>
        </NavLink>
      </div>

      <div className="sidebar-options">
        <NavLink to="/add" className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Item</p>
        </NavLink>
      </div>

      <div className="sidebar-options">
        <NavLink to="/list" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Items List</p>
        </NavLink>
      </div>

      <div className="sidebar-options">
        <NavLink to="/offer" className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Offer</p>
        </NavLink>
      </div>

      <div className="sidebar-options">
        <NavLink to="/offerList" className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Offers List</p>
        </NavLink>
      </div>

      <div className="sidebar-options">
        <NavLink to="/orders" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
