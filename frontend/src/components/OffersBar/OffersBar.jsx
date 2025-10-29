import React, { useState, useEffect } from "react";
import "./OffersBar.css";
import axios from "axios";

const OffersBar = ({ url }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/offer/all`);
      const offers = response.data.data;

      // Get current date (without time)
      const today = new Date();

      // Filter offers whose startDate <= today <= endDate
      const activeOffers = offers.filter((offer) => {
        const start = new Date(offer.startDate);
        const end = new Date(offer.endDate);
        return start <= today && today <= end;
      });

      setList(activeOffers);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  function formatDateTime12Hour(utcString) {
    const date = new Date(utcString);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Convert to 12-hour format
    hours = hours % 12 || 12; // 0 → 12, 13 → 1, 14 → 2, etc.

    return `${yyyy}-${mm}-${dd} ${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="offers-bar">
      <h1>Available Offers</h1>

      <div className="offers-list">
        {list.map((item, index) => (
          <div key={index} className="offer-card">
            <p>
              {item.name} {item.disCode}
              <br />
              <br />
              Until
              <br /> {formatDateTime12Hour(item.endDate)}
            </p>
          </div>
        ))}
      </div>

      <hr />
    </div>
  );
};

export default OffersBar;
