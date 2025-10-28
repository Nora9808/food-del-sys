import React, { useState, useEffect } from "react";
import "./OffersBar.css";
import axios from "axios";

const OffersBar = ({ url }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/offer/all`);
    setList(response.data.data);
  };

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
            </p>
          </div>
        ))}
      </div>

      <hr />
    </div>
  );
};

export default OffersBar;
