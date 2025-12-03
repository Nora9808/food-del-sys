import "./OfferList.css";
import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/offer/all`);
    setList(response.data.data);
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

  const removeOffer = async (offerId) => {
    const response = await axios.post(`${url}/api/offer/remove`, {
      offerId: offerId,
    });

    toast.success(response.data.message);
    await fetchList();
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Offers List</p>

      <div className="list-table">
        <div className="offer-list-table-format title">
          <b>Offer Name</b>
          <b>Offer Type</b>
          <b>Offer Amount</b>
          <b>Offer Code </b>
          <b>Limit Per User</b>
          <b>Start Date</b>
          <b>End Date</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="offer-list-table-format">
              <p>{item.name}</p>
              <p>{item.discountType}</p>
              <p>
                {item.discountType === "fixed"
                  ? `$${item.discountAmount}`
                  : `${item.discountAmount}%`}
              </p>
              <p>{item.disCode}</p>
              <p>{item.limitPerUser}</p>
              <p>{formatDateTime12Hour(item.startDate)}</p>
              <p>{formatDateTime12Hour(item.endDate)}</p>
              <p onClick={() => removeOffer(item.offerId)} className="cursor">
                X
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
