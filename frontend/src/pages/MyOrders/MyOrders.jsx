import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import "./MyOrders.css";
import axios from "axios";

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token } = useContext(StoreContext);

  const fetchOrders = async () => {
    const response = await axios.post(
      url + "/api/order/userorders",
      {},
      { headers: { token } }
    );

    setData(response.data.data);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, orderIndex) => (
          <div key={orderIndex} className="my-orders-order">
            <img src={assets.parcel_icon} alt="" />

            {/* --- Order Items --- */}
            <div className="order-items">
              {order.items.map((item, itemIndex) => (
                <div key={itemIndex} className="order-item">
                  <p>
                    <strong>{item.name}</strong> × {item.quantity}
                  </p>

                  {/* --- Addons (if any) --- */}
                  {item.addons && item.addons.length > 0 && (
                    <ul className="addons-list">
                      {item.addons.map((addon, addonIndex) => (
                        <li key={addonIndex} className="addon-item">
                          {addon.name} (${addon.price})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* --- Order Summary --- */}
            <p>Total: ${order.totalAmount}</p>
            <p>Items: {order.items.length}</p>
            <p>
              <span>&#x25cf;</span>
              <b>{order.orderStatus}</b>
            </p>

            <button onClick={fetchOrders}>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
